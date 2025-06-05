
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLinUCBUpdate } from './useLinUCBBandit';

/**
 * Hook to record 'invest' or 'pass' interactions.
 */
export function useRecordInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      investorId,
      startupId,
      action,
      isDemo = false
    }: {
      investorId: string;
      startupId: string;
      action: 'invest' | 'pass';
      isDemo?: boolean;
    }) => {
      console.log(`Recording ${action} interaction for investor ${investorId} and startup ${startupId}`);
      
      const { data, error } = await supabase
        .from('interactions')
        .insert({
          investor_id: investorId,
          startup_id: startupId,
          action: action,
          is_demo: isDemo
        })
        .select();

      if (error) {
        console.error('Error recording interaction:', error);
        throw new Error(error.message);
      }
      
      console.log('Successfully recorded interaction:', data);
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries when interaction is recorded
      queryClient.invalidateQueries({ queryKey: ['interactions', variables.investorId] });
      queryClient.invalidateQueries({ queryKey: ['recommendations', variables.investorId] });
      queryClient.invalidateQueries({ queryKey: ['linucb-score', variables.investorId] });
      
      console.log('Invalidated queries after interaction recording');
    },
    onError: (error) => {
      console.error('Failed to record interaction:', error);
    }
  });
}

/**
 * Hook to get interactions for an investor
 */
export function useGetInteractions(investorId?: string) {
  return useMutation({
    mutationFn: async () => {
      if (!investorId) {
        throw new Error('Investor ID is required');
      }

      console.log('Fetching interactions for investor:', investorId);

      const { data, error } = await supabase
        .from('interactions')
        .select(`
          *,
          startups (
            id,
            name,
            industry,
            stage
          )
        `)
        .eq('investor_id', investorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching interactions:', error);
        throw new Error(error.message);
      }
      
      console.log('Fetched interactions:', data?.length || 0);
      return data;
    }
  });
}
