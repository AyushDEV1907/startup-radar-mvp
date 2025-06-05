
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// LinUCB Helper Functions (matching the Python implementation)
const INDUSTRIES = [
  "HealthTech", "FinTech", "EdTech", "AI/ML", "SaaS", 
  "Gaming", "CleanTech", "E-commerce", "Biotech", "Cybersecurity"
];

const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"];

function buildFeatureVector(startup: any): number[] {
  const industry = startup.industry || "";
  const stage = startup.stage || "";
  const metrics = startup.metrics || {};

  // Industry one-hot (10 dims)
  const industryVec = INDUSTRIES.map(i => industry === i ? 1.0 : 0.0);
  
  // Stage one-hot (5 dims)
  const stageVec = STAGES.map(s => stage === s ? 1.0 : 0.0);
  
  // Normalize metrics (3 dims)
  const mrr = Number(metrics.mrr || 0);
  const burn = Number(metrics.burn_rate || 0);
  const fe = Number(metrics.founder_experience_score || 0);
  
  const mrrNorm = Math.min(mrr / 200000.0, 1.0);
  const burnNorm = Math.min(burn / 100000.0, 1.0);
  const feNorm = Math.min(fe / 10.0, 1.0);
  
  return [...industryVec, ...stageVec, mrrNorm, burnNorm, feNorm];
}

function identityMatrix(d: number): number[][] {
  return Array.from({ length: d }, (_, i) =>
    Array.from({ length: d }, (_, j) => i === j ? 1.0 : 0.0)
  );
}

function zeroVector(d: number): number[] {
  return Array(d).fill(0.0);
}

function matrixInverse(matrix: number[][]): number[][] {
  const n = matrix.length;
  const augmented = matrix.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => i === j ? 1 : 0)
  ]);

  // Gauss-Jordan elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    // Make diagonal element 1
    const pivot = augmented[i][i];
    if (Math.abs(pivot) < 1e-10) continue; // Skip near-zero pivots
    
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= pivot;
    }

    // Eliminate column
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = augmented[k][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
  }

  return augmented.map(row => row.slice(n));
}

function matrixVectorMult(matrix: number[][], vector: number[]): number[] {
  return matrix.map(row => 
    row.reduce((sum, val, j) => sum + val * vector[j], 0)
  );
}

function vectorDot(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function addOuterProduct(A: number[][], x: number[]): number[][] {
  const d = x.length;
  return A.map((row, i) =>
    row.map((val, j) => val + x[i] * x[j])
  );
}

function addVector(a: number[], b: number[]): number[] {
  return a.map((val, i) => val + b[i]);
}

function ucbScore(A: number[][], b: number[], x: number[], alpha: number = 1.0): number {
  const AInv = matrixInverse(A);
  const theta = matrixVectorMult(AInv, b);
  const mean = vectorDot(theta, x);
  const xAinv = matrixVectorMult(AInv, x);
  const uncertainty = Math.sqrt(Math.max(0, vectorDot(xAinv, x)));
  return mean + alpha * uncertainty;
}

function calibrateScore(score: number, startup: any, preferences: any): number {
  let calibratedScore = score;
  
  // Penalize startups not in preferred industries
  if (preferences.industries && !preferences.industries.includes(startup.industry)) {
    calibratedScore *= 0.7; // 30% penalty
  }
  
  // Penalize startups not in preferred stages
  if (preferences.stages && !preferences.stages.includes(startup.stage)) {
    calibratedScore *= 0.8; // 20% penalty
  }
  
  // Apply ticket size and risk preferences if available
  const metrics = startup.metrics || {};
  const valuation = Number(metrics.valuation || 0);
  
  if (preferences.ticket_size_min && preferences.ticket_size_max) {
    if (valuation < preferences.ticket_size_min || valuation > preferences.ticket_size_max) {
      calibratedScore *= 0.6; // 40% penalty for out-of-range valuations
    }
  }
  
  return calibratedScore;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, investor_id, startup_id, reward, top_n = 10 } = await req.json();

    if (!investor_id) {
      return new Response(
        JSON.stringify({ error: 'investor_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const d = 18; // Feature dimension

    // Get or initialize bandit state
    let { data: banditState } = await supabase
      .from('bandit_state')
      .select('*')
      .eq('investor_id', investor_id)
      .single();

    let A: number[][], b: number[];
    if (!banditState) {
      A = identityMatrix(d);
      b = zeroVector(d);
      await supabase.from('bandit_state').insert({
        investor_id,
        A: JSON.stringify(A),
        b: JSON.stringify(b),
        feature_dimension: d
      });
    } else {
      A = JSON.parse(banditState.A);
      b = JSON.parse(banditState.b);
    }

    // Handle bandit update
    if (action === 'update' && startup_id && reward !== undefined) {
      // Get startup details
      const { data: startup } = await supabase
        .from('startups')
        .select('*')
        .eq('id', startup_id)
        .single();

      if (!startup) {
        return new Response(
          JSON.stringify({ error: 'Startup not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const x = buildFeatureVector(startup);
      
      // Update A and b
      A = addOuterProduct(A, x);
      b = addVector(b, x.map(xi => xi * reward));

      // Save updated state
      await supabase
        .from('bandit_state')
        .update({
          A: JSON.stringify(A),
          b: JSON.stringify(b)
        })
        .eq('investor_id', investor_id);

      // Record interaction
      await supabase.from('interactions').insert({
        investor_id,
        startup_id,
        action: reward > 0 ? 'invest' : 'pass',
        is_demo: false
      });

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle scoring request
    if (action === 'score') {
      // Get investor preferences
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', investor_id)
        .single();

      // Get startups the investor hasn't seen
      const { data: interactions } = await supabase
        .from('interactions')
        .select('startup_id')
        .eq('investor_id', investor_id);

      const seenIds = interactions?.map(i => i.startup_id) || [];

      let candidatesQuery = supabase
        .from('startups')
        .select('*');

      if (seenIds.length > 0) {
        candidatesQuery = candidatesQuery.not('id', 'in', `(${seenIds.map(id => `'${id}'`).join(',')})`);
      }

      const { data: candidates } = await candidatesQuery.limit(50); // Limit for performance

      if (!candidates || candidates.length === 0) {
        return new Response(
          JSON.stringify({ recommendations: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Score all candidates
      const scored = candidates.map(startup => {
        const x = buildFeatureVector(startup);
        const rawScore = ucbScore(A, b, x, 1.0);
        const calibratedScore = calibrateScore(rawScore, startup, user || {});
        
        return {
          startup_id: startup.id,
          name: startup.name,
          industry: startup.industry,
          stage: startup.stage,
          score: calibratedScore,
          raw_score: rawScore,
          metrics: startup.metrics
        };
      });

      // Sort by calibrated score and return top N
      scored.sort((a, b) => b.score - a.score);
      const topRecommendations = scored.slice(0, top_n);

      console.log(`Generated ${topRecommendations.length} LinUCB recommendations for investor ${investor_id}`);

      return new Response(
        JSON.stringify({ 
          recommendations: topRecommendations,
          total_candidates: candidates.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use "score" or "update".' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('LinUCB Bandit Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
