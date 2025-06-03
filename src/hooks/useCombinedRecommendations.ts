
import { useQuery } from '@tanstack/react-query';

export function useCombinedRecommendations(investorId: string) {
  return useQuery({
    queryKey: ['combined-recommendations', investorId],
    queryFn: async () => {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investor_id: investorId })
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const json = await res.json();
      return json.recommendations as Array<{
        source: string;
        startup_id: string;
        name: string;
        industry: string;
        stage: string;
        score: number;
      }>;
    },
    enabled: !!investorId
  });
}
