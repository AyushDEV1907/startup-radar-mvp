import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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
    // Fetch vertical and horizontal recommendations in parallel
    const [vert, horz] = await Promise.all([
      supabase.rpc('get_vertical_recommendations', { user_id_input: investor_id }),
      supabase.rpc('get_horizontal_recommendations', { user_id_input: investor_id })
    ]);

    if (vert.error) {
      console.error('Vertical recommendations error:', vert.error);
      return res.status(500).json({ error: vert.error.message });
    }
    
    if (horz.error) {
      console.error('Horizontal recommendations error:', horz.error);
      return res.status(500).json({ error: horz.error.message });
    }

    // Transform and weight the results (RL=0.7, CF=0.3)
    const vertData = (vert.data || []).map((item: any) => ({
      source: 'vertical',
      startup_id: item.startup_id,
      name: item.name,
      industry: item.industry,
      stage: item.stage,
      score: (item.rl_score || 0) * 0.7
    }));
    
    const horzData = (horz.data || []).map((item: any) => ({
      source: 'horizontal',
      startup_id: item.startup_id,
      name: item.name,
      industry: item.industry,
      stage: item.stage,
      score: (item.cf_score || 0) * 0.3
    }));

    // Combine and deduplicate (keep highest score for each startup)
    const combinedMap: Record<string, any> = {};
    [...vertData, ...horzData].forEach(rec => {
      const id = rec.startup_id;
      if (!combinedMap[id] || rec.score > combinedMap[id].score) {
        combinedMap[id] = rec;
      }
    });

    // Sort by score descending
    const combined = Object.values(combinedMap).sort((a: any, b: any) => b.score - a.score);

    return res.status(200).json({ recommendations: combined });
  } catch (error: any) {
    console.error('Recommendations API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
