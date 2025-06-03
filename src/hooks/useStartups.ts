
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useMarketplaceStartups() {
  return useQuery({
    queryKey: ['marketplace-startups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .not('pitch_deck_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch startups: ${error.message}`);
      }

      return data || [];
    }
  });
}

export function useStartupDetail(id: string) {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch startup: ${error.message}`);
      }

      return data;
    },
    enabled: !!id
  });
}
