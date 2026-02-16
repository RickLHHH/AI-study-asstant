'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Lightbulb, Scale, ListOrdered, Gavel, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuestionExplanation } from '@/types';

interface ExplanationViewProps {
  explanation: QuestionExplanation;
  commonMistakes: string[];
}

export function ExplanationView({ explanation, commonMistakes }: ExplanationViewProps) {
  const sections = [
    {
      key: 'summary',
      icon: <Bookmark className="w-5 h-5 text-emerald-600" />,
      title: '答案概要',
      color: 'emerald',
      content: explanation.summary,
      isList: false,
      showIfEmpty: false,
    },
    {
      key: 'legalBasis',
      icon: <Scale className="w-5 h-5 text-blue-600" />,
      title: '法律依据',
      color: 'blue',
      content: explanation.legalBasis,
      isList: true,
      showIfEmpty: false,
    },
    {
      key: 'reasoning',
      icon: <ListOrdered className="w-5 h-5 text-purple-600" />,
      title: '推理过程',
      color: 'purple',
      content: explanation.reasoning,
      isList: true,
      showIfEmpty: false,
    },
    {
      key: 'conclusion',
      icon: <Gavel className="w-5 h-5 text-indigo-600" />,
      title: '结论',
      color: 'indigo',
      content: explanation.conclusion,
      isList: false,
      showIfEmpty: false,
    },
  ];

  const getBadgeColor = (color: string) => {
    const colors: Record<string, string> = {
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    return colors[color] || colors.emerald;
  };

  const getBgColor = (color: string) => {
    const colors: Record<string, string> = {
      emerald: 'border-emerald-200 bg-emerald-50/30',
      blue: 'border-blue-200 bg-blue-50/30',
      purple: 'border-purple-200 bg-purple-50/30',
      indigo: 'border-indigo-200 bg-indigo-50/30',
    };
    return colors[color] || colors.emerald;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Structured Explanation Sections */}
      {sections.map((section, index) => {
        // 跳过空内容
        if (!section.content || (Array.isArray(section.content) && section.content.length === 0)) {
          if (!section.showIfEmpty) return null;
        }

        return (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={getBgColor(section.color)}>
              <CardHeader className="pb-2">
                <CardTitle className={`flex items-center gap-2 text-base text-${section.color}-800`}>
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {section.isList ? (
                  <ol className="space-y-2">
                    {(section.content as string[]).map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium shrink-0 mt-0.5 ${getBadgeColor(section.color)}`}>
                          {i + 1}
                        </span>
                        <span className={`text-sm text-${section.color}-900 leading-relaxed`}>
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ol>
                ) : (
                  <p className={`text-sm text-${section.color}-900 leading-relaxed`}>
                    {section.content as string}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* Common Mistakes */}
      {commonMistakes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-red-200 bg-red-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-red-800">
                <AlertCircle className="w-5 h-5" />
                常见错误分析
                <Badge variant="outline" className="ml-2 text-red-700 border-red-300">
                  {commonMistakes.length}个
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {commonMistakes.map((mistake, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <Lightbulb className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-red-900">{mistake}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
