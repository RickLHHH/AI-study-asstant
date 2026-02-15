'use client';

import { motion } from 'framer-motion';
import { HelpCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GeneratedQuestion, QuestionType } from '@/types';

interface QuestionCardProps {
  question: GeneratedQuestion;
}

const typeLabels: Record<QuestionType, string> = {
  [QuestionType.SINGLE_CHOICE]: '单选题',
  [QuestionType.MULTIPLE_CHOICE]: '多选题',
  [QuestionType.SUBJECTIVE]: '主观题',
};

const typeColors: Record<QuestionType, string> = {
  [QuestionType.SINGLE_CHOICE]: 'bg-blue-100 text-blue-700 border-blue-200',
  [QuestionType.MULTIPLE_CHOICE]: 'bg-purple-100 text-purple-700 border-purple-200',
  [QuestionType.SUBJECTIVE]: 'bg-orange-100 text-orange-700 border-orange-200',
};

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${typeColors[question.type]} border`}>
              <HelpCircle className="w-3 h-3 mr-1" />
              {typeLabels[question.type]}
            </Badge>
            
            {/* Related Articles */}
            {question.relatedArticles?.map((article, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" />
                {article}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <h3 className="text-lg font-semibold text-slate-900 leading-relaxed">
            {question.question}
          </h3>
        </CardContent>
      </Card>
    </motion.div>
  );
}
