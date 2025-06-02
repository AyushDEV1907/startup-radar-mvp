
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Settings, TrendingUp, DollarSign } from 'lucide-react';

const INDUSTRIES = [
  'AI/ML', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 
  'SaaS', 'Sustainability', 'IoT', 'Logistics', 'Analytics'
];

const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B'];

export default function InvestorPreferences() {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [valuationMin, setValuationMin] = useState('');
  const [valuationMax, setValuationMax] = useState('');
  const [burnRateMax, setBurnRateMax] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/investor-signup');
        return;
      }
      setUser(user);
    };
    getUser();
  }, [navigate]);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const toggleStage = (stage: string) => {
    setSelectedStages(prev => 
      prev.includes(stage) 
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };

  const validateForm = () => {
    if (selectedIndustries.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one industry",
        variant: "destructive"
      });
      return false;
    }

    if (selectedStages.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one stage",
        variant: "destructive"
      });
      return false;
    }

    const minVal = parseFloat(valuationMin);
    const maxVal = parseFloat(valuationMax);
    const maxBurn = parseFloat(burnRateMax);

    if (isNaN(minVal) || minVal <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid minimum valuation",
        variant: "destructive"
      });
      return false;
    }

    if (isNaN(maxVal) || maxVal <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid maximum valuation",
        variant: "destructive"
      });
      return false;
    }

    if (minVal >= maxVal) {
      toast({
        title: "Error",
        description: "Maximum valuation must be greater than minimum valuation",
        variant: "destructive"
      });
      return false;
    }

    if (isNaN(maxBurn) || maxBurn <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid maximum burn rate",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('investor_profiles')
        .insert({
          user_id: user.id,
          industries: selectedIndustries,
          stages: selectedStages,
          valuation_min: parseInt(valuationMin) * 1000000, // Convert to actual value
          valuation_max: parseInt(valuationMax) * 1000000, // Convert to actual value
          burn_rate_max: parseInt(burnRateMax) * 1000 // Convert to actual value
        });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Preferences saved successfully",
      });

      navigate('/investor/seed-test');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Investment Preferences</CardTitle>
          <p className="text-gray-600">Help us understand your investment criteria</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Preferred Industries</Label>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map(industry => (
                  <Button
                    key={industry}
                    type="button"
                    variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                    onClick={() => toggleIndustry(industry)}
                    className="justify-start"
                  >
                    {industry}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Preferred Stages</Label>
              <div className="grid grid-cols-2 gap-2">
                {STAGES.map(stage => (
                  <Button
                    key={stage}
                    type="button"
                    variant={selectedStages.includes(stage) ? "default" : "outline"}
                    onClick={() => toggleStage(stage)}
                    className="justify-start"
                  >
                    {stage}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valuationMin">Minimum Valuation ($ Millions)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="valuationMin"
                    type="number"
                    placeholder="e.g., 5"
                    value={valuationMin}
                    onChange={(e) => setValuationMin(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valuationMax">Maximum Valuation ($ Millions)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="valuationMax"
                    type="number"
                    placeholder="e.g., 100"
                    value={valuationMax}
                    onChange={(e) => setValuationMax(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="burnRateMax">Maximum Burn Rate ($ Thousands/month)</Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="burnRateMax"
                  type="number"
                  placeholder="e.g., 50"
                  value={burnRateMax}
                  onChange={(e) => setBurnRateMax(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Saving Preferences...' : 'Save Preferences & Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
