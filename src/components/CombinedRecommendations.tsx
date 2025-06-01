
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp, Star, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CombinedRecommendationsProps {
  userId: string;
}

interface HorizontalRecommendation {
  id: string;
  name: string;
  industry: string;
  stage: string;
}

interface VerticalRecommendation {
  id: string;
  name: string;
  industry: string;
  stage: string;
  score: number;
}

interface CombinedRecommendation {
  id: string;
  title: string;
  description: string;
  image: string;
  source: 'suggested' | 'curated';
  score: number;
  label: 'Suggested' | 'Curated';
  industry?: string;
  stage?: string;
}

function CombinedRecommendations({ userId }: CombinedRecommendationsProps) {
  // Fetch horizontal recommendations
  const horizontalQuery = useQuery({
    queryKey: ['horizontal-recommendations', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_horizontal_recommendations', { user_id_input: userId });
      
      if (error) throw new Error(`Horizontal recommendations error: ${error.message}`);
      return data || [];
    },
    enabled: !!userId,
  });

  // Fetch vertical recommendations
  const verticalQuery = useQuery({
    queryKey: ['vertical-recommendations', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_vertical_recommendations', { user_id_input: userId });
      
      if (error) throw new Error(`Vertical recommendations error: ${error.message}`);
      return data || [];
    },
    enabled: !!userId,
  });

  // Combine recommendations
  const { data: combinedRecommendations, isLoading, error } = useQuery({
    queryKey: ['combined-recommendations', userId],
    queryFn: async () => {
      const [horizontalData, verticalData] = await Promise.all([
        horizontalQuery.refetch().then(result => result.data || []),
        verticalQuery.refetch().then(result => result.data || [])
      ]);

      // Transform horizontal recommendations
      const horizontal: CombinedRecommendation[] = horizontalData.map((item: HorizontalRecommendation) => ({
        id: item.id,
        title: item.name,
        description: `${item.industry} startup in ${item.stage} stage`,
        image: '/placeholder.svg',
        source: 'suggested' as const,
        score: 0.6, // Default collaborative filtering score
        label: 'Suggested' as const,
        industry: item.industry,
        stage: item.stage
      }));

      // Transform vertical recommendations  
      const vertical: CombinedRecommendation[] = verticalData.map((item: VerticalRecommendation) => ({
        id: item.id,
        title: item.name,
        description: `${item.industry} startup in ${item.stage} stage`,
        image: '/placeholder.svg',
        source: 'curated' as const,
        score: item.score * 0.9,
        label: 'Curated' as const,
        industry: item.industry,
        stage: item.stage
      }));

      // Combine and sort by score descending
      const combined = [...horizontal, ...vertical];
      return combined.sort((a, b) => b.score - a.score);
    },
    enabled: !!userId && horizontalQuery.data !== undefined && verticalQuery.data !== undefined,
  });

  if (isLoading || horizontalQuery.isLoading || verticalQuery.isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 w-5 h-5" />
            Your Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-4 flex-1">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || horizontalQuery.error || verticalQuery.error) {
    const errorMessage = error?.message || horizontalQuery.error?.message || verticalQuery.error?.message;
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <TrendingUp className="mr-2 w-5 h-5" />
            Recommendations Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error loading recommendations: {errorMessage}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!combinedRecommendations || combinedRecommendations.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 w-5 h-5" />
            Your Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No recommendations available yet. Start interacting with startups to get personalized suggestions.</p>
          <Link to="/startups">
            <Button variant="outline" className="mt-4">
              Browse Startups
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 w-5 h-5" />
            Your Recommendations
          </CardTitle>
          <Link to="/startups">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {combinedRecommendations.map((recommendation) => (
          <div 
            key={recommendation.id} 
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-4 mb-3">
              {/* Image */}
              <img 
                src={recommendation.image} 
                alt={recommendation.title}
                className="w-16 h-16 object-cover rounded-lg bg-gray-100"
              />
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg">{recommendation.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    recommendation.source === 'suggested' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {recommendation.label}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {recommendation.description}
                </p>
                
                {/* Industry and Stage tags */}
                {recommendation.industry && recommendation.stage && (
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {recommendation.industry}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {recommendation.stage}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Score and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Relevance Score:</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        recommendation.score >= 0.6 ? 'bg-green-500' :
                        recommendation.score >= 0.3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(recommendation.score * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {(recommendation.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link to={`/startups/${recommendation.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <Star className="mr-1 w-3 h-3" />
                  Invest
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default CombinedRecommendations;
