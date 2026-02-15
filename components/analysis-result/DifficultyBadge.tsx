'use client';

import { Badge } from '@/components/ui/badge';
import { DifficultyLevel, DifficultyInfo } from '@/types';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface DifficultyBadgeProps {
  difficulty: DifficultyInfo;
}

const levelConfig = {
  [DifficultyLevel.EASY]: {
    label: '简单',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  [DifficultyLevel.MEDIUM]: {
    label: '中等',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: HelpCircle,
  },
  [DifficultyLevel.HARD]: {
    label: '困难',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertCircle,
  },
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = levelConfig[difficulty.level] || levelConfig[DifficultyLevel.MEDIUM];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <Badge className={`${config.color} border px-3 py-1`}>
        <Icon className="w-3.5 h-3.5 mr-1.5" />
        {config.label}
      </Badge>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-slate-700">
            难度
          </span>
          <span className="text-sm font-bold text-slate-900">
            {difficulty.score}/10
          </span>
        </div>
        
        {/* Score bar */}
        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              difficulty.score <= 3 ? 'bg-emerald-500' :
              difficulty.score <= 6 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${(difficulty.score / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
