
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries when interaction is recorded
      queryClient.invalidateQueries({ queryKey: ['interactions', variables.investorId] });
      queryClient.invalidateQueries({ queryKey: ['recommendations', variables.investorId] });
    }
  });
}

/**
 * Hook to get interactions for an investor
 */
export function useGetInteractions(investorId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!investorId) {
        throw new Error('Investor ID is required');
      }

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
        throw new Error(error.message);
      }
      return data;
    }
  });
}
