
import { useCombinedRecommendations } from '@/hooks/useCombinedRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp, Star, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CombinedRecommendationsProps {
  userId: string;
}

function CombinedRecommendations({ userId }: CombinedRecommendationsProps) {
  const { data: recommendations, isLoading, error } = useCombinedRecommendations(userId);

  if (isLoading) {
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
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <div className="flex gap-2 mb-2">
                    <Skeleton className="h-6 w-16" />
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

  if (error) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <TrendingUp className="mr-2 w-5 h-5" />
            Recommendations Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error loading recommendations: {error.message}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
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
        {recommendations.map((startup) => (
          <div key={startup.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{startup.name}</h4>
                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {startup.industry}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    {startup.stage}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                  startup.type === 'vertical' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {startup.label}
                </span>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    Score: {(startup.score * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* Relevance Score Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Relevance</span>
                <span>{(startup.score * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    startup.score >= 0.7 ? 'bg-green-500' :
                    startup.score >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${startup.score * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link to={`/startups/${startup.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Star className="mr-1 w-3 h-3" />
                Invest
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default CombinedRecommendations;
