
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useMarketplaceStartups() {
  return useQuery({
    queryKey: ['marketplace-startups'],
    queryFn: async () => {
      console.log('Fetching marketplace startups...');
      
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .not('pitch_deck_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching startups:', error);
        throw new Error(`Failed to fetch startups: ${error.message}`);
      }

      console.log('Fetched startups:', data?.length || 0);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useStartupDetail(id: string) {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: async () => {
      if (!id) return null;

      console.log('Fetching startup details for:', id);

      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching startup details:', error);
        throw new Error(`Failed to fetch startup: ${error.message}`);
      }

      console.log('Fetched startup details:', data);
      return data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}
