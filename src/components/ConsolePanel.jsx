import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Search, AlertCircle, AlertTriangle, ChevronRight, CornerDownLeft } from 'lucide-react';
import { analyzeError } from '../utils/errorParser';

export function ConsolePanel({
  logs = [],
  stageLogs = [],
  onClearLogs,
  userCode = {}
}) {
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputCommand, setInputCommand] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const counts = {
    all: logs.length,
    log: logs.filter(l => l.level === 'log').length,
    warn: logs.filter(l => l.level === 'warn').length,
    error: logs.filter(l => l.level === 'error' || l.type === 'RUNTIME_ERROR').length,
  };

  const filteredLogs = logs.filter(log => {
    if (filterLevel === 'log' && log.level !== 'log') return false;
    if (filterLevel === 'warn' && log.level !== 'warn') return false;
    if (filterLevel === 'error' && (log.level !== 'error' && log.type !== 'RUNTIME_ERROR')) return false;

    if (searchTerm.trim()) {
      const text = JSON.stringify(log).toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;

    try {
      const evalWindow = document.querySelector('iframe[title="sandboxed-preview"]')?.contentWindow;
      if (evalWindow) {
        const result = evalWindow.eval(inputCommand);
        console.log(`$ ${inputCommand}`, result);
      }
    } catch (err) {
      console.error(`$ ${inputCommand}`, err.message);
    }
    setInputCommand('');
  };

  return (
    <div className="h-full flex flex-col bg-[#0D0D0D] border-t border-[#282828] font-mono text-xs overflow-hidden select-none">
      {/* Console Header Accordion Bar matching reference screenshot: Console ▲ */}
      <div className="px-3 py-2 bg-[#121212] border-b border-[#282828] flex items-center justify-between flex-wrap gap-2 z-10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1.5 text-white font-bold font-sans hover:text-sky-400 transition-colors"
        >
          <span className="text-xs">Console</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* Level Filter Pills & Search */}
        {isExpanded && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-[#0D0D0D] border border-[#282828] rounded p-0.5">
              <button
                onClick={() => setFilterLevel('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  filterLevel === 'all' ? 'bg-[#222222] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All ({counts.all})
              </button>
              <button
                onClick={() => setFilterLevel('log')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  filterLevel === 'log' ? 'bg-[#222222] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Logs ({counts.log})
              </button>
              <button
                onClick={() => setFilterLevel('warn')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  filterLevel === 'warn' ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-400 hover:text-amber-400'
                }`}
              >
                Warnings ({counts.warn})
              </button>
              <button
                onClick={() => setFilterLevel('error')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  filterLevel === 'error' ? 'bg-red-500/20 text-red-400' : 'text-neutral-400 hover:text-red-400'
                }`}
              >
                Errors ({counts.error})
              </button>
            </div>

            <div className="relative">
              <Search className="w-3 h-3 text-neutral-400 absolute left-2 top-2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0D0D0D] border border-[#282828] rounded pl-6 pr-2 py-1 text-[11px] text-white focus:outline-none focus:border-sky-500 w-28 sm:w-36"
              />
            </div>

            <button
              onClick={onClearLogs}
              className="p-1 rounded text-neutral-400 hover:text-red-400 hover:bg-[#1A1A1A] transition-colors"
              title="Clear Console Output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Terminal Log Output List */}
      {isExpanded && (
        <>
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1 font-mono select-text bg-[#0D0D0D]">
            {/* Stage Logs */}
            {stageLogs.map((s, idx) => (
              <div key={`stage-${idx}`} className="text-green-400 flex items-center space-x-1.5 text-[11px]">
                <ChevronRight className="w-3 h-3 text-neutral-500 shrink-0" />
                <span>{s.message}</span>
              </div>
            ))}

            {filteredLogs.length === 0 && stageLogs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-neutral-500 text-[11px] py-4 font-sans">
                Console clean. Click ▶ Run Code to compile App.jsx.
              </div>
            ) : (
              filteredLogs.map((log, index) => {
                const isError = log.type === 'RUNTIME_ERROR' || log.level === 'error';
                const isWarn = log.level === 'warn';

                let diagnostic = null;
                if (isError) {
                  const errorText = log.payload?.message || (Array.isArray(log.payload?.args) ? log.payload.args.join(' ') : String(log.payload));
                  diagnostic = analyzeError(errorText, log.payload?.stack, userCode);
                }

                return (
                  <div
                    key={index}
                    className={`p-2 rounded border transition-all ${
                      isError
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : isWarn
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-[#141414] border-[#282828] text-neutral-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-neutral-500 text-[10px] shrink-0 mt-0.5">[{log.timestamp}]</span>
                      <div className="flex-1 min-w-0">
                        {log.type === 'RUNTIME_ERROR' ? (
                          <div>
                            <p className="font-bold text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{log.payload.message}</span>
                            </p>
                            {log.payload.line && (
                              <p className="text-[10px] text-neutral-400 mt-0.5">
                                Line: {log.payload.line} | Column: {log.payload.col}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="whitespace-pre-wrap break-words">
                            {Array.isArray(log.payload?.args)
                              ? log.payload.args.join(' ')
                              : String(log.payload)}
                          </span>
                        )}

                        {diagnostic && (
                          <div className="mt-2 p-2 rounded bg-[#0D0D0D] border border-amber-500/30 text-neutral-300 font-sans">
                            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-[11px] mb-0.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Fix Suggestion ({diagnostic.title})</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 mb-1">{diagnostic.explanation}</p>
                            <p className="text-[11px] text-green-400 font-medium">
                              👉 {diagnostic.suggestion}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Terminal Input Prompt */}
          <form onSubmit={handleCommandSubmit} className="bg-[#121212] border-t border-[#282828] px-3 py-1 flex items-center space-x-2">
            <span className="text-green-400 font-bold">$</span>
            <input
              type="text"
              placeholder="Type JavaScript to evaluate live..."
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              className="flex-1 bg-transparent border-none text-white focus:outline-none text-xs font-mono"
            />
            <button type="submit" className="text-neutral-400 hover:text-green-400 transition-colors">
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
