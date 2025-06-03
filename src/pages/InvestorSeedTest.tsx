
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, DollarSign, Users, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

interface Startup {
  id: string;
  name: string;
  industry: string;
  stage: string;
  metrics: {
    mrr: number;
    growth_rate: number;
    founder_experience: number;
  };
}

export default function InvestorSeedTest() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [decisions, setDecisions] = useState<Array<{startupId: string, action: 'invest' | 'pass'}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/investor-signup');
        return;
      }
      setUser(user);
      await fetchStartups();
    };
    initialize();
  }, [navigate]);

  const fetchStartups = async () => {
    try {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .limit(8);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch startups",
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match our interface
      const transformedStartups = data?.map(startup => ({
        id: startup.id,
        name: startup.name,
        industry: startup.industry,
        stage: startup.stage,
        metrics: typeof startup.metrics === 'object' && startup.metrics !== null 
          ? startup.metrics as { mrr: number; growth_rate: number; founder_experience: number }
          : { mrr: 0, growth_rate: 0, founder_experience: 0 }
      })) || [];

      // Randomly select 5 startups
      const shuffled = transformedStartups.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      setStartups(selected);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const makeDecision = async (action: 'invest' | 'pass') => {
    if (!user || currentIndex >= startups.length) return;

    const startup = startups[currentIndex];
    const newDecision = { startupId: startup.id, action };
    const updatedDecisions = [...decisions, newDecision];
    setDecisions(updatedDecisions);

    // Record interaction in database
    try {
      const { error } = await supabase
        .from('interactions')
        .insert({
          investor_id: user.id,
          startup_id: startup.id,
          action: action,
          is_demo: true
        });

      if (error) {
        console.error('Error recording interaction:', error);
      }
    } catch (error) {
      console.error('Error recording interaction:', error);
    }

    // Move to next startup or finish
    if (currentIndex + 1 >= startups.length) {
      // All 5 decisions made, redirect to dashboard
      toast({
        title: "Complete!",
        description: "You've evaluated all 5 startups. Redirecting to your dashboard...",
      });
      setTimeout(() => {
        navigate('/investor-dashboard');
      }, 2000);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading startups...</p>
        </div>
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p>No startups available for evaluation.</p>
            <Button onClick={() => navigate('/investor-dashboard')} className="mt-4">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStartup = startups[currentIndex];
  const progress = ((currentIndex + 1) / startups.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Startup Evaluation</h1>
          <p className="text-gray-600 mb-4">
            Evaluate these 5 demo startups to calibrate our recommendation system
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            {currentIndex + 1} of {startups.length} startups
          </p>
        </div>

        {/* Current Startup Card */}
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{currentStartup.name}</CardTitle>
              <Badge variant="outline" className="text-sm">
                {currentStartup.stage}
              </Badge>
            </div>
            <Badge variant="secondary" className="w-fit">
              {currentStartup.industry}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Monthly Revenue</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  ${currentStartup.metrics.mrr.toLocaleString()}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Growth Rate</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {currentStartup.metrics.growth_rate}%/month
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-800">Founder Score</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {currentStartup.metrics.founder_experience}/10
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => makeDecision('pass')}
                className="flex-1 h-16 border-red-200 text-red-700 hover:bg-red-50"
              >
                <XCircle className="w-6 h-6 mr-2" />
                Pass
              </Button>
              <Button
                size="lg"
                onClick={() => makeDecision('invest')}
                className="flex-1 h-16 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                Invest
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Previous Decisions Summary */}
        {decisions.length > 0 && (
          <Card className="w-full max-w-2xl mx-auto mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Your Decisions So Far
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {decisions.map((decision, idx) => {
                  const startup = startups.find(s => s.id === decision.startupId);
                  return (
                    <Badge 
                      key={idx}
                      variant={decision.action === 'invest' ? 'default' : 'secondary'}
                      className="px-3 py-1"
                    >
                      {startup?.name}: {decision.action}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
