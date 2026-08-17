import React from 'react';
import { RefreshCw, Moon, Sun, Maximize2, Share2, Play, RotateCcw, Wand2, Layers } from 'lucide-react';

export function Navbar({
  theme,
  setTheme,
  onRun,
  onFormat,
  onClear,
  onOpenTemplates,
  onOpenShare,
  onDownload,
  isCompiling = false,
}) {
  return (
    <header className="h-11 bg-[#0D0D0D] border-b border-[#282828] px-3 flex items-center justify-between select-none z-30 font-sans">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-sky-500 to-blue-400 flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
            CF
          </div>
          <span className="font-bold text-white tracking-wide text-xs font-mono">
            Code<span className="text-sky-400">Forge</span>
          </span>
        </div>
      </div>

      {/* Center Action: Run & Format */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onRun}
          disabled={isCompiling}
          className="px-3.5 py-1 rounded font-semibold text-xs text-white bg-sky-500 hover:bg-sky-600 transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-50 shadow-sm"
        >
          <Play className={`w-3 h-3 ${isCompiling ? 'animate-spin' : 'fill-current'}`} />
          <span>{isCompiling ? 'Running...' : 'Run'}</span>
        </button>

        <button
          onClick={onFormat}
          className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#1C1C1C] transition-colors"
          title="Format Code (Alt + Shift + F)"
        >
          <Wand2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onClear}
          className="p-1 rounded text-neutral-400 hover:text-red-400 hover:bg-[#1C1C1C] transition-colors"
          title="Reset Workspace"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpenTemplates}
          className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#2A2A2A] text-neutral-300 hover:text-white text-[11px] font-mono flex items-center space-x-1"
        >
          <Layers className="w-3 h-3 text-sky-400" />
          <span>Presets</span>
        </button>
      </div>

      {/* Right Header Actions matching reference screenshot */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onRun}
          className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#1C1C1C] transition-colors"
          title="Reload Preview"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#1C1C1C] transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-yellow-400" />}
        </button>

        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#1C1C1C] transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Share Pill Button matching reference screenshot */}
        <button
          onClick={onOpenShare}
          className="px-3 py-1 rounded-full bg-[#242424] hover:bg-[#303030] text-white border border-[#3A3A3A] text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
        >
          <Share2 className="w-3 h-3 text-neutral-300" />
          <span>Share</span>
        </button>
      </div>
    </header>
  );
}
