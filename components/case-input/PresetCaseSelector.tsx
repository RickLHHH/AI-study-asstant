'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, X, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PRESET_CASES, PresetCase } from '@/lib/presetCases';
import { SubjectArea } from '@/types';

interface PresetCaseSelectorProps {
  onSelect: (presetCase: PresetCase) => void;
}

const subjectColors: Record<SubjectArea, string> = {
  [SubjectArea.CRIMINAL_LAW]: 'bg-red-50 text-red-700 border-red-200',
  [SubjectArea.CIVIL_LAW]: 'bg-blue-50 text-blue-700 border-blue-200',
  [SubjectArea.CRIMINAL_PROCEDURE]: 'bg-orange-50 text-orange-700 border-orange-200',
  [SubjectArea.CIVIL_PROCEDURE]: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  [SubjectArea.ADMINISTRATIVE_LAW]: 'bg-green-50 text-green-700 border-green-200',
  [SubjectArea.COMMERCIAL_LAW]: 'bg-purple-50 text-purple-700 border-purple-200',
  [SubjectArea.THEORETICAL_LAW]: 'bg-slate-50 text-slate-700 border-slate-200',
  [SubjectArea.INTERNATIONAL_LAW]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const difficultyLabels = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

const difficultyColors = {
  easy: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-red-50 text-red-700',
};

export function PresetCaseSelector({ onSelect }: PresetCaseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (presetCase: PresetCase) => {
    setSelectedId(presetCase.id);
    onSelect(presetCase);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Trigger Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="outline"
          className="w-full gap-2 border-dashed border-amber-400 text-amber-700 hover:bg-amber-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Sparkles className="w-4 h-4" />
          {isOpen ? '关闭预设案例' : '选择预设案例'}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </motion.div>

      {/* Preset Cases Grid */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="border-amber-200 bg-amber-50/20">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    选择预设案例快速开始
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {PRESET_CASES.map((presetCase, index) => (
                    <motion.button
                      key={presetCase.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelect(presetCase)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedId === presetCase.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-800 text-sm truncate">
                              {presetCase.title}
                            </span>
                            {selectedId === presetCase.id && (
                              <Check className="w-4 h-4 text-amber-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                            {presetCase.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${subjectColors[presetCase.subject]}`}
                            >
                              {presetCase.subject}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${difficultyColors[presetCase.difficulty]}`}
                            >
                              {difficultyLabels[presetCase.difficulty]}
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {presetCase.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
