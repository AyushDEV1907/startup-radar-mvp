
import { useState } from 'react';
import { calculateScore } from '@/services/scoreService';

interface ScoreData {
  industryMatch: number;
  stageMatch: number;
  traction: number;
}

export const useScoreCalculation = () => {
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (data: ScoreData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await calculateScore(data);
      setScore(result.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { score, isLoading, error, calculate };
};
