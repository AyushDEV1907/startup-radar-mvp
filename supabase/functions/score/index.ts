
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvestorPrefs {
  industries: string[];
  stages: string[];
  valuationMin: number;
  valuationMax: number;
  maxBurnRate: number;
}

interface Startup {
  industry: string;
  stage: string;
  valuation: number;
  mrrGrowth: number;
  burnRate: number;
  founderExperienceScore: number;
}

interface ScoreRequest {
  investorPrefs: InvestorPrefs;
  startup: Startup;
  decision?: 'invest' | 'pass';
  investorId?: string;
}

// Reinforcement Learning-inspired scoring function
const calculateReinforcementScore = (startup: Startup, prefs: InvestorPrefs): number => {
  let rlScore = 0;
  
  // Industry matching with exponential reward
  if (prefs.industries.includes(startup.industry)) {
    rlScore += 25; // Base reward
    rlScore += Math.min(15, startup.mrrGrowth * 3); // Growth bonus
  } else {
    rlScore -= 10; // Penalty for mismatch
  }
  
  // Stage matching with weighted importance
  if (prefs.stages.includes(startup.stage)) {
    rlScore += 20;
    // Bonus for growth-stage alignment
    const stageMultipliers = { 'Pre-Seed': 1.2, 'Seed': 1.5, 'Series A': 1.8, 'Series B': 2.0 };
    const multiplier = stageMultipliers[startup.stage as keyof typeof stageMultipliers] || 1.0;
    rlScore += startup.mrrGrowth * multiplier;
  }
  
  // Valuation within range (sigmoid function for gradual scoring)
  if (startup.valuation >= prefs.valuationMin && startup.valuation <= prefs.valuationMax) {
    rlScore += 20;
    // Optimal valuation bonus (middle of range gets highest score)
    const midPoint = (prefs.valuationMin + prefs.valuationMax) / 2;
    const deviation = Math.abs(startup.valuation - midPoint) / (prefs.valuationMax - prefs.valuationMin);
    rlScore += 10 * (1 - deviation); // 0-10 bonus based on proximity to ideal
  } else {
    const overshoot = startup.valuation > prefs.valuationMax ? 
      (startup.valuation - prefs.valuationMax) / prefs.valuationMax :
      (prefs.valuationMin - startup.valuation) / prefs.valuationMin;
    rlScore -= Math.min(20, overshoot * 30); // Progressive penalty
  }
  
  // MRR Growth (exponential reward for high growth)
  if (startup.mrrGrowth > 0) {
    rlScore += Math.min(20, startup.mrrGrowth * 8); // Cap at 20 points
    if (startup.mrrGrowth > 2.0) rlScore += 5; // Bonus for hypergrowth
  } else {
    rlScore -= 15; // Penalty for negative growth
  }
  
  // Burn rate efficiency
  if (startup.burnRate < prefs.maxBurnRate) {
    const efficiency = (prefs.maxBurnRate - startup.burnRate) / prefs.maxBurnRate;
    rlScore += efficiency * 15; // 0-15 bonus based on efficiency
  } else {
    const excess = (startup.burnRate - prefs.maxBurnRate) / prefs.maxBurnRate;
    rlScore -= Math.min(20, excess * 25); // Progressive penalty
  }
  
  // Founder experience (sigmoid transformation)
  const founderBonus = startup.founderExperienceScore > 7 ? 
    10 + (startup.founderExperienceScore - 7) * 2 : 
    startup.founderExperienceScore;
  rlScore += founderBonus;
  
  return Math.max(0, Math.min(100, rlScore)); // Clamp between 0-100
};

// Collaborative Filtering component
const calculateCollaborativeScore = (startup: Startup, investorId?: string): number => {
  // Simulated collaborative filtering based on similar investor patterns
  // In a real implementation, this would query a database of investor decisions
  
  let cfScore = 50; // Base collaborative score
  
  // Industry popularity factor
  const industryPopularity = {
    'FinTech': 0.85,
    'HealthTech': 0.80,
    'AI/ML': 0.90,
    'EdTech': 0.70,
    'CleanTech': 0.75,
    'Cybersecurity': 0.85,
    'E-commerce': 0.65,
    'HR Tech': 0.60,
    'AgTech': 0.55
  };
  
  const popularity = industryPopularity[startup.industry as keyof typeof industryPopularity] || 0.5;
  cfScore += (popularity - 0.5) * 30; // Adjust based on industry popularity
  
  // Stage preference factor
  const stagePreference = {
    'Pre-Seed': 0.6,
    'Seed': 0.8,
    'Series A': 0.9,
    'Series B': 0.7
  };
  
  const stagePref = stagePreference[startup.stage as keyof typeof stagePreference] || 0.5;
  cfScore += (stagePref - 0.5) * 20;
  
  // Growth factor (high growth startups get collaborative boost)
  if (startup.mrrGrowth > 2.0) cfScore += 15;
  else if (startup.mrrGrowth > 1.0) cfScore += 10;
  else if (startup.mrrGrowth < 0) cfScore -= 15;
  
  return Math.max(0, Math.min(100, cfScore));
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { investorPrefs, startup, decision, investorId }: ScoreRequest = await req.json();

    console.log('Processing score request for:', {
      industry: startup.industry,
      stage: startup.stage,
      investorId: investorId || 'anonymous',
      decision: decision || 'none'
    });

    // Calculate Reinforcement Learning score (70% weight)
    const rlScore = calculateReinforcementScore(startup, investorPrefs);
    
    // Calculate Collaborative Filtering score (30% weight)
    const cfScore = calculateCollaborativeScore(startup, investorId);
    
    // Combine scores with weighted approach
    const finalScore = Math.round(rlScore * 0.7 + cfScore * 0.3);
    
    console.log(`Calculated scores - RL: ${rlScore}, CF: ${cfScore}, Final: ${finalScore} for startup in ${startup.industry} industry`);

    return new Response(
      JSON.stringify({ 
        score: finalScore,
        breakdown: {
          reinforcementLearning: rlScore,
          collaborativeFiltering: cfScore,
          weights: { rl: 0.7, cf: 0.3 }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in score function:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
