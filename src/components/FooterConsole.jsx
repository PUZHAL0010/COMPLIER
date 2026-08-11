import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Settings, 
  Sun, 
  Moon, 
  FileText, 
  Code,
  Terminal,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { analyzeError } from '../utils/errorParser';

export function FooterConsole({
  logs = [],
  onClearLogs,
  theme,
  setTheme,
  language,
  userCode = {}
}) {
  const [isOpen, setIsOpen] = useState(false);

  const errorCount = logs.filter(l => l.level === 'error' || l.type === 'RUNTIME_ERROR').length;
  const totalCount = logs.length;

  return (
    <footer className="bg-slate-100 dark:bg-compile-bgDark border-t border-slate-200 dark:border-compile-borderDark text-slate-600 dark:text-compile-muted font-mono text-xs select-none z-20">
      {/* Collapsible Console Tray Drawer */}
      {isOpen && (
        <div className="h-56 bg-slate-900 text-slate-200 border-b border-slate-800 p-3 overflow-y-auto font-mono text-xs select-text">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
            <div className="flex items-center space-x-2 font-sans font-bold text-white">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Console Output Logs ({totalCount})</span>
            </div>
            <button
              onClick={onClearLogs}
              className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear Console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-slate-500 text-[11px]">
              No console logs recorded.
            </div>
          ) : (
            <div className="space-y-1.5">
              {logs.map((log, idx) => {
                const isError = log.type === 'RUNTIME_ERROR' || log.level === 'error';
                let diagnostic = null;
                if (isError) {
                  const errorText = log.payload?.message || (Array.isArray(log.payload?.args) ? log.payload.args.join(' ') : String(log.payload));
                  diagnostic = analyzeError(errorText, log.payload?.stack, userCode);
                }

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded border ${
                      isError
                        ? 'bg-rose-950/30 border-rose-900/50 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">[{log.timestamp}]</span>
                      <div className="flex-1 min-w-0">
                        {log.type === 'RUNTIME_ERROR' ? (
                          <div className="font-bold text-rose-400">{log.payload.message}</div>
                        ) : (
                          <div className="whitespace-pre-wrap break-words">
                            {Array.isArray(log.payload?.args)
                              ? log.payload.args.join(' ')
                              : String(log.payload)}
                          </div>
                        )}

                        {diagnostic && (
                          <div className="mt-2 p-2 rounded bg-slate-900 border border-amber-500/30 text-slate-300 font-sans">
                            <div className="flex items-center space-x-1 text-amber-400 font-bold text-[11px] mb-0.5">
                              <Lightbulb className="w-3 h-3" />
                              <span>Fix Suggestion ({diagnostic.title})</span>
                            </div>
                            <p className="text-[11px]">{diagnostic.suggestion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Status Bar (Matches Screenshot Pixel-For-Pixel) */}
      <div className="px-3 py-1 flex items-center justify-between">
        {/* Far Left: Ready Status */}
        <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 font-sans text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Ready</span>
        </div>

        {/* Center-Right: Collapsible Console Trigger */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            <span className="font-sans font-medium text-xs">Console</span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded-full">
              ({totalCount})
            </span>
          </button>
        </div>

        {/* Far Right: Tools & Theme Indicators (Matches Screenshot) */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Clear Console Trash Icon */}
          <button
            onClick={onClearLogs}
            className="hover:text-red-500 transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Settings Icon */}
          <button className="hover:text-slate-900 dark:hover:text-white transition-colors">
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Theme Indicator */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>{theme === 'dark' ? 'Dark ⇄' : 'Light ⇄'}</span>
          </button>

          {/* Wiki Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Wiki</span>
          </a>

          {/* Language Mode Badge */}
          <div className="flex items-center space-x-1 font-bold text-blue-600 dark:text-blue-400">
            <Code className="w-3.5 h-3.5" />
            <span className="uppercase">{language}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
