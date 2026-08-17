import React, { useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { Lock, ChevronLeft, X, Copy, Check, Wand2 } from 'lucide-react';
import { LOCKED_INDEX_HTML } from '../utils/compilerEngine';

// Configure Monaco Editor loader CDN for GitHub Pages reliability
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs',
  },
});

const DEFAULT_PACKAGE_JSON = `{
  "name": "codeforge-react-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^3.4.4"
  }
}`;

const DEFAULT_INDEX_JS = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

export function EditorPanel({
  activeFile,
  setActiveFile,
  appJsx,
  setAppJsx,
  stylesCss,
  setStylesCss,
  userFiles = [],
  onUpdateUserFileContent,
  onFormat
}) {
  const [copied, setCopied] = useState(false);

  // System locked files (index.html, package.json, index.js)
  const isReadOnly = activeFile === 'index.html' || activeFile === 'package.json' || activeFile === 'index.js';

  const isCustomUserFile = userFiles.some((f) => f.name === activeFile);

  const getCurrentCode = () => {
    if (activeFile === 'index.html') return LOCKED_INDEX_HTML;
    if (activeFile === 'package.json') return DEFAULT_PACKAGE_JSON;
    if (activeFile === 'index.js') return DEFAULT_INDEX_JS;
    if (activeFile === 'styles.css') return stylesCss;

    if (isCustomUserFile) {
      const fileObj = userFiles.find((f) => f.name === activeFile);
      return fileObj ? fileObj.content : '';
    }

    return appJsx;
  };

  const setCurrentCode = (val) => {
    if (isReadOnly) return;

    if (activeFile === 'styles.css') {
      setStylesCss(val);
      return;
    }

    if (isCustomUserFile) {
      onUpdateUserFileContent(activeFile, val);
      return;
    }

    setAppJsx(val);
  };

  const getMonacoLanguage = () => {
    if (activeFile === 'index.html') return 'html';
    if (activeFile === 'package.json') return 'json';
    if (activeFile === 'styles.css') return 'css';
    return 'javascript';
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
    <div className="h-full flex flex-col bg-[#1E1E1E] border-r border-[#282828] overflow-hidden select-none">
      {/* File Tab Bar */}
      <div className="bg-[#0D0D0D] border-b border-[#282828] flex items-center justify-between px-2 pt-1">
        <div className="flex items-center space-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveFile('App.jsx')}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            title="Back to App.jsx"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* App.jsx Tab */}
          <button
            onClick={() => setActiveFile('App.jsx')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-sans font-medium rounded-t border-t-2 transition-all ${
              activeFile === 'App.jsx'
                ? 'bg-[#1E1E1E] text-white border-sky-400'
                : 'text-neutral-400 hover:text-white border-transparent'
            }`}
          >
            <span>App.jsx</span>
          </button>

          {/* index.html System Tab */}
          <button
            onClick={() => setActiveFile('index.html')}
            className={`flex items-center space-x-2 px-3 py-1 text-xs font-sans font-medium rounded-t border-t-2 transition-all group ${
              activeFile === 'index.html'
                ? 'bg-[#1E1E1E] text-white border-sky-400'
                : 'text-neutral-400 hover:text-white border-transparent'
            }`}
          >
            <span>index.html</span>
            <X className="w-3 h-3 text-neutral-500 hover:text-white transition-colors" />
          </button>

          {/* styles.css Tab */}
          <button
            onClick={() => setActiveFile('styles.css')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-sans font-medium rounded-t border-t-2 transition-all ${
              activeFile === 'styles.css'
                ? 'bg-[#1E1E1E] text-white border-sky-400'
                : 'text-neutral-400 hover:text-white border-transparent'
            }`}
          >
            <span>styles.css</span>
          </button>

          {/* Custom File Tabs */}
          {userFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(file.name)}
              className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-sans font-medium rounded-t border-t-2 transition-all ${
                activeFile === file.name
                  ? 'bg-[#1E1E1E] text-white border-sky-400'
                  : 'text-neutral-400 hover:text-white border-transparent'
              }`}
            >
              <span>{file.name}</span>
            </button>
          ))}
        </div>

        {/* Line Metrics & Action Icons */}
        <div className="flex items-center space-x-3 text-xs text-neutral-400 font-mono pr-2 shrink-0">
          <span>{lineCount} lines</span>
          {!isReadOnly && (
            <button
              onClick={onFormat}
              className="p-1 hover:text-sky-400 transition-colors"
              title="Format Code (Alt + Shift + F)"
            >
              <Wand2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Locked System File Notice Banner */}
      {isReadOnly && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1 flex items-center space-x-2 text-xs text-amber-400 font-mono">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Locked System File: {activeFile} is controlled by CodeForge and is read-only.</span>
        </div>
      )}

      {/* Monaco Editor Container */}
      <div className="flex-1 relative overflow-hidden bg-[#1E1E1E]">
        <Editor
          height="100%"
          language={getMonacoLanguage()}
          theme="vs-dark"
          value={getCurrentCode()}
          onChange={(val) => setCurrentCode(val || '')}
          onMount={handleEditorDidMount}
          options={editorOptions}
          loading={
            <div className="h-full flex items-center justify-center text-neutral-400 text-xs font-mono">
              Loading CodeForge Monaco Editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
