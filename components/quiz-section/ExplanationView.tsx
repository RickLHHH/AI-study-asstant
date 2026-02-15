'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ExplanationViewProps {
  explanation: string;
  commonMistakes: string[];
}

export function ExplanationView({ explanation, commonMistakes }: ExplanationViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Correct Explanation */}
      <Card className="border-emerald-200 bg-emerald-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-emerald-800">
            <CheckCircle2 className="w-5 h-5" />
            正确答案解析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">
            {explanation}
          </p>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      {commonMistakes.length > 0 && (
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
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <Lightbulb className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-900">{mistake}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
