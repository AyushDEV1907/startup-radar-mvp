
interface InvestorPreferences {
  industries: string[];
  stages: string[];
  valuationMin: number;
  valuationMax: number;
  maxBurnRate: number;
}

interface DiversifiedStartup {
  name: string;
  industry: string;
  stage: string;
  description: string;
  metrics: {
    mrr: string;
    growth: string;
    runway: string;
    teamSize: string;
  };
  highlights: string[];
  // Internal data for scoring
  valuation: number;
  mrrGrowth: number;
  burnRate: number;
  founderExperienceScore: number;
}

export const generateDiversifiedStartups = (preferences: InvestorPreferences): DiversifiedStartup[] => {
  const baseStartups = [
    {
      name: "MedAI Diagnostics",
      industry: "HealthTech",
      stage: "Series A",
      description: "AI-powered medical imaging platform used by 200+ hospitals worldwide",
      metrics: { mrr: "$120K", growth: "+450% YoY", runway: "18 months", teamSize: "25 employees" },
      highlights: ["FDA approved", "Top tier VCs", "Strong IP portfolio"],
      valuation: 15000000, mrrGrowth: 4.5, burnRate: 80000, founderExperienceScore: 9.2
    },
    {
      name: "EcoCharge Solutions",
      industry: "CleanTech",
      stage: "Seed",
      description: "Revolutionary battery recycling technology with 95% material recovery rate",
      metrics: { mrr: "$45K", growth: "+280% YoY", runway: "24 months", teamSize: "12 employees" },
      highlights: ["Patent pending", "Government grants", "Tesla partnership"],
      valuation: 8000000, mrrGrowth: 2.8, burnRate: 35000, founderExperienceScore: 7.8
    },
    {
      name: "FlexWork Platform",
      industry: "HR Tech",
      stage: "Pre-Seed",
      description: "AI-driven remote work optimization platform for enterprise teams",
      metrics: { mrr: "$18K", growth: "+190% YoY", runway: "12 months", teamSize: "8 employees" },
      highlights: ["Y Combinator", "Fortune 500 pilots", "Strong NPS"],
      valuation: 3000000, mrrGrowth: 1.9, burnRate: 25000, founderExperienceScore: 6.5
    },
    {
      name: "CryptoShield Security",
      industry: "Cybersecurity",
      stage: "Series A",
      description: "Next-gen blockchain security infrastructure for DeFi protocols",
      metrics: { mrr: "$95K", growth: "+320% YoY", runway: "20 months", teamSize: "18 employees" },
      highlights: ["$2B+ secured", "Zero breaches", "Enterprise ready"],
      valuation: 12000000, mrrGrowth: 3.2, burnRate: 65000, founderExperienceScore: 8.7
    },
    {
      name: "LearnSpace VR",
      industry: "EdTech",
      stage: "Seed",
      description: "Immersive VR learning platform for K-12 education with proven outcomes",
      metrics: { mrr: "$67K", growth: "+240% YoY", runway: "15 months", teamSize: "14 employees" },
      highlights: ["500+ schools", "Proven efficacy", "Content partnerships"],
      valuation: 6000000, mrrGrowth: 2.4, burnRate: 45000, founderExperienceScore: 7.3
    },
    {
      name: "AgriTech Precision",
      industry: "AgTech",
      stage: "Series A",
      description: "IoT-powered precision farming platform increasing crop yields by 40%",
      metrics: { mrr: "$85K", growth: "+380% YoY", runway: "22 months", teamSize: "20 employees" },
      highlights: ["10K+ farms", "Sustainability focus", "Government backing"],
      valuation: 18000000, mrrGrowth: 3.8, burnRate: 70000, founderExperienceScore: 8.1
    },
    {
      name: "RetailAI Insights",
      industry: "E-commerce",
      stage: "Seed",
      description: "Computer vision platform for retail analytics and inventory management",
      metrics: { mrr: "$52K", growth: "+210% YoY", runway: "16 months", teamSize: "11 employees" },
      highlights: ["Major retailers", "Real-time analytics", "90% accuracy"],
      valuation: 7500000, mrrGrowth: 2.1, burnRate: 38000, founderExperienceScore: 7.0
    },
    {
      name: "FinFlow Analytics",
      industry: "FinTech",
      stage: "Pre-Seed",
      description: "AI-powered financial risk assessment for SME lending",
      metrics: { mrr: "$28K", growth: "+160% YoY", runway: "14 months", teamSize: "9 employees" },
      highlights: ["Banking partnerships", "Regulatory compliant", "High accuracy"],
      valuation: 4000000, mrrGrowth: 1.6, burnRate: 30000, founderExperienceScore: 6.8
    }
  ];

  // Create a diversified selection based on preferences
  const diversifiedSelection: DiversifiedStartup[] = [];
  
  // 1. Include 2 startups that match preferences perfectly
  const perfectMatches = baseStartups.filter(startup => 
    preferences.industries.includes(startup.industry) &&
    preferences.stages.includes(startup.stage) &&
    startup.valuation >= preferences.valuationMin &&
    startup.valuation <= preferences.valuationMax &&
    startup.burnRate <= preferences.maxBurnRate
  );
  
  diversifiedSelection.push(...perfectMatches.slice(0, 2));
  
  // 2. Include 1 startup that partially matches (industry match but different stage/valuation)
  const partialMatches = baseStartups.filter(startup => 
    preferences.industries.includes(startup.industry) &&
    !diversifiedSelection.includes(startup) &&
    (startup.valuation < preferences.valuationMin || startup.valuation > preferences.valuationMax || !preferences.stages.includes(startup.stage))
  );
  
  if (partialMatches.length > 0) {
    diversifiedSelection.push(partialMatches[0]);
  }
  
  // 3. Include 1 startup from different industry but same stage
  const stageMatches = baseStartups.filter(startup => 
    !preferences.industries.includes(startup.industry) &&
    preferences.stages.includes(startup.stage) &&
    !diversifiedSelection.includes(startup)
  );
  
  if (stageMatches.length > 0) {
    diversifiedSelection.push(stageMatches[0]);
  }
  
  // 4. Include 1 wildcard startup (completely different)
  const wildcards = baseStartups.filter(startup => 
    !preferences.industries.includes(startup.industry) &&
    !preferences.stages.includes(startup.stage) &&
    !diversifiedSelection.includes(startup)
  );
  
  if (wildcards.length > 0) {
    diversifiedSelection.push(wildcards[0]);
  }
  
  // Fill remaining slots if needed
  while (diversifiedSelection.length < 5 && diversifiedSelection.length < baseStartups.length) {
    const remaining = baseStartups.filter(startup => !diversifiedSelection.includes(startup));
    if (remaining.length > 0) {
      diversifiedSelection.push(remaining[0]);
    } else {
      break;
    }
  }
  
  return diversifiedSelection.slice(0, 5);
};
