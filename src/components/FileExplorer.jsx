import React, { useState } from 'react';
import { Folder, FileCode, Code2, Lock, FileText, Plus, Trash2 } from 'lucide-react';

export function FileExplorer({
  activeFile,
  setActiveFile,
  userFiles = [],
  onAddFile,
  onDeleteFile
}) {
  const [showInput, setShowInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const handleCreateFile = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onAddFile(newFileName.trim());
    setNewFileName('');
    setShowInput(false);
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.html')) return <FileCode className="w-3.5 h-3.5 text-neutral-400" />;
    if (fileName.endsWith('.css')) return <span className="text-neutral-400 font-mono text-xs">#</span>;
    if (fileName.endsWith('.json')) return <FileText className="w-3.5 h-3.5 text-neutral-400" />;
    return <Code2 className="w-3.5 h-3.5 text-neutral-400" />;
  };

  return (
    <div className="h-full flex flex-col bg-[#0D0D0D] border-r border-[#282828] text-[#E1E1E1] font-sans text-xs select-none overflow-hidden">
      {/* Header Bar matching reference screenshot */}
      <div className="px-3 py-2 border-b border-[#282828] font-medium text-neutral-300 flex items-center justify-between text-xs">
        <span className="font-semibold text-white">Files</span>

        <div className="flex items-center space-x-1.5">
          {/* Add New File Icon + */}
          <button
            onClick={() => setShowInput(!showInput)}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#1A1A1A] transition-colors"
            title="New File (+)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Delete Active File Trash Icon 🗑 */}
          {userFiles.some((f) => f.name === activeFile) && onDeleteFile && (
            <button
              onClick={() => onDeleteFile(activeFile)}
              className="p-1 rounded text-neutral-400 hover:text-red-400 hover:bg-[#1A1A1A] transition-colors"
              title="Delete Active File"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* New File Inline Prompt Input */}
      {showInput && (
        <form onSubmit={handleCreateFile} className="p-2 border-b border-[#282828] bg-[#141414]">
          <input
            type="text"
            placeholder="filename (e.g. Card.js, styles.css)"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#282828] rounded px-2 py-1 text-white text-xs font-mono focus:outline-none focus:border-sky-500"
            autoFocus
          />
        </form>
      )}

      {/* Tree File List matching reference screenshot */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs">
        {/* public Folder */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-neutral-400 text-xs font-medium py-1">
            <Folder className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-300 font-sans">public</span>
          </div>

          {/* public/index.html (Locked) */}
          <button
            onClick={() => setActiveFile('index.html')}
            className={`w-full flex items-center justify-between pl-6 pr-2 py-1.5 rounded transition-all ${
              activeFile === 'index.html' ? 'bg-[#222222] text-white font-medium' : 'text-neutral-400 hover:text-white hover:bg-[#181818]'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="font-semibold text-white">index.html</span>
            </div>
          </button>
        </div>

        {/* App.jsx */}
        <button
          onClick={() => setActiveFile('App.jsx')}
          className={`w-full flex items-center space-x-2 pl-2 pr-2 py-1.5 rounded transition-all ${
            activeFile === 'App.jsx' ? 'bg-[#222222] text-white font-medium' : 'text-neutral-400 hover:text-white hover:bg-[#181818]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-neutral-400" />
          <span>App.jsx</span>
        </button>

        {/* index.js */}
        <button
          onClick={() => setActiveFile('index.js')}
          className={`w-full flex items-center space-x-2 pl-2 pr-2 py-1.5 rounded transition-all ${
            activeFile === 'index.js' ? 'bg-[#222222] text-white font-medium' : 'text-neutral-400 hover:text-white hover:bg-[#181818]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-neutral-400" />
          <span>index.js</span>
        </button>

        {/* package.json */}
        <button
          onClick={() => setActiveFile('package.json')}
          className={`w-full flex items-center space-x-2 pl-2 pr-2 py-1.5 rounded transition-all ${
            activeFile === 'package.json' ? 'bg-[#222222] text-white font-medium' : 'text-neutral-400 hover:text-white hover:bg-[#181818]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-neutral-400" />
          <span>package.json</span>
        </button>

        {/* styles.css */}
        <button
          onClick={() => setActiveFile('styles.css')}
          className={`w-full flex items-center space-x-2 pl-2 pr-2 py-1.5 rounded transition-all ${
            activeFile === 'styles.css' ? 'bg-[#222222] text-white font-medium' : 'text-neutral-400 hover:text-white hover:bg-[#181818]'
          }`}
        >
          <span className="text-neutral-400 font-bold text-xs">#</span>
          <span>styles.css</span>
        </button>

        {/* Custom User Created Files */}
        {userFiles.map((file) => (
          <button
            key={file.name}
            onClick={() => setActiveFile(file.name)}
            className={`w-full flex items-center space-x-2 pl-2 pr-2 py-1.5 rounded transition-all ${
              activeFile === file.name ? 'bg-[#222222] text-white font-medium' : 'text-neutral-400 hover:text-white hover:bg-[#181818]'
            }`}
          >
            {getFileIcon(file.name)}
            <span className="truncate">{file.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
