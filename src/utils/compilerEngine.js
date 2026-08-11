/**
 * CodeForge High-Performance Browser Compiler Engine
 * System-controlled locked index.html execution pipeline for React 18 & Web.
 */

export const LOCKED_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>System Controlled - CodeForge Sandbox</title>
  
  <!-- System React 18 & ReactDOM 18 CDNs -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  
  <!-- System Babel Standalone CDN -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

export function generateCompiledDoc(appJsx = '', stylesCss = '') {
  const hasCode = appJsx && appJsx.trim().length > 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Locked System CDNs -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
    }
    ${stylesCss}
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

      // Execute User React Code
      ${appJsx}

      // Auto Mount App Component
      if (typeof App !== 'undefined') {
        const rootElement = document.getElementById('root');
        const root = ReactDOM.createRoot(rootElement);
        root.render(<App />);

        window.parent.postMessage({
          source: 'CODEFORGE_SANDBOX',
          type: 'STAGE_LOG',
          payload: { stage: 'RENDER', message: '✓ Application rendered successfully' }
        }, '*');
      } else {
        window.parent.postMessage({
          source: 'CODEFORGE_SANDBOX',
          type: 'RUNTIME_ERROR',
          payload: { message: 'Notice: Component "App" is not defined. Define "function App() { return <h1>Hello</h1>; }".' }
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
      <h3 style="margin-bottom:8px; color:#475569;">Ready for React Code</h3>
      <p style="font-size:0.85rem; margin:0;">Write your React component in App.jsx and click <strong>Run Code</strong></p>
    </div>
  </div>
  `}
</body>
</html>`.trim();
}
