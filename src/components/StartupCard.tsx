
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Users } from 'lucide-react';
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
  const founderScore = parsedMetrics.founder_experience_score || 0;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
          {score && (
            <Badge variant="secondary" className="text-xs">
              Score: {score.toFixed(2)}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{industry}</Badge>
          <Badge variant="outline">{stage}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div>
              <p className="font-medium">${mrr.toLocaleString()}</p>
              <p className="text-gray-500">MRR</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <div>
              <p className="font-medium">{founderScore}/10</p>
              <p className="text-gray-500">Founder Score</p>
            </div>
          </div>
        </div>
        
        {source && (
          <Badge variant="outline" className="text-xs">
            {source === 'vertical' ? 'Personal Match' : 'Community Choice'}
          </Badge>
        )}
        
        <Link to={`/startups/${startupId}`} className="block">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
