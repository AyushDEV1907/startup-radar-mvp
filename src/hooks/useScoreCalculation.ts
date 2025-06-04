
import { useState } from 'react';
import { calculateScore, storeCalibrationDecision } from '@/services/scoreService';

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
  decision?: 'invest' | 'pass';
  investorId?: string;
}

export const useScoreCalculation = () => {
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calibrationWeights, setCalibrationWeights] = useState<Record<string, number>>({});

  const calculate = async (data: ScoreData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get previous calibration data to adjust scoring
      const calibrationData = JSON.parse(localStorage.getItem('calibrationData') || '[]');
      const investorCalibrations = calibrationData.filter((item: any) => item.investorId === data.investorId);
      
      // Calculate calibration weights based on past decisions
      const industryWeights: Record<string, number> = {};
      const stageWeights: Record<string, number> = {};
      
      investorCalibrations.forEach((calibration: any) => {
        const weight = calibration.decision === 'invest' ? 1.2 : 0.8;
        industryWeights[calibration.startupData.industry] = 
          (industryWeights[calibration.startupData.industry] || 1.0) * weight;
        stageWeights[calibration.startupData.stage] = 
          (stageWeights[calibration.startupData.stage] || 1.0) * weight;
      });

      setCalibrationWeights({ ...industryWeights, ...stageWeights });

      const result = await calculateScore({
        ...data,
        // Include calibration context
        investorId: data.investorId
      });
      
      // Apply calibration weights to the score
      let adjustedScore = result.score;
      const industryWeight = industryWeights[data.startup.industry] || 1.0;
      const stageWeight = stageWeights[data.startup.stage] || 1.0;
      
      adjustedScore = Math.min(100, adjustedScore * Math.sqrt(industryWeight * stageWeight));
      
      setScore(Math.round(adjustedScore));
      console.log('Score calculated successfully with calibration:', {
        originalScore: result.score,
        adjustedScore,
        industryWeight,
        stageWeight
      });

      // Store the decision for future calibration if provided
      if (data.decision && data.investorId) {
        await storeCalibrationDecision({
          investorId: data.investorId,
          startupId: `startup_${Date.now()}`, // Would be actual startup ID in real implementation
          decision: data.decision,
          score: adjustedScore,
          startupData: data.startup
        });
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Score calculation hook error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getCalibrationInsights = () => {
    const calibrationData = JSON.parse(localStorage.getItem('calibrationData') || '[]');
    
    if (calibrationData.length === 0) return null;
    
    const investDecisions = calibrationData.filter((item: any) => item.decision === 'invest');
    const passDecisions = calibrationData.filter((item: any) => item.decision === 'pass');
    
    const preferredIndustries = investDecisions.reduce((acc: Record<string, number>, item: any) => {
      acc[item.startupData.industry] = (acc[item.startupData.industry] || 0) + 1;
      return acc;
    }, {});
    
    const preferredStages = investDecisions.reduce((acc: Record<string, number>, item: any) => {
      acc[item.startupData.stage] = (acc[item.startupData.stage] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalDecisions: calibrationData.length,
      investRate: (investDecisions.length / calibrationData.length) * 100,
      preferredIndustries: Object.keys(preferredIndustries).sort((a, b) => preferredIndustries[b] - preferredIndustries[a]),
      preferredStages: Object.keys(preferredStages).sort((a, b) => preferredStages[b] - preferredStages[a]),
      calibrationWeights
    };
  };

  return { 
    score, 
    isLoading, 
    error, 
    calculate, 
    calibrationWeights,
    getCalibrationInsights 
  };
};
