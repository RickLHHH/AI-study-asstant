'use client';

import { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { LoadingOverlay } from '@/components/layout/LoadingOverlay';
import { CaseInputPanel } from '@/components/case-input/CaseInputPanel';
import { AnalysisPanel } from '@/components/analysis-result/AnalysisPanel';
import { QuizPanel } from '@/components/quiz-section/QuizPanel';
import { AnalysisProgress } from '@/components/analysis-result/AnalysisProgress';
import { useCaseStore } from '@/stores/useCaseStore';
import { CaseInput, CaseAnalysis, StreamChunk, AnalysisPhase } from '@/types';

export default function Home() {
  const {
    currentCase,
    currentAnalysis,
    isAnalyzing,
    thinkingContent,
    error,
    setCurrentCase,
    setAnalysis,
    setAnalyzing,
    setError,
    appendThinking,
    clearThinking,
    saveToHistory,
  } = useCaseStore();

  // 分析阶段状态
  const [analysisPhase, setAnalysisPhase] = useState<AnalysisPhase>('idle');

  const handleSubmit = useCallback(async (caseData: CaseInput) => {
    setCurrentCase(caseData);
    setAnalyzing(true);
    setError(null);
    clearThinking();
    setAnalysisPhase('idle');  // 初始为 idle，收到 thinking 后变为 understanding

    try {
      const response = await fetch('/api/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseContent: caseData.content,
          subjectArea: caseData.subjectArea,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '请求失败');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应');
      }

      let buffer = '';
      let accumulatedThinking = '';
      let finalAnalysis: CaseAnalysis | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const chunk: StreamChunk = JSON.parse(line);
            
            if (chunk.type === 'thinking' && chunk.content) {
              accumulatedThinking += chunk.content;
              appendThinking(chunk.content);
              // 从 idle 进入 understanding，然后到 reasoning
              if (analysisPhase === 'idle') {
                setAnalysisPhase('understanding');
              } else if (analysisPhase === 'understanding' && accumulatedThinking.length > 100) {
                setAnalysisPhase('reasoning');
              }
            } else if (chunk.type === 'analysis' && chunk.data) {
              finalAnalysis = chunk.data;
            } else if (chunk.type === 'error') {
              throw new Error(chunk.error || '分析失败');
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }

      if (finalAnalysis) {
        setAnalysis(finalAnalysis);
        setAnalysisPhase('complete');
        // 保存到历史记录
        setTimeout(() => {
          saveToHistory();
        }, 0);
      } else {
        throw new Error('未能获取分析结果');
      }

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : '分析过程中出现错误');
    } finally {
      setAnalyzing(false);
    }
  }, [setCurrentCase, setAnalyzing, setError, clearThinking, appendThinking, setAnalysis, saveToHistory, analysisPhase]);

  const isStreaming = isAnalyzing && thinkingContent.length > 0 && !currentAnalysis;

  // 当 thinkingContent 很长但还没收到分析结果时，进入题目生成阶段
  useEffect(() => {
    if (isAnalyzing && thinkingContent.length > 200 && !currentAnalysis) {
      setAnalysisPhase('generating');
    }
  }, [thinkingContent, isAnalyzing, currentAnalysis]);

  // 分析完成时重置状态
  useEffect(() => {
    if (currentAnalysis) {
      setAnalysisPhase('complete');
    }
  }, [currentAnalysis]); 

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-16 min-h-screen">
        <div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              {error}
            </motion.div>
          )}

          {/* Desktop & Tablet Layout */}
          <div className="hidden md:grid md:grid-cols-[2fr_3fr_2fr] lg:grid-cols-3 gap-6">
            {/* Left: Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CaseInputPanel 
                onSubmit={handleSubmit} 
                loading={isAnalyzing} 
              />
            </motion.div>

            {/* Center: Analysis Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Analysis Progress Indicator - 只在分析中显示 */}
              {isAnalyzing && analysisPhase !== 'idle' && (
                <AnalysisProgress 
                  phase={analysisPhase} 
                  thinkingLength={thinkingContent.length}
                />
              )}
              <AnalysisPanel
                analysis={currentAnalysis}
                thinkingContent={thinkingContent}
                loading={isAnalyzing && !thinkingContent}
                isStreaming={isStreaming}
              />
            </motion.div>

            {/* Right: Quiz Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <QuizPanel
                question={currentAnalysis?.generatedQuestion || null}
                loading={isAnalyzing}
                phase={analysisPhase}
              />
            </motion.div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            <CaseInputPanel 
              onSubmit={handleSubmit} 
              loading={isAnalyzing} 
            />
            
            {/* Mobile Analysis Progress - 只在分析中显示 */}
            {isAnalyzing && analysisPhase !== 'idle' && (
              <AnalysisProgress 
                phase={analysisPhase} 
                thinkingLength={thinkingContent.length}
              />
            )}
            
            {currentAnalysis && (
              <>
                <AnalysisPanel
                  analysis={currentAnalysis}
                  thinkingContent={thinkingContent}
                  loading={false}
                  isStreaming={false}
                />
                <QuizPanel
                  question={currentAnalysis.generatedQuestion}
                  loading={false}
                  phase={analysisPhase}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      <LoadingOverlay 
        isLoading={isAnalyzing && !thinkingContent} 
        message="AI正在深度分析案例..."
      />
    </div>
  );
}
