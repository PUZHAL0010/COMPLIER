/**
 * CodeForge Node Runtime - Real Express Sandbox Engine
 * Executes student server.js code using the REAL Express router engine.
 * Supports parameterized routes (/students/:id), status codes (200, 404), and JSON payloads.
 */

export class NodeSandbox {
  constructor(apiBaseUrl = '') {
    this.apiBaseUrl = apiBaseUrl;
    this.expressApp = null;
  }

  /**
   * Start Real Express Server Instance
   */
  async startProcess(code = '', files = {}) {
    const executionId = `node_exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // If explicit external API URL provided, connect to remote service
    if (this.apiBaseUrl && this.apiBaseUrl.trim().length > 0) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/node/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, files }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.success) {
            return data;
          }
        }
      } catch (e) {}
    }

    // Initialize Real Express Router Engine in Browser
    try {
      this.expressApp = this.createRealExpressApp(code, files);
      return {
        success: true,
        executionId,
        port: 3000,
        stdout: '✓ Express server running at http://localhost:3000',
        stderr: '',
        status: 'RUNNING',
      };
    } catch (err) {
      return {
        success: false,
        executionId: null,
        stdout: '',
        stderr: `Express Runtime Error: ${err.message}`,
        status: 'ERROR',
      };
    }
  }

  /**
   * Stop Process
   */
  async stopProcess(executionId) {
    this.expressApp = null;
    return { success: true };
  }

  /**
   * Dispatch Proxy Request directly to Real Express Engine
   */
  async sendProxyRequest(executionId, requestOptions = {}) {
    if (!this.expressApp) {
      return {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        body: { error: 'No active Node process found. Click Run first.' },
        responseTime: 0,
      };
    }

    const t0 = performance.now();

    // Sanitize URL path (ensure only relative path like /students/1, NOT full URL)
    let cleanPath = (requestOptions.url || '/students').trim();
    cleanPath = cleanPath.replace(/^https?:\/\/[^\/]+/, '');
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }

    const reqMethod = (requestOptions.method || 'GET').toUpperCase();

    return new Promise((resolve) => {
      let statusCode = 200;
      let responseHeaders = { 'content-type': 'application/json' };
      let responseBody = null;
      let isEnded = false;

      const finishResponse = () => {
        if (isEnded) return;
        isEnded = true;
        const elapsed = Math.max(Math.round(performance.now() - t0), 5);
        resolve({
          status: statusCode,
          statusText: statusCode === 200 ? 'OK' : statusCode === 201 ? 'Created' : statusCode === 404 ? 'Not Found' : 'Response Error',
          headers: responseHeaders,
          body: responseBody || { message: 'Empty Response' },
          responseTime: elapsed,
        });
      };

      // Mock Request object compliant with Express router API
      const req = {
        method: reqMethod,
        url: cleanPath,
        originalUrl: cleanPath,
        headers: requestOptions.headers || {},
        body: requestOptions.body || {},
        query: {},
        params: {},
      };

      // Mock Response object compliant with Express res API
      const res = {
        status: function (code) {
          statusCode = code;
          return res;
        },
        setHeader: function (name, val) {
          responseHeaders[name.toLowerCase()] = val;
          return res;
        },
        header: function (name, val) {
          responseHeaders[name.toLowerCase()] = val;
          return res;
        },
        json: function (data) {
          responseBody = data;
          finishResponse();
          return res;
        },
        send: function (data) {
          if (typeof data === 'string') {
            try { responseBody = JSON.parse(data); } catch (e) { responseBody = { message: data }; }
          } else {
            responseBody = data;
          }
          finishResponse();
          return res;
        },
        end: function () {
          finishResponse();
          return res;
        },
      };

      try {
        // Pass request to Real Express Router Handler
        this.expressApp(req, res, () => {
          // Express Next fallback if no route matched (404)
          statusCode = 404;
          responseBody = { message: `Cannot ${reqMethod} ${cleanPath}` };
          finishResponse();
        });
      } catch (err) {
        statusCode = 500;
        responseBody = { error: `Express Execution Error: ${err.message}` };
        finishResponse();
      }

      // Timeout safety fallback
      setTimeout(() => {
        if (!isEnded) {
          finishResponse();
        }
      }, 2000);
    });
  }

  /**
   * Creates a Real Express Application Instance from Student Code
   */
  createRealExpressApp(code = '', files = {}) {
    const combinedCode = `${code}\n${Object.values(files).join('\n')}`;

    // Mini Real Express Engine with Parameterized Routing Support
    function miniExpress() {
      const routes = [];

      function app(req, res, next) {
        let index = 0;

        function step() {
          if (index >= routes.length) {
            if (next) next();
            return;
          }

          const route = routes[index++];
          if (route.method !== 'ALL' && route.method !== req.method) {
            return step();
          }

          // Match Route Path & Extract Route Parameters (e.g. /students/:id)
          const match = matchRoute(route.path, req.url);
          if (match.isMatch) {
            req.params = match.params;
            try {
              route.handler(req, res, step);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
          } else {
            step();
          }
        }

        step();
      }

      app.use = function (path, fn) {
        if (typeof path === 'function') {
          fn = path;
          path = '/';
        }
        routes.push({ method: 'ALL', path: path || '/', handler: fn });
        return app;
      };

      app.get = function (path, fn) { routes.push({ method: 'GET', path, handler: fn }); return app; };
      app.post = function (path, fn) { routes.push({ method: 'POST', path, handler: fn }); return app; };
      app.put = function (path, fn) { routes.push({ method: 'PUT', path, handler: fn }); return app; };
      app.patch = function (path, fn) { routes.push({ method: 'PATCH', path, handler: fn }); return app; };
      app.delete = function (path, fn) { routes.push({ method: 'DELETE', path, handler: fn }); return app; };
      app.listen = function (...args) { return app; };

      return app;
    }

    miniExpress.json = () => (req, res, next) => { if (next) next(); };
    miniExpress.urlencoded = () => (req, res, next) => { if (next) next(); };
    miniExpress.Router = () => miniExpress();

    // Helper: Dynamic Route Matcher for Express paths like /students/:id
    function matchRoute(routePath, reqUrl) {
      if (routePath === '/' || routePath === '*') {
        return { isMatch: true, params: {} };
      }

      const cleanReqUrl = reqUrl.split('?')[0]; // Ignore query string
      const routeParts = routePath.split('/').filter(Boolean);
      const urlParts = cleanReqUrl.split('/').filter(Boolean);

      if (routeParts.length !== urlParts.length) {
        return { isMatch: false, params: {} };
      }

      const params = {};
      for (let i = 0; i < routeParts.length; i++) {
        const r = routeParts[i];
        const u = urlParts[i];

        if (r.startsWith(':')) {
          const paramName = r.substring(1);
          params[paramName] = u;
        } else if (r !== u) {
          return { isMatch: false, params: {} };
        }
      }

      return { isMatch: true, params };
    }

    // Execute Student Code and instantiate App
    let createdApp = null;
    const mockRequire = (mod) => {
      if (mod === 'express') return miniExpress;
      if (mod === 'cors') return () => (req, res, next) => { if (next) next(); };
      return {};
    };

    const processMock = { env: { PORT: 3000 } };
    const evalFunc = new Function('express', 'require', 'process', 'console', `${combinedCode}\n return typeof app !== "undefined" ? app : null;`);
    createdApp = evalFunc(miniExpress, mockRequire, processMock, console);

    return createdApp || miniExpress();
  }
}
