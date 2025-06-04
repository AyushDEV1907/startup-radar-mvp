
import { useState } from 'react';
import { calculateScore } from '@/services/scoreService';

interface ScoreData {
  investorPrefs: {
    industries: string[];
    stages: string[];
    valuationMin: number;
    valuationMax: number;
    maxBurnRate: number;
  };
  startup: {
    industry: string;
    stage: string;
    valuation: number;
    mrrGrowth: number;
    burnRate: number;
    founderExperienceScore: number;
  };
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
      console.log('Score calculated successfully:', result.score);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Score calculation hook error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { score, isLoading, error, calculate };
};
