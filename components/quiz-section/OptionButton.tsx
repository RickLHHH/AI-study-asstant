'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { QuestionOption } from '@/types';
import { cn } from '@/lib/utils';

interface OptionButtonProps {
  option: QuestionOption;
  selected: boolean;
  disabled: boolean;
  showResult: boolean;
  onClick: () => void;
}

export function OptionButton({ option, selected, disabled, showResult, onClick }: OptionButtonProps) {
  const isCorrect = option.isCorrect;
  const isWrong = showResult && selected && !isCorrect;
  const showCorrect = showResult && isCorrect;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full p-4 rounded-lg border-2 text-left transition-all",
        "flex items-start gap-3",
        // Default state
        !selected && !showResult && "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/30",
        // Selected state
        selected && !showResult && "border-blue-500 bg-blue-50",
        // Correct state
        showCorrect && "border-emerald-500 bg-emerald-50",
        // Wrong state
        isWrong && "border-red-500 bg-red-50",
        // Disabled state
        disabled && !showResult && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Option Key */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-medium text-sm",
        !selected && !showResult && "bg-slate-100 text-slate-700",
        selected && !showResult && "bg-blue-500 text-white",
        showCorrect && "bg-emerald-500 text-white",
        isWrong && "bg-red-500 text-white"
      )}>
        {showCorrect ? (
          <Check className="w-5 h-5" />
        ) : isWrong ? (
          <X className="w-5 h-5" />
        ) : (
          option.key
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm leading-relaxed",
          showCorrect && "text-emerald-900 font-medium",
          isWrong && "text-red-900"
        )}>
          {option.content}
        </p>
        
        {/* Why Wrong */}
        {isWrong && option.whyWrong && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs text-red-600 mt-2"
          >
            <span className="font-medium">错误原因：</span>
            {option.whyWrong}
          </motion.p>
        )}
      </div>
    </motion.button>
  );
}
