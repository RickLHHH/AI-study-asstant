'use client';

import { Brain } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ThinkingChainProps {
  content: string;
  isStreaming?: boolean;
}

export function ThinkingChain({ content, isStreaming = false }: ThinkingChainProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-4 h-auto hover:bg-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-slate-900">AI思维链</h3>
                <p className="text-xs text-slate-500">
                  {isStreaming ? '正在思考中...' : `共 ${content.length} 字推理过程`}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200"
          >
            <div className="p-4 bg-slate-50 border-l-4 border-blue-500">
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {content}
                {isStreaming && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-blue-500 ml-1"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
