
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Upload, DollarSign, TrendingUp } from 'lucide-react';

const INDUSTRIES = [
  'AI/ML', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 
  'SaaS', 'Sustainability', 'IoT', 'Logistics', 'Analytics'
];

const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B'];

export default function StartupRegister() {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [stage, setStage] = useState('');
  const [pitchDeckUrl, setPitchDeckUrl] = useState('');
  const [mrr, setMrr] = useState('');
  const [burnRate, setBurnRate] = useState('');
  const [founderExperienceScore, setFounderExperienceScore] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const validateForm = () => {
    if (!companyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your company name",
        variant: "destructive"
      });
      return false;
    }

    if (!industry) {
      toast({
        title: "Error",
        description: "Please select an industry",
        variant: "destructive"
      });
      return false;
    }

    if (!stage) {
      toast({
        title: "Error",
        description: "Please select a funding stage",
        variant: "destructive"
      });
      return false;
    }

    if (!pitchDeckUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide your pitch deck URL",
        variant: "destructive"
      });
      return false;
    }

    // Validate pitch deck URL format
    try {
      const url = new URL(pitchDeckUrl);
      if (!url.pathname.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "Error",
          description: "Pitch deck URL must point to a PDF file (ending with .pdf)",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Please enter a valid URL for your pitch deck",
        variant: "destructive"
      });
      return false;
    }

    const mrrValue = parseFloat(mrr);
    const burnRateValue = parseFloat(burnRate);
    const founderScore = parseFloat(founderExperienceScore);

    if (isNaN(mrrValue) || mrrValue < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid MRR (Monthly Recurring Revenue)",
        variant: "destructive"
      });
      return false;
    }

    if (isNaN(burnRateValue) || burnRateValue < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid burn rate",
        variant: "destructive"
      });
      return false;
    }

    if (isNaN(founderScore) || founderScore < 0 || founderScore > 10) {
      toast({
        title: "Error",
        description: "Founder experience score must be between 0 and 10",
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
      const metrics = {
        mrr: parseFloat(mrr),
        burn_rate: parseFloat(burnRate),
        founder_experience_score: parseFloat(founderExperienceScore)
      };

      const { error } = await supabase
        .from('startups')
        .insert({
          founder_id: user.id,
          name: companyName.trim(),
          industry: industry,
          stage: stage,
          metrics: metrics,
          pitch_deck_url: pitchDeckUrl.trim()
        });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Your startup has been registered successfully!",
      });

      navigate('/founder/dashboard');
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center px-4 sm:px-6">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Register Your Startup</CardTitle>
          <p className="text-sm sm:text-base text-gray-600">Tell us about your company to join our marketplace</p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Enter your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(ind => (
                      <SelectItem key={ind} value={ind} className="text-sm">{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage" className="text-sm">Funding Stage</Label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map(stg => (
                      <SelectItem key={stg} value={stg} className="text-sm">{stg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pitchDeckUrl" className="text-sm">Pitch Deck URL</Label>
              <div className="relative">
                <Upload className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="pitchDeckUrl"
                  type="url"
                  placeholder="https://example.com/pitch-deck.pdf"
                  value={pitchDeckUrl}
                  onChange={(e) => setPitchDeckUrl(e.target.value)}
                  className="pl-10 text-sm"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">URL must point to a PDF file</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mrr" className="text-sm">Monthly Recurring Revenue ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="mrr"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="e.g., 50000"
                    value={mrr}
                    onChange={(e) => setMrr(e.target.value)}
                    className="pl-10 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="burnRate" className="text-sm">Monthly Burn Rate ($)</Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="burnRate"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="e.g., 30000"
                    value={burnRate}
                    onChange={(e) => setBurnRate(e.target.value)}
                    className="pl-10 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="founderScore" className="text-sm">Founder Experience Score (0-10)</Label>
                <Input
                  id="founderScore"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="e.g., 7.5"
                  value={founderExperienceScore}
                  onChange={(e) => setFounderExperienceScore(e.target.value)}
                  className="text-sm"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-sm" 
              disabled={isLoading}
            >
              {isLoading ? 'Registering Startup...' : 'Register Startup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
