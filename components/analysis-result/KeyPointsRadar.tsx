'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyPoint } from '@/types';
import { Target } from 'lucide-react';

interface KeyPointsRadarProps {
  points: KeyPoint[];
}

export function KeyPointsRadar({ points }: KeyPointsRadarProps) {
  // 取前6个主要考点，其他合并
  const mainPoints = points.slice(0, 6);
  const otherPoints = points.slice(6);
  
  const chartData = mainPoints.map(point => ({
    subject: point.name.slice(0, 6), // 截短以适应图表
    weight: point.weight,
    fullName: point.name,
  }));

  if (otherPoints.length > 0) {
    const otherWeight = otherPoints.reduce((sum, p) => sum + p.weight, 0) / otherPoints.length;
    chartData.push({
      subject: '其他',
      weight: Math.round(otherWeight),
      fullName: `其他${otherPoints.length}个考点`,
    });
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="w-5 h-5 text-blue-600" />
          考点分布
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Radar
                name="重要性"
                dataKey="weight"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {mainPoints.map((point, index) => (
            <div 
              key={index}
              className="flex items-center gap-1 text-xs"
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: `hsl(${210 + index * 30}, 70%, 50%)`,
                  opacity: 0.7 + (point.weight / 100) * 0.3
                }}
              />
              <span className="text-slate-600">{point.name}</span>
              <span className="text-slate-400">({point.weight})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
