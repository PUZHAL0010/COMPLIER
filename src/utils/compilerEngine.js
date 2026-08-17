/**
 * CodeForge High-Performance Browser Compiler Engine
 * System-controlled locked index.html execution pipeline for React 18 & Web.
 * 
 * Includes CDNs for React 18, ReactDOM 18, Babel Standalone, Tailwind CSS, Bootstrap 5, and ReactBootstrap!
 */

export const LOCKED_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CodeForge Sandbox</title>
  
  <!-- System React 18 & ReactDOM 18 CDNs -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  
  <!-- System Babel Standalone CDN -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Bootstrap 5 CSS & ReactBootstrap CDNs -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" crossorigin="anonymous" />
  <script src="https://cdn.jsdelivr.net/npm/react-bootstrap@2.10.1/dist/react-bootstrap.min.js" crossorigin="anonymous"></script>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

export function generateCompiledDoc(appJsx = '', stylesCss = '', customFilesDict = {}) {
  const hasCode = appJsx && appJsx.trim().length > 0;

  // Additional custom CSS from files
  let customCssContent = stylesCss || '';
  Object.keys(customFilesDict).forEach((filename) => {
    if (filename.endsWith('.css')) {
      customCssContent += `\n${customFilesDict[filename]}`;
    }
  });

  // Additional custom JS/JSX components from files
  let customComponentsJs = '';
  Object.keys(customFilesDict).forEach((filename) => {
    if (filename.endsWith('.jsx') || filename.endsWith('.js')) {
      customComponentsJs += `\n// File: ${filename}\n${customFilesDict[filename]}\n`;
    }
  });

  // Sanitize export default statements for inline Babel evaluation
  let sanitizedAppJsx = appJsx.replace(/export\s+default\s+App\s*;?/g, '');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CodeForge Sandbox Execution Environment</title>
  
  <!-- Locked System CDNs -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- Bootstrap 5 & ReactBootstrap CDNs -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" crossorigin="anonymous" />
  <script src="https://cdn.jsdelivr.net/npm/react-bootstrap@2.10.1/dist/react-bootstrap.min.js" crossorigin="anonymous"></script>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
    }
    ${customCssContent}
  </style>

  <script>
    (function() {
      const origConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
      };

      function sendToParent(type, data) {
        try {
          window.parent.postMessage({
            source: 'CODEFORGE_SANDBOX',
            type: type,
            payload: data,
            timestamp: new Date().toLocaleTimeString()
          }, '*');
        } catch (e) {}
      }

      sendToParent('STAGE_LOG', { stage: 'INIT', message: 'Compiling App.jsx...' });

      function formatVal(arg) {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (typeof arg === 'object') {
          try { return JSON.stringify(arg); } catch (e) { return '[Object]'; }
        }
        return String(arg);
      }

      console.log = function(...args) {
        origConsole.log(...args);
        sendToParent('CONSOLE', { level: 'log', args: args.map(formatVal) });
      };
      console.warn = function(...args) {
        origConsole.warn(...args);
        sendToParent('CONSOLE', { level: 'warn', args: args.map(formatVal) });
      };
      console.error = function(...args) {
        origConsole.error(...args);
        sendToParent('CONSOLE', { level: 'error', args: args.map(formatVal) });
      };

      window.onerror = function(msg, url, line, col, err) {
        sendToParent('RUNTIME_ERROR', {
          message: String(msg),
          line: line,
          col: col,
          stack: err ? err.stack : null
        });
        return false;
      };
    })();
  </script>
</head>
<body>
  <div id="root"></div>

  ${hasCode ? `
  <script type="text/babel">
    try {
      // Expose ReactBootstrap into global script scope
      const ReactBootstrap = window.ReactBootstrap || {};

      window.parent.postMessage({
        source: 'CODEFORGE_SANDBOX',
        type: 'STAGE_LOG',
        payload: { stage: 'BABEL', message: '✓ Babel compilation successful' }
      }, '*');

      if (window.React && window.ReactDOM) {
        window.parent.postMessage({
          source: 'CODEFORGE_SANDBOX',
          type: 'STAGE_LOG',
          payload: { stage: 'REACT', message: '✓ React 18 loaded' }
        }, '*');
      }

      // Execute Custom Helper Components
      ${customComponentsJs}

      // Execute Student App.jsx Code
      ${sanitizedAppJsx}

      // Auto Mount App Component
      if (typeof App !== 'undefined') {
        const rootElement = document.getElementById('root');
        if (rootElement && !rootElement._reactRoot) {
          const root = ReactDOM.createRoot(rootElement);
          rootElement._reactRoot = root;
          root.render(<App />);
        }

        window.parent.postMessage({
          source: 'CODEFORGE_SANDBOX',
          type: 'STAGE_LOG',
          payload: { stage: 'RENDER', message: '✓ Application rendered successfully' }
        }, '*');
      } else {
        window.parent.postMessage({
          source: 'CODEFORGE_SANDBOX',
          type: 'RUNTIME_ERROR',
          payload: { message: 'Notice: Component "App" is not defined. Define "class App extends React.Component" or "function App() { return <div>...</div>; }".' }
        }, '*');
      }
    } catch (err) {
      window.parent.postMessage({
        source: 'CODEFORGE_SANDBOX',
        type: 'RUNTIME_ERROR',
        payload: {
          message: err.name + ': ' + err.message,
          stack: err.stack
        }
      }, '*');
    }
  </script>
  ` : `
  <div style="display:flex; justify-content:center; align-items:center; height:80vh; color:#94a3b8; font-family:sans-serif; text-align:center;">
    <div>
      <h3 style="margin-bottom:8px; color:#475569;">Ready for React 18 Code</h3>
      <p style="font-size:0.85rem; margin:0;">Write your React component in App.jsx and click <strong>▶ Run</strong></p>
    </div>
  </div>
  `}
</body>
</html>`.trim();
}
