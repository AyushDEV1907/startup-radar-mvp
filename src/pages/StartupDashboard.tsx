
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Building2, Users, TrendingUp, LogOut } from 'lucide-react';

export default function StartupDashboard() {
  const [user, setUser] = useState<any>(null);
  const [startup, setStartup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/startup/signup');
        return;
      }
      setUser(user);
      await fetchStartup(user.id);
    };
    getUser();
  }, [navigate]);

  const fetchStartup = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .eq('founder_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        toast({
          title: "Error",
          description: "Failed to fetch startup information",
          variant: "destructive"
        });
        return;
      }

      setStartup(data);
    } catch (error) {
      console.error('Error fetching startup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Building2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Startup Registered</h2>
            <p className="text-gray-600 mb-4">You haven't registered your startup yet.</p>
            <Button 
              onClick={() => navigate('/startup/register')}
              className="bg-green-600 hover:bg-green-700"
            >
              Register Your Startup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metrics = startup.metrics || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Startup Dashboard</span>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's an overview of {startup.name}</p>
        </div>

        {/* Company Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="font-semibold">{startup.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-semibold">{startup.industry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stage</p>
                <p className="font-semibold">{startup.stage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Monthly Recurring Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${(metrics.mrr || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Monthly Burn Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${(metrics.burn_rate || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Founder Experience Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.founder_experience_score || 0}/10
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pitch Deck Section */}
        {startup.pitch_deck_url && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Pitch Deck</CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href={startup.pitch_deck_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                View Pitch Deck
              </a>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
