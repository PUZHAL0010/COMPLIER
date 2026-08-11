import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FileExplorer } from './components/FileExplorer';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { ConsolePanel } from './components/ConsolePanel';
import { TemplateModal } from './components/TemplateModal';
import { ShareModal } from './components/ShareModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TEMPLATES } from './utils/defaultTemplates';
import { generateCompiledDoc } from './utils/compilerEngine';
import { formatCode } from './utils/codeFormatter';
import { decodeCodeFromUrl } from './utils/urlStorage';

export default function App() {
  // Check URL Hash for shared snippet
  const urlSnippet = decodeCodeFromUrl(window.location.hash);

  // Clean starter workspace code
  const blankAppJsx = `// Write your React 18 component code below
function App() {
  const [message, setMessage] = React.useState('Welcome to CodeForge!');

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <h1 style={{ color: '#0284c7' }}>{message}</h1>
      <p style={{ color: '#64748b' }}>Edit App.jsx and click Run Code to compile live.</p>
    </div>
  );
}

export default App;`;

  const blankStylesCss = `/* Custom Stylesheet */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #ffffff;
  color: #0f172a;
}`;

  const initialAppJsx = urlSnippet?.html || urlSnippet?.js || blankAppJsx;
  const initialStylesCss = urlSnippet?.css || blankStylesCss;

  const [appJsx, setAppJsx] = useLocalStorage('codeforge_app_jsx_v2', initialAppJsx);
  const [stylesCss, setStylesCss] = useLocalStorage('codeforge_styles_css_v2', initialStylesCss);
  const [activeFile, setActiveFile] = useState('App.jsx');

  // Settings & Theme
  const [theme, setTheme] = useLocalStorage('codeforge_theme', 'dark');
  const [autosaveStatus, setAutosaveStatus] = useState('saved');

  // Compilation & Logs state
  const [compiledDoc, setCompiledDoc] = useState('');
  const [logs, setLogs] = useState([]);
  const [stageLogs, setStageLogs] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Modals state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Drag Resizers State
  const [sidebarWidthPct, setSidebarWidthPct] = useState(18);
  const [editorWidthPct, setEditorWidthPct] = useState(48);
  const [consoleHeightPx, setConsoleHeightPx] = useState(210);

  const [isDraggingSidebarResizer, setIsDraggingSidebarResizer] = useState(false);
  const [isDraggingEditorResizer, setIsDraggingEditorResizer] = useState(false);
  const [isDraggingConsoleResizer, setIsDraggingConsoleResizer] = useState(false);

  // Sync theme class on document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Real-time Autosave Indicator
  useEffect(() => {
    setAutosaveStatus('saving');
    const timer = setTimeout(() => {
      setAutosaveStatus('saved');
    }, 600);
    return () => clearTimeout(timer);
  }, [appJsx, stylesCss]);

  // Handle IPC postMessage events from sandboxed iframe
  useEffect(() => {
    const handleMessage = (event) => {
      const { data } = event;
      if (!data || data.source !== 'CODEFORGE_SANDBOX') return;

      if (data.type === 'STAGE_LOG') {
        setStageLogs((prev) => [...prev, data.payload]);
      } else if (data.type === 'CONSOLE') {
        setLogs((prev) => [
          ...prev,
          {
            type: 'CONSOLE',
            level: data.payload.level,
            payload: data.payload,
            timestamp: data.timestamp,
          },
        ]);
      } else if (data.type === 'RUNTIME_ERROR') {
        setLogs((prev) => [
          ...prev,
          {
            type: 'RUNTIME_ERROR',
            level: 'error',
            payload: data.payload,
            timestamp: data.timestamp,
          },
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Compile Handler
  const handleRun = useCallback(() => {
    setIsCompiling(true);
    setStageLogs([]);
    const doc = generateCompiledDoc(appJsx, stylesCss);
    setCompiledDoc(doc);
    setTimeout(() => setIsCompiling(false), 200);
  }, [appJsx, stylesCss]);

  // Initial Run on mount
  useEffect(() => {
    handleRun();
  }, []);

  // Format Code handler
  const handleFormat = async () => {
    let codeToFormat = activeFile === 'styles.css' ? stylesCss : appJsx;
    let lang = activeFile === 'styles.css' ? 'css' : 'javascript';
    const res = await formatCode(codeToFormat, lang);
    if (res.formatted) {
      if (activeFile === 'styles.css') setStylesCss(res.formatted);
      else setAppJsx(res.formatted);
    }
  };

  // Reset Code handler
  const handleClearCode = () => {
    if (window.confirm('Clear App.jsx and start with a blank editor?')) {
      setAppJsx('// Write your React 18 component code below\nfunction App() {\n  return (\n    <div>\n      \n    </div>\n  );\n}\n\nexport default App;');
      setStylesCss('');
      setLogs([]);
      setStageLogs([]);
      setCompiledDoc('');
    }
  };

  // Select Preset Template handler
  const handleSelectTemplate = (template) => {
    setAppJsx(template.js || template.html);
    setStylesCss(template.css);
    setLogs([]);
    setStageLogs([]);
  };

  // Download Code Bundle
  const handleDownload = () => {
    const doc = generateCompiledDoc(appJsx, stylesCss);
    const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codeforge-project.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Keyboard Shortcuts (Ctrl+Enter to Run, Alt+Shift+F to Format)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
      if (e.altKey && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        handleFormat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun, handleFormat]);

  // Handle Dragging Resizers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingSidebarResizer) {
        const pct = (e.clientX / window.innerWidth) * 100;
        if (pct > 12 && pct < 35) setSidebarWidthPct(pct);
      }
      if (isDraggingEditorResizer) {
        const sidebarPx = (sidebarWidthPct / 100) * window.innerWidth;
        const currentPct = ((e.clientX - sidebarPx) / window.innerWidth) * 100;
        if (currentPct > 25 && currentPct < 65) setEditorWidthPct(currentPct);
      }
      if (isDraggingConsoleResizer) {
        const newH = window.innerHeight - e.clientY;
        if (newH > 80 && newH < window.innerHeight * 0.6) setConsoleHeightPx(newH);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSidebarResizer(false);
      setIsDraggingEditorResizer(false);
      setIsDraggingConsoleResizer(false);
    };

    if (isDraggingSidebarResizer || isDraggingEditorResizer || isDraggingConsoleResizer) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSidebarResizer, isDraggingEditorResizer, isDraggingConsoleResizer, sidebarWidthPct]);

  return (
    <div className="h-screen w-screen flex flex-col bg-forge-bg text-forge-text overflow-hidden font-sans">
      {/* CodeForge Navigation Bar */}
      <Navbar
        theme={theme}
        setTheme={setTheme}
        onRun={handleRun}
        onFormat={handleFormat}
        onClear={handleClearCode}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onDownload={handleDownload}
        autosaveStatus={autosaveStatus}
        isCompiling={isCompiling}
      />

      {/* Main IDE 3-Column Split Workspace */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Column 1: File Explorer Sidebar */}
        <div style={{ width: `${sidebarWidthPct}%` }} className="h-full min-w-0 flex flex-col shrink-0">
          <FileExplorer
            activeFile={activeFile}
            setActiveFile={setActiveFile}
          />
        </div>

        {/* Resizer 1: Sidebar / Editor Splitter */}
        <div
          onMouseDown={() => setIsDraggingSidebarResizer(true)}
          className="w-1 bg-forge-border hover:bg-forge-blue cursor-col-resize transition-colors z-20 relative group shrink-0"
        >
          <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize" />
        </div>

        {/* Column 2: Center Monaco Editor Panel */}
        <div style={{ width: `${editorWidthPct}%` }} className="h-full min-w-0 flex flex-col shrink-0">
          <EditorPanel
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            appJsx={appJsx}
            setAppJsx={setAppJsx}
            stylesCss={stylesCss}
            setStylesCss={setStylesCss}
            onFormat={handleFormat}
          />
        </div>

        {/* Resizer 2: Editor / Preview Splitter */}
        <div
          onMouseDown={() => setIsDraggingEditorResizer(true)}
          className="w-1 bg-forge-border hover:bg-forge-blue cursor-col-resize transition-colors z-20 relative group shrink-0"
        >
          <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize" />
        </div>

        {/* Column 3: Sandboxed Preview & Console Split */}
        <div className="flex-1 h-full min-w-0 flex flex-col bg-forge-bg">
          {/* Top: Sandboxed Live Preview */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <PreviewPanel
              compiledDoc={compiledDoc}
              onRefresh={handleRun}
              isCompiling={isCompiling}
            />
          </div>

          {/* Resizer 3: Preview / Console Row Splitter */}
          <div
            onMouseDown={() => setIsDraggingConsoleResizer(true)}
            className="h-1 bg-forge-border hover:bg-forge-green cursor-row-resize transition-colors z-20 relative group shrink-0"
          >
            <div className="absolute inset-x-0 -top-1 -bottom-1 cursor-row-resize" />
          </div>

          {/* Bottom: Terminal Console */}
          <div style={{ height: `${consoleHeightPx}px` }} className="shrink-0">
            <ConsolePanel
              logs={logs}
              stageLogs={stageLogs}
              onClearLogs={() => {
                setLogs([]);
                setStageLogs([]);
              }}
              userCode={{ html: appJsx, css: stylesCss, js: appJsx }}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        html={appJsx}
        css={stylesCss}
        js={appJsx}
      />
    </div>
  );
}
