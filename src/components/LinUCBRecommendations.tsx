
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLinUCBScore, useLinUCBUpdate } from '@/hooks/useLinUCBBandit';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TrendingUp, DollarSign, Users } from 'lucide-react';

interface LinUCBRecommendationsProps {
  investorId: string;
  topN?: number;
}

interface StartupDetails {
  id: string;
  name: string;
  industry: string;
  stage: string;
  metrics: any;
  pitch_deck_url?: string;
}

export default function LinUCBRecommendations({ 
  investorId, 
  topN = 10 
}: LinUCBRecommendationsProps) {
  const { data: linucbData, isLoading, error } = useLinUCBScore(investorId, topN);
  const linucbUpdate = useLinUCBUpdate(investorId);
  const [currentStartup, setCurrentStartup] = useState<StartupDetails | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    if (linucbData?.recommendations && linucbData.recommendations.length > 0 && currentIndex < linucbData.recommendations.length) {
      const fetchStartupDetails = async () => {
        const recommendation = linucbData.recommendations[currentIndex];
        const { data, error } = await supabase
          .from('startups')
          .select('*')
          .eq('id', recommendation.startup_id)
          .single();

        if (!error && data) {
          setCurrentStartup(data);
          setCurrentScore(recommendation.score);
        }
      };

      fetchStartupDetails();
    }
  }, [linucbData, currentIndex]);

  const handleAction = async (action: 'invest' | 'pass') => {
    if (!currentStartup) return;

    const reward = action === 'invest' ? 1 : 0;

    try {
      await linucbUpdate.mutateAsync({
        startupId: currentStartup.id,
        reward
      });

      toast.success(`LinUCB updated: ${action}`);
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error updating LinUCB:', error);
      toast.error('Failed to update recommendations');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            LinUCB Contextual Bandit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Computing personalized recommendations...</p>
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
            LinUCB Contextual Bandit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            Error: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!linucbData?.recommendations || linucbData.recommendations.length === 0 || currentIndex >= linucbData.recommendations.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            LinUCB Contextual Bandit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              No more startups to review. Your preferences have been learned!
            </p>
            <p className="text-sm text-gray-500">
              Explored {linucbData?.total_candidates || 0} candidates
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentStartup) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            LinUCB Contextual Bandit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading startup details...</div>
        </CardContent>
      </Card>
    );
  }

  const metrics = currentStartup.metrics || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            LinUCB Contextual Bandit
          </div>
          <Badge variant="secondary">
            Score: {(currentScore * 100).toFixed(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">{currentStartup.name}</h3>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{currentStartup.industry}</Badge>
            <Badge variant="outline">{currentStartup.stage}</Badge>
          </div>
        </div>

        {metrics && (
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <div className="font-medium text-sm">MRR</div>
                <div className="text-sm text-muted-foreground">
                  ${metrics.mrr ? Number(metrics.mrr).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <div>
                <div className="font-medium text-sm">Burn Rate</div>
                <div className="text-sm text-muted-foreground">
                  ${metrics.burn_rate ? Number(metrics.burn_rate).toLocaleString() : 'N/A'}/mo
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <div>
                <div className="font-medium text-sm">Founder Exp</div>
                <div className="text-sm text-muted-foreground">
                  {metrics.founder_experience_score || 'N/A'}/10
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => handleAction('invest')}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={linucbUpdate.isPending}
          >
            Invest
          </Button>
          <Button
            onClick={() => handleAction('pass')}
            variant="outline"
            className="flex-1"
            disabled={linucbUpdate.isPending}
          >
            Pass
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2">
          Startup {currentIndex + 1} of {linucbData.recommendations.length} • 
          {linucbData.total_candidates} total candidates
        </div>
      </CardContent>
    </Card>
  );
}
