'use client';

import { useState, useEffect, useCallback } from 'react';
import { Send, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubjectSelector } from './SubjectSelector';
import { PresetCaseSelector } from './PresetCaseSelector';
import { SubjectArea, CaseInput } from '@/types';
import { useCaseStore } from '@/stores/useCaseStore';
import { PresetCase } from '@/lib/presetCases';
import { motion } from 'framer-motion';

interface CaseInputPanelProps {
  onSubmit: (data: CaseInput) => void;
  loading: boolean;
}

// Safe UUID generation that works in all environments
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function CaseInputPanel({ onSubmit, loading }: CaseInputPanelProps) {
  const [content, setContent] = useState('');
  const [subjectArea, setSubjectArea] = useState<SubjectArea | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { currentCase, _hasHydrated } = useCaseStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Restore content from currentCase after hydration
  useEffect(() => {
    if (isMounted && _hasHydrated && currentCase) {
      setContent(currentCase.content);
      setSubjectArea(currentCase.subjectArea);
    }
  }, [isMounted, _hasHydrated, currentCase]);

  const handleSubmit = useCallback(() => {
    if (content.length < 20) {
      setError('案例内容至少需要20字');
      return;
    }
    if (content.length > 2000) {
      setError('案例内容不能超过2000字');
      return;
    }

    setError(null);
    const caseData: CaseInput = {
      id: generateId(),
      content: content.trim(),
      subjectArea,
      createdAt: Date.now(),
      status: 'pending',
    };
    onSubmit(caseData);
  }, [content, subjectArea, onSubmit]);

  const handleSelectPreset = useCallback((presetCase: PresetCase) => {
    setContent(presetCase.content);
    setSubjectArea(presetCase.subject);
    setError(null);
  }, []);

  const charCount = content.length;
  const isValid = charCount >= 20 && charCount <= 2000;

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            案例输入
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[200px] bg-slate-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-blue-600" />
          案例输入
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset Case Selector */}
        <PresetCaseSelector onSelect={handleSelectPreset} />

        {/* Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            案例内容
          </label>
          <Textarea
            placeholder="请粘贴或输入法律案例内容..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            className="min-h-[200px] resize-none"
            disabled={loading}
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs ${error ? 'text-red-500' : 'text-slate-500'}`}>
              {error || '最少20字，最多2000字'}
            </span>
            <span className={`text-xs ${isValid ? 'text-green-600' : 'text-slate-500'}`}>
              {charCount}/2000
            </span>
          </div>
        </div>

        {/* Subject Selector */}
        <SubjectSelector value={subjectArea} onChange={setSubjectArea} />

        {/* Submit Button */}
        <Button
          className="w-full gap-2"
          size="lg"
          onClick={handleSubmit}
          disabled={loading || !isValid}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              AI分析中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              开始分析
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
