
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBanditScore, useBanditUpdate } from '@/hooks/useBandit';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BanditRecommendationsProps {
  investorId: string;
}

interface StartupDetails {
  id: string;
  name: string;
  industry: string;
  stage: string;
  metrics: any;
  pitch_deck_url?: string;
}

export default function BanditRecommendations({ investorId }: BanditRecommendationsProps) {
  const { data: banditData, isLoading, error } = useBanditScore(investorId);
  const banditUpdate = useBanditUpdate(investorId);
  const [currentStartup, setCurrentStartup] = useState<StartupDetails | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banditData && banditData.length > 0 && currentIndex < banditData.length) {
      const fetchStartupDetails = async () => {
        const { data, error } = await supabase
          .from('startups')
          .select('id, name, industry, stage, metrics, pitch_deck_url')
          .eq('id', banditData[currentIndex].startup_id)
          .single();

        if (!error && data) {
          setCurrentStartup(data);
        }
      };

      fetchStartupDetails();
    }
  }, [banditData, currentIndex]);

  const handleAction = async (action: 'invest' | 'pass') => {
    if (!currentStartup) return;

    const reward = action === 'invest' ? 1 : 0;

    try {
      // Record interaction
      await supabase.from('interactions').insert({
        investor_id: investorId,
        startup_id: currentStartup.id,
        action,
        is_demo: false
      });

      // Update bandit parameters
      await banditUpdate.mutateAsync({
        startupId: currentStartup.id,
        reward
      });

      toast.success(`Action recorded: ${action}`);

      // Move to next startup
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error recording action:', error);
      toast.error('Failed to record action');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading next best startup...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            Error loading recommendations: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!banditData || banditData.length === 0 || currentIndex >= banditData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            No more startups to review. Great job!
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentStartup) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading startup details...</div>
        </CardContent>
      </Card>
    );
  }

  const metrics = currentStartup.metrics || {};
  const confidenceScore = banditData[currentIndex]?.p_score || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          AI-Powered Recommendations
          <Badge variant="secondary">
            Confidence: {(confidenceScore * 100).toFixed(1)}%
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
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium">MRR</div>
              <div className="text-muted-foreground">
                ${metrics.mrr ? Number(metrics.mrr).toLocaleString() : 'N/A'}
              </div>
            </div>
            <div>
              <div className="font-medium">Burn Rate</div>
              <div className="text-muted-foreground">
                ${metrics.burn_rate ? Number(metrics.burn_rate).toLocaleString() : 'N/A'}/mo
              </div>
            </div>
            <div>
              <div className="font-medium">Founder Experience</div>
              <div className="text-muted-foreground">
                {metrics.founder_experience_score || 'N/A'}/10
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => handleAction('invest')}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={banditUpdate.isPending}
          >
            Invest
          </Button>
          <Button
            onClick={() => handleAction('pass')}
            variant="outline"
            className="flex-1"
            disabled={banditUpdate.isPending}
          >
            Pass
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2">
          Startup {currentIndex + 1} of {banditData.length} recommendations
        </div>
      </CardContent>
    </Card>
  );
}
