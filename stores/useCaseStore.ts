'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CaseInput, CaseAnalysis, UserAnswer, CaseHistoryItem, SubjectArea } from '@/types';

interface CaseState {
  // 当前状态
  currentCase: CaseInput | null;
  currentAnalysis: CaseAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  thinkingContent: string; // 流式思维链内容
  
  // 历史记录（最多保存20条）
  history: CaseHistoryItem[];
  
  // 动作
  setCurrentCase: (caseData: CaseInput) => void;
  setAnalysis: (analysis: CaseAnalysis) => void;
  setAnalyzing: (status: boolean) => void;
  setError: (error: string | null) => void;
  appendThinking: (chunk: string) => void;
  clearThinking: () => void;
  saveToHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  loadCaseFromHistory: (id: string) => void;
  saveUserAnswer: (answer: UserAnswer) => void;
}

export const useCaseStore = create<CaseState>()(
  persist(
    (set, get) => ({
      currentCase: null,
      currentAnalysis: null,
      isAnalyzing: false,
      error: null,
      thinkingContent: '',
      history: [],
      
      setCurrentCase: (caseData) => set({ 
        currentCase: caseData, 
        currentAnalysis: null,
        error: null,
        thinkingContent: ''
      }),
      
      setAnalysis: (analysis) => set({ 
        currentAnalysis: analysis,
        isAnalyzing: false 
      }),
      
      setAnalyzing: (status) => set({ isAnalyzing: status }),
      
      setError: (error) => set({ error, isAnalyzing: false }),

      appendThinking: (chunk) => set((state) => ({
        thinkingContent: state.thinkingContent + chunk
      })),

      clearThinking: () => set({ thinkingContent: '' }),
      
      saveToHistory: () => {
        const { currentCase, currentAnalysis } = get();
        if (!currentCase) return;
        
        const historyItem: CaseHistoryItem = {
          ...currentCase,
          analysis: currentAnalysis || undefined
        };
        
        set((state) => ({
          history: [historyItem, ...state.history].slice(0, 20)
        }));
      },
      
      deleteHistoryItem: (id) => set((state) => ({
        history: state.history.filter((item) => item.id !== id)
      })),
      
      clearHistory: () => set({ history: [] }),
      
      loadCaseFromHistory: (id) => {
        const item = get().history.find((h) => h.id === id);
        if (item) {
          set({
            currentCase: item,
            currentAnalysis: item.analysis || null,
            thinkingContent: item.analysis?.thinking || ''
          });
        }
      },

      saveUserAnswer: (answer) => {
        const { currentCase } = get();
        if (!currentCase) return;

        set((state) => ({
          history: state.history.map((item) =>
            item.id === currentCase.id
              ? { ...item, userAnswer: answer }
              : item
          )
        }));
      }
    }),
    {
      name: 'fakao-case-storage',
      partialize: (state) => ({ history: state.history })
    }
  )
);
