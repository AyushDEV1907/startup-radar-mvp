
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Target, BarChart3, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                InvestRadar
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/startups" className="text-gray-600 hover:text-blue-600 transition-colors">
                Browse Startups
              </Link>
              <Link to="/investor-dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                Investor Dashboard
              </Link>
              <Button variant="outline" className="mr-2">
                Sign In
              </Button>
              <Button>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              🚀 The Future of Startup Investment
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Discover Your Next
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Unicorn Investment
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            AI-powered investability scoring meets curated startup marketplace.
            Connect with vetted startups that match your investment thesis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Start as Investor
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 rounded-xl border-2 hover:bg-gray-50 transition-all duration-300">
              List Your Startup
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose InvestRadar?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform combines data science with market intelligence to surface the most promising investment opportunities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Scoring</h3>
                <p className="text-gray-600">
                  Our proprietary algorithm analyzes 200+ data points to generate investability scores you can trust.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Perfect Matching</h3>
                <p className="text-gray-600">
                  Advanced filters help you find startups that align with your investment thesis and risk tolerance.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Vetted Startups</h3>
                <p className="text-gray-600">
                  Every startup is pre-screened for quality, ensuring you only see legitimate investment opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Startup Cards */}
      <section className="py-16 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Startups</h2>
            <p className="text-gray-600">Discover high-potential startups with our investability insights</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "AI Health Diagnostics",
                industry: "HealthTech",
                stage: "Series A",
                score: 92,
                mrr: "$45K",
                growth: "+340%"
              },
              {
                name: "CleanTech Solutions",
                industry: "Climate Tech",
                stage: "Seed",
                score: 87,
                mrr: "$23K",
                growth: "+280%"
              },
              {
                name: "FinanceFlow Pro",
                industry: "FinTech",
                stage: "Pre-Seed",
                score: 78,
                mrr: "$12K",
                growth: "+190%"
              }
            ].map((startup, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{startup.name}</h3>
                      <p className="text-gray-600 text-sm">{startup.industry}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      startup.score >= 90 ? 'bg-green-100 text-green-800' :
                      startup.score >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {startup.score}% Match
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stage:</span>
                      <span className="font-medium">{startup.stage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MRR:</span>
                      <span className="font-medium">{startup.mrr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth:</span>
                      <span className="font-medium text-green-600">{startup.growth}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Invest
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Pass
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Find Your Next Investment?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join hundreds of investors who trust InvestRadar to discover high-potential startups.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/investor-onboard">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Investor Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/startups">
                <Button variant="outline" size="lg" className="px-8 py-4 rounded-xl border-2 hover:bg-gray-50 transition-all duration-300">
                  Browse Startups
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                InvestRadar
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2024 InvestRadar. Discover your next unicorn investment.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
