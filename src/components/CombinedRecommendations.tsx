
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCombinedRecommendations } from '@/hooks/useCombinedRecommendations';
import { StartupCard } from '@/components/StartupCard';
import { TrendingUp } from 'lucide-react';

interface CombinedRecommendationsProps {
  investorId: string;
}

export function CombinedRecommendations({ investorId }: CombinedRecommendationsProps) {
  const { data, isLoading, error } = useCombinedRecommendations(investorId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading personalized recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error loading recommendations</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No recommendations available yet.</p>
            <p className="text-sm text-gray-400 mb-4">
              Start interacting with startups to get personalized suggestions.
            </p>
            <Button onClick={() => window.location.href = '/startups'}>
              Browse Startups →
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Your Recommendations ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map(rec => (
            <StartupCard
              key={rec.startup_id}
              startupId={rec.startup_id}
              name={rec.name}
              industry={rec.industry}
              stage={rec.stage}
              score={rec.score}
              source={rec.source}
            />
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => window.location.href = '/startups'}>
            View All Startups
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
