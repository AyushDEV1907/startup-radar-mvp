
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
}

interface ScoreResponse {
  score: number;
}

export const calculateScore = async (data: ScoreRequest): Promise<ScoreResponse> => {
  try {
    console.log('Sending request body:', data);
    
    const response = await fetch("/functions/v1/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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
