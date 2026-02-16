'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Lightbulb, AlertTriangle, BookOpen, Link2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudyAdvice } from '@/types';

interface StudyAdviceCardProps {
  advice: StudyAdvice;
}

export function StudyAdviceCard({ advice }: StudyAdviceCardProps) {
  const sections = [
    {
      key: 'summary',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      title: '核心要点',
      color: 'blue',
      content: advice.summary,
      isList: false,
    },
    {
      key: 'keyPoints',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      title: '核心考点',
      color: 'emerald',
      content: advice.keyPoints,
      isList: true,
    },
    {
      key: 'commonMistakes',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      title: '常见错误',
      color: 'amber',
      content: advice.commonMistakes,
      isList: true,
    },
    {
      key: 'studyTips',
      icon: <Lightbulb className="w-5 h-5 text-purple-600" />,
      title: '复习建议',
      color: 'purple',
      content: advice.studyTips,
      isList: true,
    },
    {
      key: 'relatedTopics',
      icon: <Link2 className="w-5 h-5 text-indigo-600" />,
      title: '关联考点',
      color: 'indigo',
      content: advice.relatedTopics,
      isList: true,
    },
  ];

  const getBadgeColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <GraduationCap className="w-5 h-5 text-emerald-600" />
          学习建议
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section, index) => {
          // 跳过空内容
          if (!section.content || (Array.isArray(section.content) && section.content.length === 0)) {
            return null;
          }

          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-l-4 border-slate-200 pl-4"
              style={{ borderLeftColor: `var(--${section.color}-500, #64748b)` }}
            >
              <div className="flex items-center gap-2 mb-2">
                {section.icon}
                <h4 className="font-medium text-slate-800 text-sm">{section.title}</h4>
              </div>
              
              {section.isList ? (
                <ul className="space-y-1.5">
                  {(section.content as string[]).map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-medium shrink-0 ${getBadgeColor(section.color)}`}>
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-700 leading-relaxed">
                  {section.content as string}
                </p>
              )}
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
