
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      const response = await fetch('https://hzboruygxgqfnfmifuuu.supabase.co/functions/v1/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          industryMatch,
          stageMatch,
          traction
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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
          <Label htmlFor="industryMatch">Industry Match</Label>
          <Input
            id="industryMatch"
            type="number"
            value={industryMatch}
            onChange={(e) => setIndustryMatch(Number(e.target.value))}
            placeholder="Enter industry match score"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stageMatch">Stage Match</Label>
          <Input
            id="stageMatch"
            type="number"
            value={stageMatch}
            onChange={(e) => setStageMatch(Number(e.target.value))}
            placeholder="Enter stage match score"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="traction">Traction</Label>
          <Input
            id="traction"
            type="number"
            value={traction}
            onChange={(e) => setTraction(Number(e.target.value))}
            placeholder="Enter traction score"
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
