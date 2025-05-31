
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useHorizontalRecommendations(userId: string) {
  return useQuery({
    queryKey: ['recommendations', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_horizontal_recommendations', { user_id_input: userId });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!userId, // only run if userId is provided
  });
}
