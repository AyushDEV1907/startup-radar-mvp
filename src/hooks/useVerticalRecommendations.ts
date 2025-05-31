
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

      console.log('Vertical recommendations data received:', data);
      return data || [];
    },
    enabled: !!userId && isValidUUID(userId),
    retry: 1,
  });
}
