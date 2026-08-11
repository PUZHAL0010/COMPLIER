import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Lock, FileCode, Code2, Copy, Check, Wand2 } from 'lucide-react';
import { LOCKED_INDEX_HTML } from '../utils/compilerEngine';

export function EditorPanel({
  activeFile,
  setActiveFile,
  appJsx,
  setAppJsx,
  stylesCss,
  setStylesCss,
  onFormat
}) {
  const [copied, setCopied] = useState(false);

  const isReadOnly = activeFile === 'index.html';

  const getCurrentCode = () => {
    if (activeFile === 'index.html') return LOCKED_INDEX_HTML;
    if (activeFile === 'styles.css') return stylesCss;
    return appJsx;
  };

  const setCurrentCode = (val) => {
    if (isReadOnly) return;
    if (activeFile === 'styles.css') setStylesCss(val);
    else setAppJsx(val);
  };

  const getMonacoLanguage = () => {
    if (activeFile === 'index.html') return 'html';
    if (activeFile === 'styles.css') return 'css';
    return 'javascript'; // React JSX
  };

  const handleEditorDidMount = (editor, monaco) => {
    try {
      if (monaco?.languages?.typescript) {
        const options = {
          jsx: monaco.languages.typescript.JsxEmit.React,
          jsxFactory: 'React.createElement',
          reactNamespace: 'React',
          allowJs: true,
          target: monaco.languages.typescript.ScriptTarget.ES2020,
        };
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions(options);
      }
    } catch (err) {}
  };

  const editorOptions = {
    readOnly: isReadOnly,
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    fontLigatures: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    lineNumbers: 'on',
    renderLineHighlight: 'all',
    bracketPairColorization: { enabled: true },
    cursorBlinking: 'smooth',
    padding: { top: 10, bottom: 10 },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = getCurrentCode().split('\n').length;

  return (
    <div className="h-full flex flex-col bg-forge-editor border-r border-forge-border overflow-hidden select-none">
      {/* File Explorer Tab Bar */}
      <div className="bg-forge-bg border-b border-forge-border flex items-center justify-between px-2 pt-1">
        <div className="flex items-center space-x-1">
          {/* index.html Tab */}
          <button
            onClick={() => setActiveFile('index.html')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-t-md border-t-2 transition-all ${
              activeFile === 'index.html'
                ? 'bg-forge-editor text-white border-orange-500 shadow-sm'
                : 'text-forge-muted hover:text-forge-text border-transparent'
            }`}
          >
            <Lock className="w-3 h-3 text-forge-yellow" />
            <FileCode className="w-3.5 h-3.5 text-orange-400" />
            <span>index.html</span>
          </button>

          {/* App.jsx Tab */}
          <button
            onClick={() => setActiveFile('App.jsx')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-t-md border-t-2 transition-all ${
              activeFile === 'App.jsx'
                ? 'bg-forge-editor text-white border-forge-blue shadow-sm'
                : 'text-forge-muted hover:text-forge-text border-transparent'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-forge-blue" />
            <span className="font-bold">App.jsx</span>
          </button>

          {/* styles.css Tab */}
          <button
            onClick={() => setActiveFile('styles.css')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-t-md border-t-2 transition-all ${
              activeFile === 'styles.css'
                ? 'bg-forge-editor text-white border-forge-purple shadow-sm'
                : 'text-forge-muted hover:text-forge-text border-transparent'
            }`}
          >
            <span className="font-bold text-forge-purple text-xs">#</span>
            <span>styles.css</span>
          </button>
        </div>

        {/* Action Controls & Line Metrics */}
        <div className="flex items-center space-x-3 text-xs text-forge-muted font-mono pr-2">
          <span>{lineCount} lines</span>
          {!isReadOnly && (
            <button
              onClick={onFormat}
              className="p-1 hover:text-forge-blue transition-colors"
              title="Format Active Code (Alt + Shift + F)"
            >
              <Wand2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1 hover:text-white transition-colors"
            title="Copy Active Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-forge-green" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Locked System File Notice Banner */}
      {isReadOnly && (
        <div className="bg-forge-yellow/10 border-b border-forge-yellow/30 px-3 py-1.5 flex items-center justify-between text-xs text-forge-yellow font-mono">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Locked System File: index.html is controlled by CodeForge and is read-only.</span>
          </div>
        </div>
      )}

      {/* Monaco Editor Container */}
      <div className="flex-1 relative overflow-hidden bg-forge-editor">
        <Editor
          height="100%"
          language={getMonacoLanguage()}
          theme="vs-dark"
          value={getCurrentCode()}
          onChange={(val) => setCurrentCode(val || '')}
          onMount={handleEditorDidMount}
          options={editorOptions}
          loading={
            <div className="h-full flex items-center justify-center text-forge-muted text-xs font-mono">
              Loading CodeForge Monaco Editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
