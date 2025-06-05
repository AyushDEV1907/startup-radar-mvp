
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LinUCBRecommendation {
  startup_id: string;
  name: string;
  industry: string;
  stage: string;
  score: number;
  raw_score: number;
  metrics?: any;
}

interface LinUCBResponse {
  recommendations: LinUCBRecommendation[];
  total_candidates: number;
}

export function useLinUCBScore(investorId: string, topN: number = 10) {
  return useQuery({
    queryKey: ['linucb-score', investorId, topN],
    queryFn: async (): Promise<LinUCBResponse> => {
      console.log('Calling LinUCB scoring for investor:', investorId);
      
      const { data, error } = await supabase.functions.invoke('linucb-bandit', {
        body: {
          action: 'score',
          investor_id: investorId,
          top_n: topN
        }
      });

      if (error) {
        console.error('LinUCB scoring error:', error);
        throw new Error(`Failed to get LinUCB scores: ${error.message}`);
      }

      console.log('LinUCB scoring response:', data);
      return data;
    },
    enabled: !!investorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useLinUCBUpdate(investorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      startupId,
      reward
    }: {
      startupId: string;
      reward: number;
    }) => {
      console.log('Updating LinUCB for investor:', investorId, 'startup:', startupId, 'reward:', reward);
      
      const { data, error } = await supabase.functions.invoke('linucb-bandit', {
        body: {
          action: 'update',
          investor_id: investorId,
          startup_id: startupId,
          reward
        }
      });

      if (error) {
        console.error('LinUCB update error:', error);
        throw new Error(`Failed to update LinUCB: ${error.message}`);
      }

      console.log('LinUCB update response:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidate LinUCB scores to get fresh recommendations
      queryClient.invalidateQueries({ queryKey: ['linucb-score', investorId] });
      console.log('LinUCB queries invalidated after successful update');
    },
    onError: (error) => {
      console.error('LinUCB update failed:', error);
    }
  });
}
