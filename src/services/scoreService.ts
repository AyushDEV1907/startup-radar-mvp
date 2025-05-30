
interface ScoreRequest {
  industryMatch: number;
  stageMatch: number;
  traction: number;
}

interface ScoreResponse {
  score: number;
}

export const calculateScore = async (data: ScoreRequest): Promise<ScoreResponse> => {
  const response = await fetch("/api/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Score calculation failed: ${response.statusText}`);
  }

  return response.json();
};
