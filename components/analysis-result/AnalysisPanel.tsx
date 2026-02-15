'use client';

import { FileSearch, Sparkles, BookOpen, Target, AlertCircle, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CaseAnalysis } from '@/types';
import { ThinkingChain } from './ThinkingChain';
import { LegalBasisCard } from './LegalBasisCard';
import { KeyPointsRadar } from './KeyPointsRadar';
import { DifficultyBadge } from './DifficultyBadge';
import { motion } from 'framer-motion';

interface AnalysisPanelProps {
  analysis: CaseAnalysis | null;
  thinkingContent: string;
  loading: boolean;
  isStreaming: boolean;
}

export function AnalysisPanel({ analysis, thinkingContent, loading, isStreaming }: AnalysisPanelProps) {
  if (loading && !analysis) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!analysis && !thinkingContent) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <FileSearch className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          等待案例输入
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          在左侧输入法律案例，AI将自动分析涉案法条、考点，并生成模拟题
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Thinking Chain */}
      {(thinkingContent || isStreaming) && (
        <ThinkingChain 
          content={thinkingContent} 
          isStreaming={isStreaming} 
        />
      )}

      {/* Analysis Content */}
      {analysis && (
        <>
          {/* Case Type & Difficulty */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-slate-500">案例类型</span>
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                      {analysis.caseType}
                    </Badge>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-slate-200" />
                  <DifficultyBadge difficulty={analysis.difficulty} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Key Points Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <KeyPointsRadar points={analysis.keyPoints} />
          </motion.div>

          {/* Legal Basis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  涉及法条
                  <Badge variant="outline" className="ml-2">
                    {analysis.legalBasis.length}条
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.legalBasis.map((basis, index) => (
                  <LegalBasisCard key={index} data={basis} index={index} />
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Study Advice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  学习建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {analysis.studyAdvice}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
