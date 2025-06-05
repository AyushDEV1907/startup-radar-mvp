
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStartupDetail } from '@/hooks/useStartups';
import { useRecordInteraction } from '@/hooks/useInteractions';
import { useInvestorAuth } from '@/hooks/useInvestorAuth';
import { useToast } from '@/hooks/use-toast';
import { Building2, TrendingUp, DollarSign, Users, ExternalLink, ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';

export default function StartupDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useInvestorAuth();
  const { toast: shadcnToast } = useToast();
  
  const { data: startup, isLoading, error } = useStartupDetail(id!);
  const recordInteractionMutation = useRecordInteraction();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-red-600 mb-4">Startup not found</p>
            <Button onClick={() => navigate('/startups')}>Back to Marketplace</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metrics = typeof startup.metrics === 'string' ? JSON.parse(startup.metrics) : startup.metrics || {};
  const isFounder = user?.id === startup.founder_id;
  const isInvestor = user && !isFounder;

  const handleInteraction = async (action: 'invest' | 'pass') => {
    if (!user) {
      toast.error('Please sign in to interact with startups');
      shadcnToast({
        title: "Authentication Required",
        description: "Please sign in to interact with startups",
        variant: "destructive"
      });
      return;
    }

    if (!id) {
      toast.error('Invalid startup ID');
      return;
    }

    try {
      console.log(`Recording ${action} interaction for startup ${id}`);
      
      await recordInteractionMutation.mutateAsync({
        investorId: user.id,
        startupId: id,
        action,
        isDemo: false
      });

      const message = `You have ${action === 'invest' ? 'invested in' : 'passed on'} ${startup.name}`;
      toast.success(message);
      shadcnToast({
        title: "Interaction Recorded",
        description: message,
      });

      console.log(`Successfully recorded ${action} for startup ${startup.name}`);
      
    } catch (error) {
      console.error('Error recording interaction:', error);
      const errorMessage = 'Failed to record interaction. Please try again.';
      toast.error(errorMessage);
      shadcnToast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/startups')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{startup.name}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Building2 className="w-6 h-6 text-blue-600" />
                      {startup.name}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{startup.industry}</Badge>
                      <Badge variant="outline">{startup.stage}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Financial Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${(metrics.mrr || 0).toLocaleString()}</p>
                      <p className="text-gray-500">Monthly Recurring Revenue</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${(metrics.burn_rate || 0).toLocaleString()}</p>
                      <p className="text-gray-500">Monthly Burn Rate</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{metrics.founder_experience_score || 0}/10</p>
                      <p className="text-gray-500">Founder Experience</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pitch Deck */}
            {startup.pitch_deck_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Pitch Deck</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={startup.pitch_deck_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Pitch Deck
                  </a>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            {isInvestor && (
              <Card>
                <CardHeader>
                  <CardTitle>Investment Decision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => handleInteraction('invest')}
                    disabled={recordInteractionMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {recordInteractionMutation.isPending ? 'Recording...' : 'Invest'}
                  </Button>
                  <Button
                    onClick={() => handleInteraction('pass')}
                    disabled={recordInteractionMutation.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    {recordInteractionMutation.isPending ? 'Recording...' : 'Pass'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {isFounder && (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => navigate('/startup/register')}
                    className="w-full"
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card>
                <CardHeader>
                  <CardTitle>Get Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Sign in to interact with this startup</p>
                  <Button
                    onClick={() => navigate('/investor-signup')}
                    className="w-full"
                  >
                    Sign In as Investor
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Industry:</span>
                  <span className="font-medium">{startup.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stage:</span>
                  <span className="font-medium">{startup.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed:</span>
                  <span className="font-medium">
                    {new Date(startup.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
