
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Crown } from 'lucide-react';

interface RequirePlanProps {
  userPlan?: string;
  allowedPlans: string[];
  children: React.ReactNode;
  featureName?: string;
}

const RequirePlan: React.FC<RequirePlanProps> = ({ 
  userPlan = 'free', 
  allowedPlans, 
  children, 
  featureName = 'This feature'
}) => {
  const navigate = useNavigate();

  if (!allowedPlans.includes(userPlan)) {
    const requiredPlan = allowedPlans.includes('premium') ? 'Premium' : 
                        allowedPlans.includes('pro') ? 'Pro' : 'Free';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {requiredPlan === 'Premium' ? (
                <Crown className="w-8 h-8 text-yellow-600" />
              ) : (
                <Lock className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">Upgrade Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              {featureName} is only available on {allowedPlans.join(' or ')} plans.
            </p>
            <p className="text-sm text-gray-500">
              You're currently on the <span className="font-medium capitalize">{userPlan}</span> plan.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/pricing')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                View Pricing Plans →
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequirePlan;
