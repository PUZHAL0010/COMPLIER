/**
 * CodeForge Node Runtime - ApiProxy
 * Forwards API Tester requests to active Node.js execution environments.
 */

export class ApiProxy {
  constructor(sandbox) {
    this.sandbox = sandbox;
  }

  async dispatch(executionId, { method = 'GET', path = '/api/hello', headers = {}, body = null }) {
    if (!executionId) {
      return {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        body: { error: 'No active Node execution session found. Click Run first.' },
        responseTime: 0,
      };
    }

    const t0 = performance.now();
    const res = await this.sandbox.sendProxyRequest(executionId, {
      method,
      url: path,
      headers,
      body,
    });
    const elapsed = Math.round(performance.now() - t0);

    return {
      status: res.status || 500,
      statusText: res.statusText || 'Internal Server Error',
      headers: res.headers || {},
      body: res.body || {},
      responseTime: res.responseTime || elapsed,
    };
  }
}
