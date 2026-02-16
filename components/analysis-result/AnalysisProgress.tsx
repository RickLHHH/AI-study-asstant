'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, BookOpen, FileQuestion, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export type AnalysisPhase = 'understanding' | 'reasoning' | 'generating' | 'complete';

interface AnalysisProgressProps {
  phase: AnalysisPhase;
  thinkingLength?: number;
}

interface PhaseConfig {
  key: AnalysisPhase;
  label: string;
  icon: React.ReactNode;
  description: string;
  progressPercent: number;
}

export function AnalysisProgress({ phase, thinkingLength = 0 }: AnalysisProgressProps) {
  const phases: PhaseConfig[] = [
    {
      key: 'understanding',
      label: '案例理解',
      icon: <BookOpen className="w-4 h-4" />,
      description: 'AI正在理解案例背景和争议焦点...',
      progressPercent: 15,
    },
    {
      key: 'reasoning',
      label: '法条推理',
      icon: <Brain className="w-4 h-4" />,
      description: thinkingLength > 0 
        ? `已推理 ${thinkingLength} 字，正在分析法律适用...`
        : '正在进行法律推理分析...',
      progressPercent: 45,
    },
    {
      key: 'generating',
      label: '题目生成',
      icon: <FileQuestion className="w-4 h-4" />,
      description: '正在生成符合法考大纲的模拟题...',
      progressPercent: 85,
    },
    {
      key: 'complete',
      label: '分析完成',
      icon: <CheckCircle2 className="w-4 h-4" />,
      description: '案例分析完成，题目已生成',
      progressPercent: 100,
    },
  ];

  const currentPhaseIndex = phases.findIndex(p => p.key === phase);
  const currentPhase = phases[currentPhaseIndex];

  // 计算动态进度：基于阶段 + 微小动画
  const progress = useMemo(() => {
    if (phase === 'complete') return 100;
    
    const baseProgress = currentPhase?.progressPercent || 0;
    // 添加微小随机波动，让进度条看起来在"活动"
    const variation = Math.sin(Date.now() / 500) * 2;
    return Math.min(baseProgress + variation, 99);
  }, [phase, currentPhase]);

  const getPhaseStatus = (index: number) => {
    if (index < currentPhaseIndex) return 'completed';
    if (index === currentPhaseIndex) return 'current';
    return 'pending';
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        {/* 进度条 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: phase !== 'complete' ? 360 : 0 }}
                transition={{ 
                  duration: 2, 
                  repeat: phase !== 'complete' ? Infinity : 0, 
                  ease: 'linear' 
                }}
                className="w-5 h-5"
              >
                {currentPhase?.icon}
              </motion.div>
              <span className="font-medium text-slate-800">
                {currentPhase?.label}
              </span>
            </div>
            <span className="text-sm text-slate-500">
              {Math.round(progress)}%
            </span>
          </div>
          
          {/* 进度条背景 */}
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                type: 'spring',
                stiffness: 50,
                damping: 15
              }}
            />
          </div>
          
          {/* 当前阶段描述 */}
          <p className="text-xs text-slate-500 mt-2">
            {currentPhase?.description}
          </p>
        </div>

        {/* 阶段指示器 */}
        <div className="flex items-center justify-between">
          {phases.slice(0, -1).map((phaseConfig, index) => {
            const status = getPhaseStatus(index);
            
            return (
              <div key={phaseConfig.key} className="flex items-center flex-1">
                {/* 阶段节点 */}
                <motion.div
                  className={`flex flex-col items-center gap-1.5 ${
                    status === 'pending' ? 'opacity-40' : ''
                  }`}
                  animate={status === 'current' ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : status === 'current'
                        ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      phaseConfig.icon
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      status === 'current'
                        ? 'text-blue-600'
                        : status === 'completed'
                        ? 'text-emerald-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {phaseConfig.label}
                  </span>
                </motion.div>

                {/* 连接线 */}
                {index < phases.length - 2 && (
                  <div className="flex-1 mx-2">
                    <div className="h-0.5 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: status === 'completed' ? '100%' : '0%' 
                        }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 提示信息 */}
        {phase === 'generating' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700"
          >
            💡 题目生成中，请稍候...完成后即可开始答题
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
