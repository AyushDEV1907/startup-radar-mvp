
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const ScoreTester: React.FC = () => {
  const [industryMatch, setIndustryMatch] = useState<number>(0);
  const [stageMatch, setStageMatch] = useState<number>(0);
  const [traction, setTraction] = useState<number>(0);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetScore = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Based on the Supabase function, it expects investorPrefs and startup objects
      const requestBody = {
        investorPrefs: {
          industries: ["Tech"], // Default values for testing
          stages: ["Seed"],
          valuationMin: 1000000,
          valuationMax: 10000000,
          maxBurnRate: 50000
        },
        startup: {
          industry: "Tech",
          stage: "Seed",
          valuation: 5000000,
          mrrGrowth: traction, // Using traction input as MRR growth
          burnRate: 30000,
          founderExperienceScore: industryMatch // Using industryMatch as founder score
        }
      };

      const { data, error } = await supabase.functions.invoke('score', {
        body: requestBody
      });

      if (error) {
        throw new Error(error.message);
      }

      setScore(data.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Score Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="industryMatch">Founder Experience Score (0-10)</Label>
          <Input
            id="industryMatch"
            type="number"
            value={industryMatch}
            onChange={(e) => setIndustryMatch(Number(e.target.value))}
            placeholder="Enter founder experience score (0-10)"
            min="0"
            max="10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stageMatch">Stage Match (unused in test)</Label>
          <Input
            id="stageMatch"
            type="number"
            value={stageMatch}
            onChange={(e) => setStageMatch(Number(e.target.value))}
            placeholder="Not used in current test"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="traction">MRR Growth Rate (%)</Label>
          <Input
            id="traction"
            type="number"
            value={traction}
            onChange={(e) => setTraction(Number(e.target.value))}
            placeholder="Enter MRR growth rate"
          />
        </div>

        <Button 
          onClick={handleGetScore} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Getting Score...' : 'Get Score'}
        </Button>

        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <h3 className="font-semibold mb-2">Result:</h3>
          {error && (
            <div className="text-red-600">
              Error: {error}
            </div>
          )}
          {score !== null && !error && (
            <div className="text-green-600 font-mono">
              Score: {score}
            </div>
          )}
          {score === null && !error && !loading && (
            <div className="text-gray-500">
              Click "Get Score" to see the result
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreTester;
