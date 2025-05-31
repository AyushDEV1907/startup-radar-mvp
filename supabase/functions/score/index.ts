
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvestorPrefs {
  industries: string[];
  stages: string[];
  valuationMin: number;
  valuationMax: number;
  maxBurnRate: number;
}

interface Startup {
  industry: string;
  stage: string;
  valuation: number;
  mrrGrowth: number;
  burnRate: number;
  founderExperienceScore: number;
}

interface ScoreRequest {
  investorPrefs: InvestorPrefs;
  startup: Startup;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { investorPrefs, startup }: ScoreRequest = await req.json();

    let score = 0;

    // +20 if industry matches
    if (investorPrefs.industries.includes(startup.industry)) {
      score += 20;
    }

    // +15 if stage matches
    if (investorPrefs.stages.includes(startup.stage)) {
      score += 15;
    }

    // +15 if valuation within investor range
    if (startup.valuation >= investorPrefs.valuationMin && startup.valuation <= investorPrefs.valuationMax) {
      score += 15;
    }

    // +20 if MRR growth is positive
    if (startup.mrrGrowth > 0) {
      score += 20;
    }

    // +15 if burn rate is below investor max
    if (startup.burnRate < investorPrefs.maxBurnRate) {
      score += 15;
    }

    // +15 if founder experience score > 7
    if (startup.founderExperienceScore > 7) {
      score += 15;
    }

    console.log(`Calculated score: ${score} for startup in ${startup.industry} industry`);

    return new Response(
      JSON.stringify({ score }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in score function:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
