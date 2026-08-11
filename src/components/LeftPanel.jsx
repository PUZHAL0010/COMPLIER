import React, { useState } from 'react';
import { 
  FileText, 
  Folder, 
  Lock, 
  FileCode, 
  Code2, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export function LeftPanel({
  activeFile,
  setActiveFile,
  assessmentMode
}) {
  const [activeLeftTab, setActiveLeftTab] = useState('problem'); // 'problem' or 'files'
  const [isFolderExpanded, setIsFolderExpanded] = useState(true);

  return (
    <div className="h-full flex flex-col bg-forge-panel border-r border-forge-border text-xs overflow-hidden select-none">
      {/* Left Panel Tabs Header */}
      <div className="bg-forge-bg border-b border-forge-border flex items-center px-2 pt-1">
        <button
          onClick={() => setActiveLeftTab('problem')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 font-semibold rounded-t-md border-t-2 transition-all ${
            activeLeftTab === 'problem'
              ? 'bg-forge-panel text-white border-forge-blue shadow-sm'
              : 'text-forge-muted hover:text-forge-text border-transparent'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-forge-blue" />
          <span>Problem Description</span>
        </button>

        <button
          onClick={() => setActiveLeftTab('files')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 font-semibold rounded-t-md border-t-2 transition-all ${
            activeLeftTab === 'files'
              ? 'bg-forge-panel text-white border-forge-purple shadow-sm'
              : 'text-forge-muted hover:text-forge-text border-transparent'
          }`}
        >
          <Folder className="w-3.5 h-3.5 text-forge-purple" />
          <span>Files Explorer</span>
        </button>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans select-text">
        {activeLeftTab === 'problem' ? (
          /* Problem Description View */
          <div className="space-y-4 text-forge-text">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-forge-blue/10 border border-forge-blue/30 text-forge-blue px-2 py-0.5 rounded">
                College React Assessment
              </span>
              <h2 className="text-base font-bold text-white mt-2">
                1. Counter Component Implementation
              </h2>
              <p className="text-xs text-forge-muted mt-1 leading-relaxed">
                Build an interactive React Counter component inside <code className="text-forge-yellow font-mono px-1 bg-forge-bg rounded">App.jsx</code>.
              </p>
            </div>

            <hr className="border-forge-border" />

            {/* Assessment Specifications */}
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Requirements</h3>
              <ul className="space-y-2 text-xs text-forge-text">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-forge-green shrink-0 mt-0.5" />
                  <span>
                    Initialize count state to <code className="text-forge-blue font-mono">0</code> using <code className="text-forge-yellow font-mono">React.useState(0)</code>.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-forge-green shrink-0 mt-0.5" />
                  <span>
                    Provide an increment button <code className="text-forge-blue font-mono">+</code> that increases count by 1.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-forge-green shrink-0 mt-0.5" />
                  <span>
                    Provide a decrement button <code className="text-forge-blue font-mono">-</code> that decreases count by 1.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-forge-green shrink-0 mt-0.5" />
                  <span>
                    Ensure component is exported as <code className="text-forge-purple font-mono">export default App;</code>.
                  </span>
                </li>
              </ul>
            </div>

            <hr className="border-forge-border" />

            {/* Locked System HTML Note */}
            <div className="p-3 bg-forge-bg border border-forge-border rounded-lg text-xs">
              <div className="flex items-center space-x-1.5 text-forge-yellow font-bold mb-1 font-mono">
                <Lock className="w-3.5 h-3.5" />
                <span>System Controlled Runtime</span>
              </div>
              <p className="text-[11px] text-forge-muted leading-relaxed">
                The HTML template (<code className="text-forge-text">index.html</code>) is locked by CodeForge and includes React 18, ReactDOM 18, and Babel Standalone. Do not modify system files.
              </p>
            </div>
          </div>
        ) : (
          /* File Explorer Tree View */
          <div className="space-y-2 select-none font-mono">
            <div 
              onClick={() => setIsFolderExpanded(!isFolderExpanded)}
              className="flex items-center space-x-1 text-forge-text font-bold cursor-pointer hover:text-white"
            >
              {isFolderExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <Folder className="w-4 h-4 text-forge-blue" />
              <span>📁 project</span>
            </div>

            {isFolderExpanded && (
              <div className="pl-5 space-y-1">
                {/* Locked index.html File */}
                <div
                  onClick={() => setActiveFile('index.html')}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                    activeFile === 'index.html'
                      ? 'bg-forge-bg text-white border border-forge-border'
                      : 'text-forge-muted hover:text-forge-text hover:bg-forge-bg/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileCode className="w-3.5 h-3.5 text-orange-400" />
                    <span>index.html</span>
                  </div>
                  <span className="flex items-center space-x-1 text-[10px] text-forge-yellow bg-forge-yellow/10 px-1.5 py-0.5 rounded border border-forge-yellow/30 font-sans">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Locked</span>
                  </span>
                </div>

                {/* Student App.jsx File */}
                <div
                  onClick={() => setActiveFile('App.jsx')}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                    activeFile === 'App.jsx'
                      ? 'bg-forge-bg text-white border border-forge-blue/50'
                      : 'text-forge-muted hover:text-forge-text hover:bg-forge-bg/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-3.5 h-3.5 text-forge-blue" />
                    <span className="font-bold text-forge-text">App.jsx</span>
                  </div>
                  <span className="text-[10px] text-forge-green bg-forge-green/10 px-1.5 py-0.5 rounded border border-forge-green/30 font-sans">
                    Editable
                  </span>
                </div>

                {/* Student styles.css File */}
                <div
                  onClick={() => setActiveFile('styles.css')}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                    activeFile === 'styles.css'
                      ? 'bg-forge-bg text-white border border-forge-purple/50'
                      : 'text-forge-muted hover:text-forge-text hover:bg-forge-bg/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-forge-purple text-xs">#</span>
                    <span>styles.css</span>
                  </div>
                  <span className="text-[10px] text-forge-green bg-forge-green/10 px-1.5 py-0.5 rounded border border-forge-green/30 font-sans">
                    Editable
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
