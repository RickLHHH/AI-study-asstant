'use client';

import { useState } from 'react';
import { Send, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubjectSelector } from './SubjectSelector';
import { SubjectArea, CaseInput } from '@/types';
import { useCaseStore } from '@/stores/useCaseStore';
import { motion } from 'framer-motion';

const PRESET_CASE = `案例：李某盗窃案

李某深夜潜入王某家中，窃得现金5000元及手机一部。在准备离开时，被回家的王某发现。王某上前阻拦并呼喊抓贼。李某为抗拒抓捕，随手拿起桌上的水果刀威胁王某："别过来，否则捅死你！"随后逃离现场。

经鉴定，被盗物品总价值6500元。李某于次日被公安机关抓获。

问题：李某的行为应当如何定性？`;

interface CaseInputPanelProps {
  onSubmit: (data: CaseInput) => void;
  loading: boolean;
}

export function CaseInputPanel({ onSubmit, loading }: CaseInputPanelProps) {
  const [content, setContent] = useState('');
  const [subjectArea, setSubjectArea] = useState<SubjectArea | undefined>();
  const [error, setError] = useState<string | null>(null);
  const { currentCase } = useCaseStore();

  // 如果历史记录中有当前案例，恢复其内容
  useState(() => {
    if (currentCase) {
      setContent(currentCase.content);
      setSubjectArea(currentCase.subjectArea);
    }
  });

  const handleSubmit = () => {
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
      id: crypto.randomUUID(),
      content: content.trim(),
      subjectArea,
      createdAt: Date.now(),
      status: 'pending',
    };
    onSubmit(caseData);
  };

  const handleUsePreset = () => {
    setContent(PRESET_CASE);
    setSubjectArea(SubjectArea.CRIMINAL_LAW);
    setError(null);
  };

  const charCount = content.length;
  const isValid = charCount >= 20 && charCount <= 2000;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-blue-600" />
          案例输入
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="outline"
            className="w-full gap-2 border-dashed border-amber-400 text-amber-700 hover:bg-amber-50"
            onClick={handleUsePreset}
          >
            <Sparkles className="w-4 h-4" />
            使用预设案例（刑法-财产犯罪）
          </Button>
        </motion.div>

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
