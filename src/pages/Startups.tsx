
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMarketplaceStartups } from '@/hooks/useStartups';
import { StartupCard } from '@/components/StartupCard';
import { StartupSearch } from '@/components/StartupSearch';
import { useInvestorAuth } from '@/hooks/useInvestorAuth';
import { Navigate } from 'react-router-dom';

export default function Startups() {
  const { user, loading: authLoading } = useInvestorAuth();
  const { data: startups, isLoading, error } = useMarketplaceStartups();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

  // Redirect non-authenticated users to signup
  if (!authLoading && !user) {
    return <Navigate to="/investor-signup" replace />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('');
    setSelectedStage('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading marketplace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-red-600 mb-4">Failed to load startups</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Enhanced filtering logic
  const filteredStartups = startups?.filter(startup => {
    const matchesSearch = searchTerm === '' || 
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (startup.metrics && JSON.stringify(startup.metrics).toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = !selectedIndustry || startup.industry === selectedIndustry;
    const matchesStage = !selectedStage || startup.stage === selectedStage;
    
    return matchesSearch && matchesIndustry && matchesStage;
  }) || [];

  // Get unique industries and stages for filters
  const industries = [...new Set(startups?.map(s => s.industry) || [])];
  const stages = [...new Set(startups?.map(s => s.stage) || [])];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Startup Marketplace
              </h1>
              <p className="text-gray-600 mt-1">Discover your next investment opportunity</p>
            </div>
            <div className="text-gray-600 bg-white/60 px-3 py-1 rounded-full">
              {filteredStartups.length} of {startups?.length || 0} startups
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search and Filters */}
        <StartupSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          selectedStage={selectedStage}
          setSelectedStage={setSelectedStage}
          industries={industries}
          stages={stages}
          onClearFilters={clearFilters}
        />

        {/* Results */}
        {filteredStartups.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              {startups?.length === 0 ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 3v18m0-18h6m-6 0a2 2 0 012-2h2a2 2 0 012 2M9 21v-9a2 2 0 012-2h2a2 2 0 012 2v9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">No startups available yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    The marketplace is waiting for entrepreneurs to showcase their innovative startups. 
                    Check back soon for new investment opportunities!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">No startups match your criteria</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search terms or filters to discover more opportunities.
                  </p>
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    Clear All Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map(startup => (
              <div key={startup.id} className="transform transition-all duration-200 hover:scale-105">
                <StartupCard
                  startupId={startup.id}
                  name={startup.name}
                  industry={startup.industry}
                  stage={startup.stage}
                  metrics={startup.metrics}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
