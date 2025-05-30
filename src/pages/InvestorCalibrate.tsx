import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useScoreCalculation } from '@/hooks/useScoreCalculation';

const InvestorCalibrate = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [decisions, setDecisions] = useState<Array<'invest' | 'pass' | null>>([null, null, null, null, null]);
  const { score, isLoading, error, calculate } = useScoreCalculation();

  const demoStartups = [
    {
      name: "MedAI Diagnostics",
      industry: "HealthTech",
      stage: "Series A",
      description: "AI-powered medical imaging platform used by 200+ hospitals worldwide",
      metrics: {
        mrr: "$120K",
        growth: "+450% YoY",
        runway: "18 months",
        teamSize: "25 employees"
      },
      highlights: ["FDA approved", "Top tier VCs", "Strong IP portfolio"]
    },
    {
      name: "EcoCharge Solutions",
      industry: "CleanTech",
      stage: "Seed",
      description: "Revolutionary battery recycling technology with 95% material recovery rate",
      metrics: {
        mrr: "$45K",
        growth: "+280% YoY",
        runway: "24 months",
        teamSize: "12 employees"
      },
      highlights: ["Patent pending", "Government grants", "Tesla partnership"]
    },
    {
      name: "FlexWork Platform",
      industry: "HR Tech",
      stage: "Pre-Seed",
      description: "AI-driven remote work optimization platform for enterprise teams",
      metrics: {
        mrr: "$18K",
        growth: "+190% YoY",
        runway: "12 months",
        teamSize: "8 employees"
      },
      highlights: ["Y Combinator", "Fortune 500 pilots", "Strong NPS"]
    },
    {
      name: "CryptoShield Security",
      industry: "Cybersecurity",
      stage: "Series A",
      description: "Next-gen blockchain security infrastructure for DeFi protocols",
      metrics: {
        mrr: "$95K",
        growth: "+320% YoY",
        runway: "20 months",
        teamSize: "18 employees"
      },
      highlights: ["$2B+ secured", "Zero breaches", "Enterprise ready"]
    },
    {
      name: "LearnSpace VR",
      industry: "EdTech",
      stage: "Seed",
      description: "Immersive VR learning platform for K-12 education with proven outcomes",
      metrics: {
        mrr: "$67K",
        growth: "+240% YoY",
        runway: "15 months",
        teamSize: "14 employees"
      },
      highlights: ["500+ schools", "Proven efficacy", "Content partnerships"]
    }
  ];

  const handleDecision = async (decision: 'invest' | 'pass') => {
    const newDecisions = [...decisions];
    newDecisions[currentCard] = decision;
    setDecisions(newDecisions);

    // Calculate score for this startup
    const startup = demoStartups[currentCard];
    await calculate({
      industryMatch: 0.8, // You can customize this based on startup data
      stageMatch: 0.6,
      traction: 0.7
    });

    console.log(`Decision: ${decision}, Score: ${score}`);

    if (currentCard < demoStartups.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const progress = ((currentCard + (decisions[currentCard] ? 1 : 0)) / demoStartups.length) * 100;
  const isComplete = decisions.every(d => d !== null);

  const currentStartup = demoStartups[currentCard];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
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
            <Link to="/investor-onboard" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {!isComplete ? (
          <>
            {/* Progress Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Calibration Round</h1>
              <p className="text-gray-600 mb-6">
                Review these 5 startups to help us understand your investment preferences.
                Your decisions will calibrate our matching algorithm.
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {/* Startup Card */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="text-sm text-gray-500 mb-2">
                  Startup {currentCard + 1} of {demoStartups.length}
                </div>
                <CardTitle className="text-2xl">{currentStartup.name}</CardTitle>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {currentStartup.industry}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {currentStartup.stage}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <p className="text-gray-700 text-center">{currentStartup.description}</p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">MRR</div>
                    <div className="text-lg font-semibold">{currentStartup.metrics.mrr}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Growth</div>
                    <div className="text-lg font-semibold text-green-600">{currentStartup.metrics.growth}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Runway</div>
                    <div className="text-lg font-semibold">{currentStartup.metrics.runway}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Team Size</div>
                    <div className="text-lg font-semibold">{currentStartup.metrics.teamSize}</div>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="font-medium mb-3">Key Highlights</h4>
                  <div className="space-y-2">
                    {currentStartup.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score Display */}
                {score !== null && (
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">AI Score</div>
                    <div className="text-2xl font-bold text-blue-600">{score}%</div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-600">{error}</div>
                  </div>
                )}

                {/* Decision Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 py-4 border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-300"
                    onClick={() => handleDecision('pass')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Calculating...' : 'Pass'}
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => handleDecision('invest')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Calculating...' : 'Invest'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Completion Screen */
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Calibration Complete!</h1>
            <p className="text-gray-600 mb-8">
              Perfect! We've learned your investment preferences. Our algorithm is now calibrated 
              to match you with startups that align with your thesis.
            </p>
            <div className="bg-white/80 rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-4">Your Calibration Summary</h3>
              <div className="grid grid-cols-5 gap-2">
                {decisions.map((decision, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Startup {index + 1}</div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      decision === 'invest' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {decision === 'invest' ? 'Invest' : 'Pass'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/investor-dashboard">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorCalibrate;
