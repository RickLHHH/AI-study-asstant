'use client';

import { History, Scale, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCaseStore } from '@/stores/useCaseStore';
import { format } from '@/lib/utils';
import { CaseHistoryItem } from '@/types';

export function Header() {
  const { history, loadCaseFromHistory, deleteHistoryItem, clearHistory } = useCaseStore();

  const handleLoadCase = (id: string) => {
    loadCaseFromHistory(id);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-50">
      <div className="h-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              AI法考案例分析助手
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              基于 DeepSeek-R1 智能法律分析
            </p>
          </div>
        </div>

        {/* History Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">历史记录</span>
              {history.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {history.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>历史记录</span>
                {history.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    清空
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>暂无历史记录</p>
                </div>
              ) : (
                history.map((item: CaseHistoryItem) => (
                  <div
                    key={item.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    onClick={() => handleLoadCase(item.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 line-clamp-2">
                          {item.content.slice(0, 100)}...
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <span>{format(item.createdAt)}</span>
                          {item.subjectArea && (
                            <span className="px-2 py-0.5 bg-slate-100 rounded">
                              {item.subjectArea}
                            </span>
                          )}
                          {item.analysis && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                              已分析
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistoryItem(item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
