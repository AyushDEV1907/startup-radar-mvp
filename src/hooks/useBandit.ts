
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useBanditScore(investorId: string) {
  return useQuery({
    queryKey: ['banditScore', investorId],
    queryFn: async () => {
      const res = await fetch('/api/bandit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investor_id: investorId })
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch bandit scores');
      }
      
      const data = await res.json();
      return data.recommendations as Array<{ startup_id: string; p_score: number }>;
    },
    enabled: !!investorId
  });
}

export function useBanditUpdate(investorId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      startupId,
      reward
    }: {
      startupId: string;
      reward: number;
    }) => {
      const res = await fetch('/api/bandit-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investor_id: investorId,
          startup_id: startupId,
          reward
        })
      });
      
      if (!res.ok) {
        throw new Error('Failed to update bandit');
      }
      
      return res.json();
    },
    onSuccess: () => {
      // Invalidate bandit score so the next call recomputes
      queryClient.invalidateQueries({ queryKey: ['banditScore', investorId] });
    }
  });
}
