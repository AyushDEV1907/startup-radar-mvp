
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Target, Calendar, Star, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InvestorDashboard = () => {
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

  const recommendedStartups = [
    {
      id: 1,
      name: "QuantumAI Systems",
      industry: "AI/ML",
      stage: "Series A",
      score: 94,
      match: "95%",
      mrr: "$78K",
      growth: "+420%"
    },
    {
      id: 2,
      name: "BioMed Innovations", 
      industry: "Biotech",
      stage: "Seed",
      score: 89,
      match: "91%",
      mrr: "$34K",
      growth: "+290%"
    },
    {
      id: 3,
      name: "GreenEnergy Solutions",
      industry: "CleanTech",
      stage: "Series A",
      score: 87,
      match: "88%",
      mrr: "$56K",
      growth: "+310%"
    }
  ];

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
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alex</h1>
          <p className="text-gray-600">
            You have 3 new startup recommendations based on your investment preferences.
          </p>
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
            {/* Recommended Startups */}
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
                {recommendedStartups.map((startup) => (
                  <div key={startup.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{startup.name}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {startup.industry}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            {startup.stage}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{startup.match}</div>
                        <div className="text-xs text-gray-600">Match Score</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">MRR:</span>
                        <span className="ml-2 font-medium">{startup.mrr}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Growth:</span>
                        <span className="ml-2 font-medium text-green-600">{startup.growth}</span>
                      </div>
                    </div>
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
