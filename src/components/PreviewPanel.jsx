import React, { useState } from 'react';
import { Eye, RefreshCw, Monitor, Tablet, Smartphone, Maximize2, ShieldCheck, Lock } from 'lucide-react';

export function PreviewPanel({ compiledDoc, onRefresh, isCompiling }) {
  const [viewport, setViewport] = useState('full'); // 'full', 'tablet', 'mobile'
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile': return 'max-w-[375px] border-x border-forge-border shadow-2xl';
      case 'tablet': return 'max-w-[768px] border-x border-forge-border shadow-2xl';
      default: return 'w-full';
    }
  };

  return (
    <div className={`h-full flex flex-col bg-forge-panel overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-forge-bg' : ''}`}>
      {/* Preview Header Bar */}
      <div className="px-3 py-1.5 bg-forge-bg border-b border-forge-border flex items-center justify-between z-10 select-none">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-forge-blue" />
          <span className="text-xs font-semibold text-white font-mono">Browser Preview</span>

          {/* Sandbox Security Badge */}
          <div className="hidden sm:flex items-center space-x-1 text-[10px] text-forge-green bg-forge-green/10 border border-forge-green/30 px-2 py-0.5 rounded font-mono">
            <ShieldCheck className="w-3 h-3" />
            <span>Sandboxed React 18</span>
          </div>
        </div>

        {/* Viewport & Controls */}
        <div className="flex items-center space-x-2">
          {/* Viewport Switcher */}
          <div className="flex items-center bg-forge-panel border border-forge-border rounded p-0.5">
            <button
              onClick={() => setViewport('full')}
              className={`p-1 rounded text-forge-muted hover:text-white transition-colors ${viewport === 'full' ? 'bg-forge-blue text-white' : ''}`}
              title="Desktop (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1 rounded text-forge-muted hover:text-white transition-colors ${viewport === 'tablet' ? 'bg-forge-blue text-white' : ''}`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1 rounded text-forge-muted hover:text-white transition-colors ${viewport === 'mobile' ? 'bg-forge-blue text-white' : ''}`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Refresh Frame */}
          <button
            onClick={onRefresh}
            className="p-1 rounded text-forge-muted hover:text-white hover:bg-forge-bg transition-colors"
            title="Reload Sandboxed Frame"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin text-forge-blue' : ''}`} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded text-forge-muted hover:text-white hover:bg-forge-bg transition-colors"
            title="Toggle Fullscreen Preview"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-white relative flex justify-center overflow-hidden">
        <iframe
          key={compiledDoc ? compiledDoc.length : 0}
          title="sandboxed-preview"
          srcDoc={compiledDoc}
          sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
          className={`h-full w-full bg-white transition-all duration-300 ${getViewportWidth()}`}
        />
      </div>
    </div>
  );
}
