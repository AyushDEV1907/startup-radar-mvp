
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, TrendingUp } from 'lucide-react';
import { useUserPlan } from '@/hooks/useUserPlan';

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshPlan } = useUserPlan();
  const plan = searchParams.get('plan');

  useEffect(() => {
    // Refresh the user's plan after successful payment
    const timer = setTimeout(() => {
      refreshPlan();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refreshPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Welcome to InvestRadar {plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Pro'}! 
            Your subscription has been activated.
          </p>
          <p className="text-sm text-gray-500">
            You now have access to all the premium features. Start exploring enhanced recommendations 
            and advanced analytics.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/investor-dashboard')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/startups')}
              className="w-full"
            >
              Browse Startups
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
