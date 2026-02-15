'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LegalBasis, SubjectArea } from '@/types';
import { Progress } from '@/components/ui/progress';

interface LegalBasisCardProps {
  data: LegalBasis;
  index: number;
}

const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
  [SubjectArea.CRIMINAL_LAW]: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  [SubjectArea.CIVIL_LAW]: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  [SubjectArea.CRIMINAL_PROCEDURE]: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  [SubjectArea.CIVIL_PROCEDURE]: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  [SubjectArea.ADMINISTRATIVE_LAW]: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  [SubjectArea.COMMERCIAL_LAW]: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  [SubjectArea.THEORETICAL_LAW]: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  [SubjectArea.INTERNATIONAL_LAW]: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
};

function getSubjectFromArticle(article: string): string {
  if (article.includes('刑') && !article.includes('诉讼')) return SubjectArea.CRIMINAL_LAW;
  if (article.includes('民法')) return SubjectArea.CIVIL_LAW;
  if (article.includes('刑事诉讼')) return SubjectArea.CRIMINAL_PROCEDURE;
  if (article.includes('民事诉讼')) return SubjectArea.CIVIL_PROCEDURE;
  if (article.includes('行政')) return SubjectArea.ADMINISTRATIVE_LAW;
  if (article.includes('公司') || article.includes('破产') || article.includes('商标') || article.includes('专利')) return SubjectArea.COMMERCIAL_LAW;
  return SubjectArea.THEORETICAL_LAW;
}

export function LegalBasisCard({ data, index }: LegalBasisCardProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const subject = getSubjectFromArticle(data.article);
  const colors = subjectColors[subject] || subjectColors[SubjectArea.THEORETICAL_LAW];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`${colors.bg} ${colors.text} ${colors.border} border`}>
                  {data.article}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <TrendingUp className="w-3 h-3" />
                  近5年考频: {data.frequency}次
                </div>
              </div>
              
              {/* Relevance Progress */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-500">相关度</span>
                <div className="flex-1">
                  <Progress value={data.relevance} className="h-2" />
                </div>
                <span className="text-xs font-medium text-slate-700">{data.relevance}%</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="shrink-0"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="p-4 pt-0 space-y-3">
                {/* Law Content */}
                <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-300">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-medium text-slate-600">法条原文</span>
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    {data.content}
                  </p>
                </div>
                
                {/* AI Interpretation */}
                <div>
                  <span className="text-xs font-medium text-blue-600 mb-1 block">
                    AI 通俗解读
                  </span>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {data.interpretation}
                  </p>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
