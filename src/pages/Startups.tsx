
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Filter, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Startups = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');

  const startups = [
    {
      id: 1,
      name: "AI Health Diagnostics",
      industry: "HealthTech",
      stage: "Series A",
      score: 92,
      mrr: "$45K",
      growth: "+340%",
      description: "Revolutionary AI-powered medical imaging platform transforming healthcare diagnostics"
    },
    {
      id: 2,
      name: "CleanTech Solutions",
      industry: "CleanTech", 
      stage: "Seed",
      score: 87,
      mrr: "$23K",
      growth: "+280%",
      description: "Next-generation renewable energy storage solutions for grid-scale applications"
    },
    {
      id: 3,
      name: "FinanceFlow Pro",
      industry: "FinTech",
      stage: "Pre-Seed",
      score: 78,
      mrr: "$12K",
      growth: "+190%",
      description: "AI-driven financial planning platform for SMBs with automated cash flow optimization"
    },
    {
      id: 4,
      name: "EduTech Innovators",
      industry: "EdTech",
      stage: "Series A",
      score: 89,
      mrr: "$67K",
      growth: "+310%",
      description: "Personalized learning platform using adaptive AI to improve student outcomes"
    },
    {
      id: 5,
      name: "CyberShield Security",
      industry: "Cybersecurity",
      stage: "Seed",
      score: 84,
      mrr: "$38K",
      growth: "+250%",
      description: "Zero-trust security platform protecting enterprise cloud infrastructure"
    },
    {
      id: 6,
      name: "AgriTech Dynamics",
      industry: "AgTech",
      stage: "Pre-Seed",
      score: 75,
      mrr: "$15K",
      growth: "+160%",
      description: "Precision agriculture platform using IoT sensors and AI for crop optimization"
    },
    {
      id: 7,
      name: "Mobility Nexus",
      industry: "Transportation",
      stage: "Series A",
      score: 91,
      mrr: "$78K",
      growth: "+380%",
      description: "Autonomous vehicle fleet management system for urban transportation"
    },
    {
      id: 8,
      name: "BioGen Therapeutics",
      industry: "Biotech",
      stage: "Seed",
      score: 86,
      mrr: "$29K",
      growth: "+220%",
      description: "Gene therapy platform targeting rare genetic disorders with breakthrough treatments"
    }
  ];

  const industries = ['all', 'HealthTech', 'CleanTech', 'FinTech', 'EdTech', 'Cybersecurity', 'AgTech', 'Transportation', 'Biotech'];
  const stages = ['all', 'Pre-Seed', 'Seed', 'Series A', 'Series B'];

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || startup.industry === selectedIndustry;
    const matchesStage = selectedStage === 'all' || startup.stage === selectedStage;
    
    return matchesSearch && matchesIndustry && matchesStage;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/investor-dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Button>Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Startup Directory</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover high-potential startups with AI-powered investability scores. 
            Filter by industry, stage, and growth metrics to find your perfect match.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search startups or industries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry === 'all' ? 'All Industries' : industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:w-48">
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage === 'all' ? 'All Stages' : stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredStartups.length} of {startups.length} startups
          </p>
        </div>

        {/* Startup Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => (
            <Card key={startup.id} className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors truncate">
                      {startup.name}
                    </h3>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs whitespace-nowrap">
                        {startup.industry}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs whitespace-nowrap">
                        {startup.stage}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ml-2 whitespace-nowrap ${
                    startup.score >= 90 ? 'bg-green-100 text-green-800' :
                    startup.score >= 80 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {startup.score}% Match
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                  {startup.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">MRR:</span>
                    <span className="font-medium text-sm">{startup.mrr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Growth:</span>
                    <span className="font-medium text-green-600 text-sm">{startup.growth}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <Link to={`/startups/${startup.id}`} className="flex-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full group-hover:border-blue-600 group-hover:text-blue-600 transition-colors"
                    >
                      View Details
                      <ArrowRight className="ml-1 w-3 h-3" />
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    Invest
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredStartups.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No startups found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more results.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedIndustry('all');
                setSelectedStage('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Startups;
