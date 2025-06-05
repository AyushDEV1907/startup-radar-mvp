
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const demoStartups = [
  {
    name: "HealthAI Diagnostics",
    industry: "HealthTech",
    stage: "Seed",
    metrics: {
      mrr: 15000,
      burn_rate: 25000,
      founder_experience_score: 8
    },
    pitch_deck_url: "https://example.com/healthai-pitch.pdf"
  },
  {
    name: "FinanceFlow Pro",
    industry: "FinTech",
    stage: "Series A",
    metrics: {
      mrr: 75000,
      burn_rate: 120000,
      founder_experience_score: 9
    },
    pitch_deck_url: "https://example.com/financeflow-pitch.pdf"
  },
  {
    name: "EduTech Innovators",
    industry: "EdTech",
    stage: "Pre-Seed",
    metrics: {
      mrr: 5000,
      burn_rate: 15000,
      founder_experience_score: 6
    },
    pitch_deck_url: "https://example.com/edutech-pitch.pdf"
  },
  {
    name: "CleanEnergy Solutions",
    industry: "CleanTech",
    stage: "Seed",
    metrics: {
      mrr: 25000,
      burn_rate: 40000,
      founder_experience_score: 7
    },
    pitch_deck_url: "https://example.com/cleanenergy-pitch.pdf"
  },
  {
    name: "CyberSecure AI",
    industry: "Cybersecurity",
    stage: "Series A",
    metrics: {
      mrr: 95000,
      burn_rate: 150000,
      founder_experience_score: 9
    },
    pitch_deck_url: "https://example.com/cybersecure-pitch.pdf"
  },
  {
    name: "GameChanger Studios",
    industry: "Gaming",
    stage: "Pre-Seed",
    metrics: {
      mrr: 8000,
      burn_rate: 18000,
      founder_experience_score: 5
    },
    pitch_deck_url: "https://example.com/gamechanger-pitch.pdf"
  },
  {
    name: "BioPharm Innovations",
    industry: "Biotech",
    stage: "Series B",
    metrics: {
      mrr: 200000,
      burn_rate: 300000,
      founder_experience_score: 8
    },
    pitch_deck_url: "https://example.com/biopharm-pitch.pdf"
  },
  {
    name: "AI Assistant Co",
    industry: "AI/ML",
    stage: "Seed",
    metrics: {
      mrr: 45000,
      burn_rate: 65000,
      founder_experience_score: 8
    },
    pitch_deck_url: "https://example.com/aiassistant-pitch.pdf"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting to seed demo startups...');

    // Check if startups already exist
    const { data: existingStartups } = await supabase
      .from('startups')
      .select('count(*)')
      .single();

    const count = existingStartups?.count || 0;

    if (count > 5) {
      return new Response(
        JSON.stringify({ 
          message: 'Demo startups already exist', 
          count: count 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a demo founder ID
    const demoFounderId = '550e8400-e29b-41d4-a716-446655440000';

    const startupsToInsert = demoStartups.map(startup => ({
      ...startup,
      founder_id: demoFounderId,
      metrics: JSON.stringify(startup.metrics)
    }));

    const { data, error } = await supabase
      .from('startups')
      .insert(startupsToInsert)
      .select();

    if (error) {
      console.error('Error inserting demo startups:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data?.length || 0} demo startups`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Seeded ${data?.length || 0} demo startups`,
        startups: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in seed-demo-startups function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
