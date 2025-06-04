
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp, CheckCircle, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useScoreCalculation } from '@/hooks/useScoreCalculation';
import { generateDiversifiedStartups } from '@/services/calibrationService';

const InvestorCalibrate = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [decisions, setDecisions] = useState<Array<'invest' | 'pass' | null>>([null, null, null, null, null]);
  const [scores, setScores] = useState<Array<number | null>>([null, null, null, null, null]);
  const [demoStartups, setDemoStartups] = useState<any[]>([]);
  const [investorId] = useState(() => `investor_${Date.now()}`); // Simulated investor ID
  const { score, isLoading, error, calculate, getCalibrationInsights } = useScoreCalculation();

  // Initialize diversified startups based on preferences
  useEffect(() => {
    // Get investor preferences from localStorage or use defaults
    const preferences = JSON.parse(localStorage.getItem('investorPreferences') || '{}');
    
    const defaultPrefs = {
      industries: ["HealthTech", "FinTech", "EdTech", "CleanTech"],
      stages: ["Pre-Seed", "Seed", "Series A"],
      valuationMin: 1000000,
      valuationMax: 20000000,
      maxBurnRate: 80000
    };
    
    const investorPrefs = { ...defaultPrefs, ...preferences };
    console.log('Generating diversified startups for preferences:', investorPrefs);
    
    const diversifiedStartups = generateDiversifiedStartups(investorPrefs);
    setDemoStartups(diversifiedStartups);
  }, []);

  const handleDecision = async (decision: 'invest' | 'pass') => {
    if (demoStartups.length === 0) return;

    const newDecisions = [...decisions];
    newDecisions[currentCard] = decision;
    setDecisions(newDecisions);

    // Calculate score using the enhanced ML model
    const startup = demoStartups[currentCard];
    const investorPrefs = {
      industries: ["HealthTech", "FinTech", "EdTech", "CleanTech", "HR Tech", "Cybersecurity", "AgTech", "E-commerce"],
      stages: ["Pre-Seed", "Seed", "Series A"],
      valuationMin: 1000000,
      valuationMax: 50000000,
      maxBurnRate: 100000
    };

    const startupData = {
      industry: startup.industry,
      stage: startup.stage,
      valuation: startup.valuation,
      mrrGrowth: startup.mrrGrowth,
      burnRate: startup.burnRate,
      founderExperienceScore: startup.founderExperienceScore
    };

    await calculate({
      investorPrefs,
      startup: startupData,
      decision,
      investorId
    });

    // Store the score for this startup
    if (score !== null) {
      const newScores = [...scores];
      newScores[currentCard] = score;
      setScores(newScores);
    }

    console.log(`Decision: ${decision}, Score: ${score}, Startup: ${startup.name}`);

    if (currentCard < demoStartups.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const progress = ((currentCard + (decisions[currentCard] ? 1 : 0)) / demoStartups.length) * 100;
  const isComplete = decisions.every(d => d !== null);
  const currentStartup = demoStartups[currentCard];
  const calibrationInsights = getCalibrationInsights();

  if (demoStartups.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Generating personalized calibration startups...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold mb-4">AI Calibration Round</h1>
              <p className="text-gray-600 mb-6">
                Review these carefully selected startups to help our AI understand your investment preferences.
                Each startup has been chosen to test different aspects of your investment thesis.
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
                <CardTitle className="text-2xl">{currentStartup?.name}</CardTitle>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {currentStartup?.industry}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {currentStartup?.stage}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <p className="text-gray-700 text-center">{currentStartup?.description}</p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">MRR</div>
                    <div className="text-lg font-semibold">{currentStartup?.metrics.mrr}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Growth</div>
                    <div className="text-lg font-semibold text-green-600">{currentStartup?.metrics.growth}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Runway</div>
                    <div className="text-lg font-semibold">{currentStartup?.metrics.runway}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Team Size</div>
                    <div className="text-lg font-semibold">{currentStartup?.metrics.teamSize}</div>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="font-medium mb-3">Key Highlights</h4>
                  <div className="space-y-2">
                    {currentStartup?.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Score Display */}
                {score !== null && (
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-center mb-2">
                      <Brain className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">AI Compatibility Score</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">{score}%</div>
                    <div className="text-xs text-gray-500 mt-1">Based on your preferences</div>
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
              Perfect! Our AI has learned your investment preferences and is now calibrated 
              to provide personalized recommendations that align with your thesis.
            </p>
            
            {/* Calibration Summary */}
            <div className="bg-white/80 rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-4">Your Calibration Summary</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
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
                    {scores[index] && (
                      <div className="text-xs text-gray-500 mt-1">{scores[index]}%</div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Calibration Insights */}
              {calibrationInsights && (
                <div className="text-sm text-gray-600 space-y-2">
                  <div>Investment Rate: {calibrationInsights.investRate.toFixed(1)}%</div>
                  {calibrationInsights.preferredIndustries.length > 0 && (
                    <div>Top Industries: {calibrationInsights.preferredIndustries.slice(0, 2).join(', ')}</div>
                  )}
                  {calibrationInsights.preferredStages.length > 0 && (
                    <div>Preferred Stages: {calibrationInsights.preferredStages.slice(0, 2).join(', ')}</div>
                  )}
                </div>
              )}
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
