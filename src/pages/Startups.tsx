
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMarketplaceStartups } from '@/hooks/useStartups';
import { StartupCard } from '@/components/StartupCard';
import { StartupSearch } from '@/components/StartupSearch';

export default function Startups() {
  const { data: startups, isLoading, error } = useMarketplaceStartups();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Startup Marketplace</h1>
            <div className="text-gray-600">
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
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No startups found matching your criteria.</p>
              <Button variant="outline" onClick={clearFilters}>
                View All Startups
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map(startup => (
              <StartupCard
                key={startup.id}
                startupId={startup.id}
                name={startup.name}
                industry={startup.industry}
                stage={startup.stage}
                metrics={startup.metrics}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
