
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, Users, Calendar, Target, BarChart3, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const StartupDetail = () => {
  const { id } = useParams();
  
  // Mock data - in real app this would come from API
  const startup = {
    id: 1,
    name: "AI Health Diagnostics",
    industry: "HealthTech",
    stage: "Series A",
    score: 92,
    description: "Revolutionary AI-powered medical imaging platform transforming healthcare diagnostics worldwide. Our proprietary machine learning algorithms can detect anomalies 40% faster than traditional methods.",
    founded: "2021",
    location: "San Francisco, CA",
    website: "https://aihealthdiagnostics.com",
    metrics: {
      mrr: "$45,000",
      arr: "$540,000", 
      growth: "+340%",
      runway: "18 months",
      teamSize: "25",
      customers: "200+",
      burnRate: "$85,000"
    },
    financials: {
      totalRaised: "$3.2M",
      lastRound: "$2M Series A",
      valuation: "$25M",
      investors: ["Andreessen Horowitz", "General Catalyst", "Y Combinator"]
    },
    team: {
      founder: "Dr. Sarah Chen",
      founderBackground: "Former Stanford Medical AI researcher, 10+ years in healthcare",
      teamSize: 25,
      keyHires: ["VP Engineering (ex-Google)", "Head of Sales (ex-Salesforce)", "Chief Medical Officer"]
    },
    scoreBreakdown: {
      market: 85,
      traction: 95,
      team: 90,
      financials: 88,
      product: 92
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-yellow-100';
    return 'bg-blue-100';
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
            <Link to="/startups" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Directory
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Startup Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold">{startup.name}</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getScoreBg(startup.score)} ${getScoreColor(startup.score)}`}>
                  {startup.score}% Investability Score
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {startup.industry}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {startup.stage}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {startup.location}
                </span>
              </div>
              <p className="text-gray-600 max-w-3xl">{startup.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CheckCircle className="mr-2 w-5 h-5" />
              Invest
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3 rounded-xl border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-300"
            >
              <XCircle className="mr-2 w-5 h-5" />
              Pass
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 rounded-xl border-2">
              Request Info
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Metrics */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 w-5 h-5" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{startup.metrics.mrr}</div>
                    <div className="text-sm text-gray-600">Monthly Recurring Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{startup.metrics.growth}</div>
                    <div className="text-sm text-gray-600">YoY Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{startup.metrics.customers}</div>
                    <div className="text-sm text-gray-600">Active Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{startup.metrics.runway}</div>
                    <div className="text-sm text-gray-600">Cash Runway</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investability Score Breakdown */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 w-5 h-5" />
                  Investability Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(startup.scoreBreakdown).map(([category, score]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-2">
                      <span className="capitalize font-medium">{category}</span>
                      <span className={`font-semibold ${getScoreColor(score)}`}>{score}/100</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Overall Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(startup.score)}`}>
                    {startup.score}/100
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Team Information */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 w-5 h-5" />
                  Team & Leadership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Founder & CEO</h4>
                  <p className="text-gray-700">{startup.team.founder}</p>
                  <p className="text-sm text-gray-600">{startup.team.founderBackground}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Key Team Members</h4>
                  <ul className="space-y-1">
                    {startup.team.keyHires.map((hire, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {hire}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-center">{startup.team.teamSize}</div>
                  <div className="text-sm text-gray-600 text-center">Total Team Members</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Company Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Founded</span>
                  <span className="font-medium">{startup.founded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stage</span>
                  <span className="font-medium">{startup.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{startup.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Team Size</span>
                  <span className="font-medium">{startup.metrics.teamSize}</span>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 w-5 h-5" />
                  Financials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Raised</span>
                  <span className="font-medium">{startup.financials.totalRaised}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Round</span>
                  <span className="font-medium">{startup.financials.lastRound}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valuation</span>
                  <span className="font-medium">{startup.financials.valuation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ARR</span>
                  <span className="font-medium">{startup.metrics.arr}</span>
                </div>
              </CardContent>
            </Card>

            {/* Notable Investors */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Notable Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {startup.financials.investors.map((investor, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">{investor}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetail;
