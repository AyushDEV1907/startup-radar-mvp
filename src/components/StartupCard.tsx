
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Users, DollarSign, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StartupCardProps {
  startupId: string;
  name: string;
  industry: string;
  stage: string;
  metrics?: any;
  score?: number;
  source?: string;
}

export function StartupCard({ 
  startupId, 
  name, 
  industry, 
  stage, 
  metrics, 
  score, 
  source 
}: StartupCardProps) {
  const parsedMetrics = typeof metrics === 'string' ? JSON.parse(metrics) : metrics || {};
  const mrr = parsedMetrics.mrr || 0;
  const burnRate = parsedMetrics.burn_rate || 0;
  const founderScore = parsedMetrics.founder_experience_score || 0;

  // Calculate runway in months
  const runway = mrr > 0 && burnRate > 0 ? Math.floor(mrr / burnRate) : 0;

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight">{name}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Early-stage startup</p>
            </div>
          </div>
          {score && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              {score.toFixed(1)}% match
            </Badge>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <Badge variant="outline" className="text-xs">{industry}</Badge>
          <Badge variant="outline" className="text-xs">{stage}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div>
              <p className="font-medium">${mrr.toLocaleString()}</p>
              <p className="text-gray-500 text-xs">MRR</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <DollarSign className="w-4 h-4 text-red-600" />
            <div>
              <p className="font-medium">${burnRate.toLocaleString()}</p>
              <p className="text-gray-500 text-xs">Burn/mo</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="font-medium">{founderScore}/10</span>
            <span className="text-gray-500">Founder Score</span>
          </div>
          {runway > 0 && (
            <div className="text-right">
              <p className="font-medium text-blue-600">{runway}mo</p>
              <p className="text-gray-500 text-xs">Runway</p>
            </div>
          )}
        </div>
        
        {source && (
          <Badge variant="outline" className="text-xs w-fit">
            {source === 'vertical' ? '🎯 Personal Match' : '🔥 Community Choice'}
          </Badge>
        )}
        
        <Link to={`/startups/${startupId}`} className="block">
          <Button className="w-full group-hover:bg-blue-700 transition-colors flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
