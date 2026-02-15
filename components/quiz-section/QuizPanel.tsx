'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GeneratedQuestion, UserAnswer, QuestionType } from '@/types';
import { useCaseStore } from '@/stores/useCaseStore';
import { QuestionCard } from './QuestionCard';
import { OptionButton } from './OptionButton';
import { ExplanationView } from './ExplanationView';

interface QuizPanelProps {
  question: GeneratedQuestion | null;
  loading: boolean;
}

export function QuizPanel({ question, loading }: QuizPanelProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { currentCase, saveToHistory, saveUserAnswer } = useCaseStore();

  // Reset state when question changes
  useEffect(() => {
    if (question) {
      setSelectedOption(null);
      setHasSubmitted(false);
      setStartTime(Date.now());
      setElapsedTime(0);
    }
  }, [question]);

  // Timer
  useEffect(() => {
    if (!hasSubmitted && startTime > 0) {
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [hasSubmitted, startTime]);

  const handleSubmit = useCallback(() => {
    if (!selectedOption || !question || !currentCase) return;

    const isCorrect = selectedOption === question.correctAnswer;
    const timeSpent = Date.now() - startTime;

    const userAnswer: UserAnswer = {
      questionId: currentCase.id,
      selectedOption,
      isCorrect,
      timeSpent,
      answeredAt: Date.now(),
    };

    saveUserAnswer(userAnswer);
    setHasSubmitted(true);
  }, [selectedOption, question, currentCase, startTime, saveUserAnswer]);

  const handleReset = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          等待题目生成
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          AI分析完成后，将基于案例自动生成符合法考大纲的模拟题
        </p>
      </Card>
    );
  }

  const isCorrect = hasSubmitted && selectedOption === question.correctAnswer;

  return (
    <div className="space-y-4">
      {/* Timer */}
      <AnimatePresence mode="wait">
        {!hasSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    答题用时
                  </span>
                </div>
                <Badge className="bg-amber-100 text-amber-800">
                  {formatTime(elapsedTime)}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Banner */}
      {hasSubmitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className={isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                  }`}>
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className={`font-semibold ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                      {isCorrect ? '回答正确！' : '回答错误'}
                    </p>
                    <p className="text-sm text-slate-600">
                      用时: {formatTime(elapsedTime)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  重做
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Question */}
      <QuestionCard question={question} />

      {/* Options */}
      <div className="space-y-2">
        {question.options?.map((option, index) => (
          <motion.div
            key={option.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <OptionButton
              option={option}
              selected={selectedOption === option.key}
              disabled={hasSubmitted}
              showResult={hasSubmitted}
              onClick={() => setSelectedOption(option.key)}
            />
          </motion.div>
        ))}
      </div>

      {/* Submit Button */}
      {!hasSubmitted && selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
          >
            提交答案
          </Button>
        </motion.div>
      )}

      {/* Explanation */}
      {hasSubmitted && (
        <ExplanationView
          explanation={question.explanation}
          commonMistakes={question.commonMistakes}
        />
      )}
    </div>
  );
}
