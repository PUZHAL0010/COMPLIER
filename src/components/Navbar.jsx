import React from 'react';
import { 
  Play, 
  Wand2, 
  Sparkles, 
  Share2, 
  Download, 
  Sun, 
  Moon, 
  CheckCircle2, 
  RotateCw, 
  Hammer, 
  Code2,
  RotateCcw
} from 'lucide-react';

export function Navbar({
  theme,
  setTheme,
  onRun,
  onFormat,
  onClear,
  onOpenTemplates,
  onOpenShare,
  onDownload,
  autosaveStatus,
  isCompiling
}) {
  return (
    <header className="bg-forge-panel border-b border-forge-border text-forge-text px-4 py-2 flex items-center justify-between z-20 select-none">
      {/* Logo & App Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-forge-blue flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Hammer className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-base tracking-tight text-white">
                CodeForge
              </h1>
              <span className="text-[10px] font-mono font-bold bg-forge-bg border border-forge-border text-forge-blue px-2 py-0.5 rounded-full">
                React 18 & Babel
              </span>
            </div>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-forge-border hidden sm:block" />

        {/* Autosave Status Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-forge-muted">
          {autosaveStatus === 'saving' ? (
            <>
              <RotateCw className="w-3.5 h-3.5 text-forge-yellow animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-forge-green" />
              <span className="text-forge-text font-medium">Saved ✓</span>
            </>
          )}
        </div>
      </div>

      {/* Main IDE Controls */}
      <div className="flex items-center space-x-2">
        {/* Primary Run Code Button */}
        <button
          onClick={onRun}
          disabled={isCompiling}
          className="flex items-center space-x-2 bg-forge-green hover:bg-forge-greenHover text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          title="Compile and Run (Ctrl + Enter)"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isCompiling ? 'Running...' : 'Run Code'}</span>
        </button>

        {/* Format Code */}
        <button
          onClick={onFormat}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-forge-active hover:bg-forge-border border border-forge-border text-forge-text transition-all"
          title="Format Code with Prettier (Alt + Shift + F)"
        >
          <Wand2 className="w-3.5 h-3.5 text-forge-blue" />
          <span className="hidden sm:inline">Format</span>
        </button>

        {/* Presets / Templates */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-forge-active hover:bg-forge-border border border-forge-border text-forge-text transition-all"
          title="Choose Starter Preset"
        >
          <Sparkles className="w-3.5 h-3.5 text-forge-purple" />
          <span className="hidden sm:inline">Presets</span>
        </button>

        {/* Share Link */}
        <button
          onClick={onOpenShare}
          className="p-1.5 rounded-lg text-forge-muted hover:text-white hover:bg-forge-active border border-transparent hover:border-forge-border transition-all"
          title="Share Compressed Code URL"
        >
          <Share2 className="w-4 h-4 text-forge-blue" />
        </button>

        {/* Download HTML */}
        <button
          onClick={onDownload}
          className="p-1.5 rounded-lg text-forge-muted hover:text-white hover:bg-forge-active border border-transparent hover:border-forge-border transition-all"
          title="Download Code Bundle"
        >
          <Download className="w-4 h-4 text-forge-green" />
        </button>

        {/* Reset Code */}
        <button
          onClick={onClear}
          className="p-1.5 rounded-lg text-forge-muted hover:text-forge-red hover:bg-forge-active border border-transparent hover:border-forge-border transition-all"
          title="Reset Workspace Code"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 rounded-lg text-forge-muted hover:text-forge-yellow hover:bg-forge-active transition-all"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-forge-yellow" /> : <Moon className="w-4 h-4 text-forge-blue" />}
        </button>
      </div>
    </header>
  );
}
