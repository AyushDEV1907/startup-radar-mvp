
import { useHorizontalRecommendations } from '@/hooks/useHorizontalRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';

interface RecommendationsProps {
  userId: string;
}

interface Startup {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  stage?: string;
  score?: number;
  mrr?: string;
  growth?: string;
  // Add other possible fields that might be returned
  funding_stage?: string;
  company_name?: string;
  tagline?: string;
}

function Recommendations({ userId }: RecommendationsProps) {
  const { data: recommendations, isLoading, error } = useHorizontalRecommendations(userId);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 w-5 h-5" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Star className="mr-2 w-5 h-5" />
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
            <Star className="mr-2 w-5 h-5" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No recommendations available at the moment.</p>
          <Link to="/investor-calibrate">
            <Button variant="outline" className="mt-4">
              Update Your Preferences
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
            <Star className="mr-2 w-5 h-5" />
            Recommended for You
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
        {recommendations.map((startup: Startup) => (
          <div key={startup.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold">{startup.name || startup.company_name}</h4>
                {(startup.industry || startup.stage || startup.funding_stage) && (
                  <div className="flex gap-2 mt-1">
                    {startup.industry && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {startup.industry}
                      </span>
                    )}
                    {(startup.stage || startup.funding_stage) && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        {startup.stage || startup.funding_stage}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {startup.score && (
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{startup.score}%</div>
                  <div className="text-xs text-gray-600">Match Score</div>
                </div>
              )}
            </div>
            
            {(startup.description || startup.tagline) && (
              <p className="text-gray-600 text-sm mb-3">{startup.description || startup.tagline}</p>
            )}
            
            {(startup.mrr || startup.growth) && (
              <div className="grid grid-cols-2 gap-4 mb-3">
                {startup.mrr && (
                  <div>
                    <span className="text-sm text-gray-600">MRR:</span>
                    <span className="ml-2 font-medium">{startup.mrr}</span>
                  </div>
                )}
                {startup.growth && (
                  <div>
                    <span className="text-sm text-gray-600">Growth:</span>
                    <span className="ml-2 font-medium text-green-600">{startup.growth}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <Link to={`/startups/${startup.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Invest
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default Recommendations;
