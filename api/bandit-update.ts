
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import {
  buildFeatureVector,
  addOuterProduct,
  addVectors,
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

  const { investor_id, startup_id, reward } = req.body as {
    investor_id?: string;
    startup_id?: string;
    reward?: number;
  };

  if (!investor_id || !startup_id || reward === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Fetch current LinUCB parameters
    const { data: params } = await supabase
      .from('linucb_params')
      .select('*')
      .eq('investor_id', investor_id)
      .single();

    if (!params) {
      return res.status(404).json({ error: 'LinUCB parameters not found' });
    }

    let A = JSON.parse(params.A as string) as number[][];
    let b = JSON.parse(params.b as string) as number[];

    // 2. Fetch startup details to build feature vector
    const { data: startup } = await supabase
      .from('startups')
      .select('industry, stage, metrics')
      .eq('id', startup_id)
      .single();

    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    const x = buildFeatureVector(startup as Startup);

    // 3. Update LinUCB parameters
    A = addOuterProduct(A, x); // A ← A + x x^T
    b = addVectors(b, x.map(xi => xi * reward)); // b ← b + reward * x

    // 4. Store updated parameters
    await supabase
      .from('linucb_params')
      .update({
        A: JSON.stringify(A),
        b: JSON.stringify(b),
        last_updated: new Date().toISOString()
      })
      .eq('investor_id', investor_id);

    return res.json({ success: true });

  } catch (error) {
    console.error('Bandit update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
