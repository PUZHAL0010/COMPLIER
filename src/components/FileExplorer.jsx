import React, { useState } from 'react';
import { Folder, Lock, FileCode, Code2, ChevronDown, ChevronRight, ShieldCheck } from 'lucide-react';

export function FileExplorer({ activeFile, setActiveFile }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="h-full flex flex-col bg-forge-panel border-r border-forge-border text-xs select-none overflow-hidden">
      {/* Explorer Header */}
      <div className="px-3 py-2 bg-forge-bg border-b border-forge-border flex items-center justify-between">
        <span className="font-bold text-forge-text tracking-wider uppercase font-mono text-[11px]">
          Explorer
        </span>
        <span className="text-[10px] text-forge-muted font-mono">3 Files</span>
      </div>

      {/* File Tree List */}
      <div className="flex-1 p-2 font-mono space-y-1 overflow-y-auto">
        {/* Project Directory Root */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1.5 text-forge-text font-bold cursor-pointer hover:text-white px-1 py-1 rounded"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <Folder className="w-4 h-4 text-forge-blue" />
          <span>📁 project</span>
        </div>

        {isExpanded && (
          <div className="pl-4 space-y-1">
            {/* Locked index.html System File */}
            <div
              onClick={() => setActiveFile('index.html')}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                activeFile === 'index.html'
                  ? 'bg-forge-active text-white border border-forge-border'
                  : 'text-forge-muted hover:text-forge-text hover:bg-forge-active/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileCode className="w-3.5 h-3.5 text-orange-400" />
                <span>index.html</span>
              </div>
              <span className="flex items-center space-x-1 text-[10px] text-forge-yellow bg-forge-yellow/10 px-1.5 py-0.5 rounded border border-forge-yellow/30 font-sans">
                <Lock className="w-2.5 h-2.5" />
                <span>System</span>
              </span>
            </div>

            {/* Editable App.jsx File */}
            <div
              onClick={() => setActiveFile('App.jsx')}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                activeFile === 'App.jsx'
                  ? 'bg-forge-active text-white border border-forge-blue/50'
                  : 'text-forge-muted hover:text-forge-text hover:bg-forge-active/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Code2 className="w-3.5 h-3.5 text-forge-blue" />
                <span className="font-bold text-forge-text">App.jsx</span>
              </div>
              <span className="text-[10px] text-forge-green bg-forge-green/10 px-1.5 py-0.5 rounded border border-forge-green/30 font-sans">
                React 18
              </span>
            </div>

            {/* Editable styles.css File */}
            <div
              onClick={() => setActiveFile('styles.css')}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                activeFile === 'styles.css'
                  ? 'bg-forge-active text-white border border-forge-purple/50'
                  : 'text-forge-muted hover:text-forge-text hover:bg-forge-active/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="font-bold text-forge-purple text-xs">#</span>
                <span>styles.css</span>
              </div>
              <span className="text-[10px] text-forge-green bg-forge-green/10 px-1.5 py-0.5 rounded border border-forge-green/30 font-sans">
                CSS3
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-forge-bg border-t border-forge-border text-[11px] text-forge-muted">
        <div className="flex items-center space-x-1.5 text-forge-green font-bold mb-1 font-sans">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Locked Sandbox</span>
        </div>
        <p className="leading-relaxed">
          <code className="text-forge-yellow">index.html</code> is controlled by CodeForge. Student edits are isolated to <code className="text-forge-blue">App.jsx</code> and <code className="text-forge-purple">styles.css</code>.
        </p>
      </div>
    </div>
  );
}
