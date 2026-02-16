'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, RotateCcw, Play, Sparkles, Loader2, FileText, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GeneratedQuestion, UserAnswer, QuestionType, AnalysisPhase } from '@/types';
import { useCaseStore } from '@/stores/useCaseStore';
import { QuestionCard } from './QuestionCard';
import { OptionButton } from './OptionButton';
import { ExplanationView } from './ExplanationView';

interface QuizPanelProps {
  question: GeneratedQuestion | null;
  loading: boolean;
  phase?: AnalysisPhase;
}

export function QuizPanel({ question, loading, phase = 'idle' }: QuizPanelProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // 是否点击了"开始答题"
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { currentCase, saveUserAnswer } = useCaseStore();

  // 当题目变化时重置状态
  useEffect(() => {
    if (question) {
      setSelectedOption(null);
      setHasSubmitted(false);
      setHasStarted(false); // 新题目默认未开始
      setStartTime(0);
      setElapsedTime(0);
    }
  }, [question]);

  // 计时器 - 只有在开始后才开始计时
  useEffect(() => {
    if (hasStarted && !hasSubmitted && startTime > 0) {
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [hasStarted, hasSubmitted, startTime]);

  // 开始答题
  const handleStart = useCallback(() => {
    setHasStarted(true);
    setStartTime(Date.now());
    setElapsedTime(0);
  }, []);

  // 提交答案
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

  // 重做
  const handleReset = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  // 格式化时间
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // ===== 状态1: 未开始分析 =====
  // 用户刚进入页面，或分析已完成但无题目
  if (!loading && !question) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          等待答题
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mb-4">
          在左侧输入案例并点击"开始分析"，AI将自动生成模拟题供您练习
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-full">
          <FileText className="w-3 h-3" />
          <span>请先完成案例分析</span>
        </div>
      </Card>
    );
  }

  // ===== 状态2: 分析进行中，题目尚未生成 =====
  // 包括：understanding / reasoning / generating / complete（但还没收到题目）
  if (loading && !question) {
    // 在 generating 阶段显示更明确的提示
    const isGenerating = phase === 'generating';
    
    return (
      <Card className={`h-full flex flex-col items-center justify-center p-8 text-center ${
        isGenerating ? 'border-amber-200 bg-amber-50/30' : 'border-blue-200 bg-blue-50/30'
      }`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 relative ${
          isGenerating ? 'bg-amber-100' : 'bg-blue-100'
        }`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            {isGenerating ? (
              <Sparkles className="w-10 h-10 text-amber-500" />
            ) : (
              <Loader2 className="w-10 h-10 text-blue-500" />
            )}
          </motion.div>
          {isGenerating && (
            <motion.div
              className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Loader2 className="w-3 h-3 text-white animate-spin" />
            </motion.div>
          )}
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          {isGenerating ? '题目生成中' : '正在准备题目...'}
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mb-4">
          {isGenerating 
            ? '正在基于案例分析结果生成符合法考大纲的模拟题...'
            : 'AI正在分析案例，题目将在分析完成后自动生成...'
          }
        </p>
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full ${
          isGenerating 
            ? 'text-amber-700 bg-amber-100' 
            : 'text-blue-700 bg-blue-100'
        }`}>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>{isGenerating ? '请稍候，马上就好' : '分析进行中...'}</span>
        </div>
      </Card>
    );
  }

  // 题目已生成但用户未开始答题
  if (!hasStarted && question) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* 题目生成完成状态卡 */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-emerald-800">
                  题目已生成
                </p>
                <p className="text-sm text-emerald-600">
                  基于案例分析结果，AI已生成{question.type === 'single' ? '单选' : question.type === 'multiple' ? '多选' : '主观'}题
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 开始答题按钮 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-dashed border-2 border-blue-300 bg-blue-50/50">
            <CardContent className="p-6 text-center">
              <p className="text-slate-600 mb-4">
                准备好答题了吗？点击开始后将启动计时
              </p>
              <Button
                size="lg"
                className="gap-2 px-8"
                onClick={handleStart}
              >
                <Play className="w-5 h-5" />
                开始答题
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  // 类型守卫：如果执行到这里 question 应该存在
  if (!question) {
    return null;
  }

  const isCorrect = hasSubmitted && selectedOption === question.correctAnswer;

  return (
    <div className="space-y-4">
      {/* 计时器 - 只在开始后显示 */}
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

      {/* 结果展示 */}
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

      {/* 题目 */}
      <QuestionCard question={question} />

      {/* 选项 */}
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

      {/* 提交按钮 */}
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

      {/* 解析 */}
      {hasSubmitted && question.explanation && (
        <ExplanationView
          explanation={question.explanation}
          commonMistakes={question.commonMistakes}
        />
      )}
    </div>
  );
}
