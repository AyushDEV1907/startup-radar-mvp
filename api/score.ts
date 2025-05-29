// api/score.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { industryMatch, stageMatch, traction } = req.body;

  if (
    typeof industryMatch !== 'number' ||
    typeof stageMatch !== 'number' ||
    typeof traction !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const scoreRaw = 0.4 * industryMatch + 0.3 * stageMatch + 0.3 * traction;
  const scorePercent = Math.round((1 / (1 + Math.exp(-scoreRaw))) * 100);

  res.status(200).json({ score: scorePercent });
}


