
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const InvestorOnboard = () => {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [ticketSize, setTicketSize] = useState([50000]);
  const [riskTolerance, setRiskTolerance] = useState([3]);

  const industries = [
    'HealthTech', 'FinTech', 'EdTech', 'CleanTech', 'AI/ML', 
    'E-commerce', 'SaaS', 'Biotech', 'Gaming', 'Cybersecurity'
  ];

  const stages = [
    'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'
  ];

  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      setSelectedIndustries([...selectedIndustries, industry]);
    } else {
      setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
    }
  };

  const handleStageChange = (stage: string, checked: boolean) => {
    if (checked) {
      setSelectedStages([...selectedStages, stage]);
    } else {
      setSelectedStages(selectedStages.filter(s => s !== stage));
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

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
            <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Investor Profile Setup</h1>
          <p className="text-gray-600">
            Help us understand your investment preferences to match you with the right startups.
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Investment Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Preferred Industries */}
            <div>
              <Label className="text-base font-medium mb-4 block">
                Preferred Industries <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {industries.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox
                      id={industry}
                      checked={selectedIndustries.includes(industry)}
                      onCheckedChange={(checked) => 
                        handleIndustryChange(industry, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={industry} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {industry}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Stages */}
            <div>
              <Label className="text-base font-medium mb-4 block">
                Investment Stages <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {stages.map((stage) => (
                  <div key={stage} className="flex items-center space-x-2">
                    <Checkbox
                      id={stage}
                      checked={selectedStages.includes(stage)}
                      onCheckedChange={(checked) => 
                        handleStageChange(stage, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={stage} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {stage}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Size */}
            <div>
              <Label className="text-base font-medium mb-4 block">
                Typical Ticket Size: {formatCurrency(ticketSize[0])}
              </Label>
              <div className="px-4">
                <Slider
                  value={ticketSize}
                  onValueChange={setTicketSize}
                  max={2000000}
                  min={10000}
                  step={10000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$10K</span>
                  <span>$2M</span>
                </div>
              </div>
            </div>

            {/* Risk Tolerance */}
            <div>
              <Label className="text-base font-medium mb-4 block">
                Risk Tolerance: {riskTolerance[0]} / 5
              </Label>
              <div className="px-4">
                <Slider
                  value={riskTolerance}
                  onValueChange={setRiskTolerance}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Link to="/investor-calibrate" className="block">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={selectedIndustries.length === 0 || selectedStages.length === 0}
                >
                  Continue to Calibration
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <p className="text-xs text-gray-500 text-center mt-3">
                This helps us personalize your startup recommendations
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorOnboard;
