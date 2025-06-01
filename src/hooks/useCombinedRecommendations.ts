
import { useQuery } from '@tanstack/react-query';
import { useHorizontalRecommendations } from './useHorizontalRecommendations';
import { useVerticalRecommendations } from './useVerticalRecommendations';

interface CombinedRecommendation {
  id: string;
  name: string;
  industry: string;
  stage: string;
  score: number;
  type: 'horizontal' | 'vertical';
  label: 'Suggested' | 'Curated';
}

export function useCombinedRecommendations(userId: string) {
  const horizontalQuery = useHorizontalRecommendations(userId);
  const verticalQuery = useVerticalRecommendations(userId);

  return useQuery({
    queryKey: ['combined-recommendations', userId],
    queryFn: async () => {
      // Wait for both queries to complete
      const [horizontalData, verticalData] = await Promise.all([
        horizontalQuery.refetch().then(result => result.data || []),
        verticalQuery.refetch().then(result => result.data || [])
      ]);

      // Transform horizontal recommendations
      const horizontalRecommendations: CombinedRecommendation[] = horizontalData.map((item: any) => ({
        id: item.id,
        name: item.name,
        industry: item.industry,
        stage: item.stage,
        score: 0.7, // Default collaborative filtering score
        type: 'horizontal' as const,
        label: 'Suggested' as const
      }));

      // Transform vertical recommendations
      const verticalRecommendations: CombinedRecommendation[] = verticalData.map((item: any) => ({
        id: item.id,
        name: item.name,
        industry: item.industry,
        stage: item.stage,
        score: Math.min(Math.max(item.score / 10, 0), 1), // Normalize score to 0-1 range
        type: 'vertical' as const,
        label: 'Curated' as const
      }));

      // Combine and sort by score
      const combined = [...horizontalRecommendations, ...verticalRecommendations];
      return combined.sort((a, b) => b.score - a.score);
    },
    enabled: !!userId && horizontalQuery.data !== undefined && verticalQuery.data !== undefined,
    retry: 1,
  });
}
