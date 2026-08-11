
export function generateCompiledDoc(html = '', css = '', js = '') {
  const isReactCode = js.includes('React') || js.includes('ReactDOM') || js.includes('<') || html.includes('text/babel');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- React & ReactDOM UMD CDNs -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  
  <!-- Babel Standalone CDN for JSX & ES6 compilation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: transparent;
      color: inherit;
    }
    ${css}
  </style>

  <script>
    // Intercept Console and Error outputs inside sandboxed iframe
    (function() {
      const origConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        clear: console.clear,
      };

      function sendToParent(type, data) {
        try {
          window.parent.postMessage({
            source: 'CODECRAFT_IFRAME',
            type: type,
            payload: data,
            timestamp: new Date().toLocaleTimeString()
          }, '*');
        } catch (e) {
          origConsole.error('Failed to postMessage to parent:', e);
        }
      }

      function formatValue(arg) {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (typeof arg === 'function') return '[Function: ' + (arg.name || 'anonymous') + ']';
        if (typeof arg === 'symbol') return arg.toString();
        if (arg instanceof Error) {
          return {
            isError: true,
            name: arg.name,
            message: arg.message,
            stack: arg.stack
          };
        }
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return '[Circular / Non-serializable Object]';
          }
        }
        return String(arg);
      }

      function createLogHandler(level) {
        return function(...args) {
          origConsole[level](...args);
          const formattedArgs = args.map(formatValue);
          sendToParent('CONSOLE', {
            level: level,
            args: formattedArgs,
            rawArgs: args
          });
        };
      }

      console.log = createLogHandler('log');
      console.warn = createLogHandler('warn');
      console.error = createLogHandler('error');
      console.info = createLogHandler('info');
      console.clear = function() {
        origConsole.clear();
        sendToParent('CONSOLE_CLEAR', {});
      };

      // Capture uncaught JavaScript runtime errors
      window.onerror = function(message, source, lineno, colno, error) {
        sendToParent('RUNTIME_ERROR', {
          message: String(message),
          line: lineno,
          column: colno,
          stack: error ? error.stack : null,
          source: 'JavaScript Runtime'
        });
        return false;
      };

      // Capture unhandled promise rejections
      window.addEventListener('unhandledrejection', function(event) {
        const reason = event.reason;
        const msg = reason instanceof Error ? reason.message : String(reason);
        sendToParent('RUNTIME_ERROR', {
          message: 'Unhandled Promise Rejection: ' + msg,
          line: reason && reason.lineNumber ? reason.lineNumber : 'N/A',
          column: reason && reason.columnNumber ? reason.columnNumber : 'N/A',
          stack: reason && reason.stack ? reason.stack : null,
          source: 'Promise Rejection'
        });
      });
    })();
  </script>
</head>
<body>
  ${html}

  <script type="text/babel">
    try {
      ${js}
    } catch (err) {
      window.parent.postMessage({
        source: 'CODECRAFT_IFRAME',
        type: 'RUNTIME_ERROR',
        payload: {
          message: err.name + ': ' + err.message,
          stack: err.stack,
          source: 'React / JSX Execution'
        }
      }, '*');
    }
  </script>
</body>
</html>
  `.trim();
}
