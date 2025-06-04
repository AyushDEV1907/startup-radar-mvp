
interface ScoreRequest {
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
  decision?: 'invest' | 'pass'; // Add decision to help with recalibration
  investorId?: string; // Add investor ID for personalization
}

interface ScoreResponse {
  score: number;
  calibrationWeight?: number; // Weight based on investor's past decisions
}

export const calculateScore = async (data: ScoreRequest): Promise<ScoreResponse> => {
  try {
    console.log('Sending request body:', data);
    
    const response = await fetch("https://hzboruygxgqfnfmifuuu.supabase.co/functions/v1/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6Ym9ydXlneGdxZm5mbWlmdXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MzY1MzIsImV4cCI6MjA2NDAxMjUzMn0.LxcrQajRt62Op1A63VAoxxMjJpFIyU325mBozcjZfOU`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Score calculation failed:', response.status, errorText);
      throw new Error(`Score calculation failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Response data:', result);
    return result;
  } catch (error) {
    console.error('Score calculation error:', error);
    throw error;
  }
};

// Store calibration decision for improving future recommendations
export const storeCalibrationDecision = async (data: {
  investorId: string;
  startupId: string;
  decision: 'invest' | 'pass';
  score: number;
  startupData: any;
}) => {
  try {
    // This would typically store in your database
    // For now, we'll use localStorage as a simple solution
    const calibrationData = JSON.parse(localStorage.getItem('calibrationData') || '[]');
    calibrationData.push({
      ...data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('calibrationData', JSON.stringify(calibrationData));
    console.log('Calibration decision stored:', data);
  } catch (error) {
    console.error('Error storing calibration decision:', error);
  }
};
