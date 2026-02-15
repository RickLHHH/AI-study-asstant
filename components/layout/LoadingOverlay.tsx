'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Scale } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading, message = '正在分析案例...' }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="text-center"
          >
            <div className="relative w-20 h-20 mx-auto mb-4">
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 border-4 border-blue-200 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full" />
              </motion.div>
              
              {/* Inner ring */}
              <motion.div
                className="absolute inset-3 border-4 border-amber-200 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full" />
              </motion.div>
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Scale className="w-8 h-8 text-blue-900" />
              </div>
            </div>
            
            <p className="text-lg font-medium text-slate-700">{message}</p>
            <p className="text-sm text-slate-500 mt-2">AI正在深度思考法律逻辑...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
