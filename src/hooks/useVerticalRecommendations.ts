
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function useVerticalRecommendations(userId: string) {
  return useQuery({
    queryKey: ['vertical-recommendations', userId],
    queryFn: async () => {
      if (!isValidUUID(userId)) {
        throw new Error('Invalid user ID format. Please use a valid UUID.');
      }

      console.log('Calling get_vertical_recommendations with userId:', userId);
      
      const { data, error } = await supabase
        .rpc('get_vertical_recommendations', { user_id_input: userId });

      if (error) {
        console.error('Supabase RPC error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      // Transform the response to match the expected interface
      const recommendations = data?.map(item => ({
        startup_id: item.id, // Map 'id' to 'startup_id'
        name: item.name,
        industry: item.industry,
        stage: item.stage,
        rl_score: item.score || 0 // Map 'score' to 'rl_score'
      })) || [];

      console.log('Vertical recommendations data received:', recommendations);
      return recommendations;
    },
    enabled: !!userId && isValidUUID(userId),
    retry: 1,
  });
}
