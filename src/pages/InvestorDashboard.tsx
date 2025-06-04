import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Target, Calendar, Filter, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CombinedRecommendations } from '@/components/CombinedRecommendations';
import RequirePlan from '@/components/RequirePlan';
import { useUserPlan } from '@/hooks/useUserPlan';

const InvestorDashboard = () => {
  const { plan, isPro, isPremium } = useUserPlan();

  const portfolioStats = {
    totalInvestments: 12,
    totalInvested: "$850K",
    avgReturn: "+24.3%",
    activeDeals: 3
  };

  const recentActivity = [
    { action: "Invested", startup: "AI Health Diagnostics", amount: "$50K", date: "2 days ago", status: "completed" },
    { action: "Passed", startup: "CleanTech Solutions", amount: "-", date: "1 week ago", status: "passed" },
    { action: "Invested", startup: "FinanceFlow Pro", amount: "$25K", date: "2 weeks ago", status: "completed" },
    { action: "Reviewed", startup: "EduTech Innovators", amount: "-", date: "3 weeks ago", status: "pending" }
  ];

  const getPlanIcon = () => {
    if (isPremium) return <Crown className="w-4 h-4 text-yellow-600" />;
    if (isPro) return <Zap className="w-4 h-4 text-blue-600" />;
    return null;
  };

  const getPlanColor = () => {
    if (isPremium) return "border-yellow-200 bg-yellow-50";
    if (isPro) return "border-blue-200 bg-blue-50";
    return "border-gray-200 bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                InvestRadar
              </span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link to="/startups" className="text-gray-600 hover:text-blue-600 transition-colors">
                Browse Startups
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section with Plan Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Alex</h1>
              <p className="text-gray-600">
                You have personalized recommendations based on your investment preferences and activity.
              </p>
            </div>
            <Card className={`border ${getPlanColor()}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {getPlanIcon()}
                  <span className="font-medium capitalize">{plan} Plan</span>
                </div>
                {plan === 'free' && (
                  <Link to="/pricing">
                    <Button size="sm" className="mt-2 w-full">
                      Upgrade for More →
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Investments</p>
                  <p className="text-2xl font-bold">{portfolioStats.totalInvestments}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Invested</p>
                  <p className="text-2xl font-bold">{portfolioStats.totalInvested}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Return</p>
                  <p className="text-2xl font-bold text-green-600">{portfolioStats.avgReturn}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Deals</p>
                  <p className="text-2xl font-bold">{portfolioStats.activeDeals}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Combined Recommendations with Plan Protection */}
            <RequirePlan 
              userPlan={plan} 
              allowedPlans={['pro', 'premium']}
              featureName="AI-powered recommendations"
            >
              <CombinedRecommendations investorId="550e8400-e29b-41d4-a716-446655440000" />
            </RequirePlan>

            {/* Investment Preferences */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 w-5 h-5" />
                  Your Investment Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Industries</span>
                      <span className="text-sm text-gray-600">5 selected</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["HealthTech", "AI/ML", "FinTech", "CleanTech", "Biotech"].map((industry) => (
                        <span key={industry} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Stages</span>
                      <span className="text-sm text-gray-600">3 selected</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Seed", "Series A", "Series B"].map((stage) => (
                        <span key={stage} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link to="/investor-onboard">
                      <Button variant="outline" size="sm">
                        Update Preferences
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            activity.status === 'completed' ? 'bg-green-500' :
                            activity.status === 'passed' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}></span>
                          <span className="font-medium text-sm">{activity.action}</span>
                        </div>
                        <div className="text-xs text-gray-600">{activity.startup}</div>
                        <div className="text-xs text-gray-500">{activity.date}</div>
                      </div>
                      {activity.amount !== '-' && (
                        <div className="text-sm font-medium">{activity.amount}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/startups" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="mr-2 w-4 h-4" />
                    Browse Startups
                  </Button>
                </Link>
                <Link to="/investor-calibrate" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 w-4 h-4" />
                    Recalibrate Preferences
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 w-4 h-4" />
                  Schedule Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
