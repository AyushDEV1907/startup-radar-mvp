
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import {
  buildFeatureVector,
  identityMatrix,
  zeroVector,
  inverseMatrix,
  matrixVectorMultiply,
  vectorDot,
  INDUSTRIES,
  STAGES,
  type Startup
} from '../src/utils/banditHelpers';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { investor_id } = req.body as { investor_id?: string };
  if (!investor_id) {
    return res.status(400).json({ error: 'Missing investor_id' });
  }

  try {
    // Feature dimension: industries + stages + 3 metrics
    const d = INDUSTRIES.length + STAGES.length + 3;

    // 1. Fetch or initialize LinUCB params
    let { data: params } = await supabase
      .from('linucb_params')
      .select('*')
      .eq('investor_id', investor_id)
      .single();

    let A: number[][], b: number[];
    if (!params) {
      A = identityMatrix(d);
      b = zeroVector(d);
      await supabase.from('linucb_params').insert({
        investor_id,
        A: JSON.stringify(A),
        b: JSON.stringify(b),
      });
    } else {
      A = JSON.parse(params.A as string) as number[][];
      b = JSON.parse(params.b as string) as number[];
    }

    // 2. Fetch startups the investor hasn't interacted with
    const { data: seen } = await supabase
      .from('interactions')
      .select('startup_id')
      .eq('investor_id', investor_id);
    
    const seenIds = seen?.map(r => r.startup_id) || [];

    let candidatesQuery = supabase
      .from('startups')
      .select('id, industry, stage, metrics');

    if (seenIds.length > 0) {
      candidatesQuery = candidatesQuery.not('id', 'in', `(${seenIds.map(id => `'${id}'`).join(',')})`);
    }

    const { data: candidates } = await candidatesQuery;

    if (!candidates || candidates.length === 0) {
      return res.json({ recommendations: [] });
    }

    // 3. Compute LinUCB scores
    const A_inv = inverseMatrix(A);
    const theta = matrixVectorMultiply(A_inv, b);
    const alpha = 1.0;

    const scored: Array<{ startup_id: string; p_score: number }> = [];

    for (const candidate of candidates) {
      const x = buildFeatureVector(candidate as Startup);
      const mean = vectorDot(theta, x);
      const xAinv = matrixVectorMultiply(A_inv, x);
      const uncertainty = Math.sqrt(Math.max(0, vectorDot(xAinv, x)));
      const p = mean + alpha * uncertainty;
      scored.push({ startup_id: candidate.id, p_score: p });
    }

    scored.sort((a, b) => b.p_score - a.p_score);
    return res.json({ recommendations: scored.slice(0, 10) });

  } catch (error) {
    console.error('Bandit score error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
