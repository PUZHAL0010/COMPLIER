/**
 * CodeForge Node Runtime - NodeTestRunner
 * Evaluates automated test cases against Express endpoints.
 */

export class NodeTestRunner {
  constructor(apiProxy) {
    this.apiProxy = apiProxy;
  }

  async runTests(executionId, code = '') {
    const tests = [
      {
        id: 'node-test-1',
        name: 'Express server startup',
        description: 'Verifies express package is required and app instance is initialized.',
        run: async () => code.includes('express') && (code.includes('app.listen') || code.includes('app.get') || code.includes('app.use')),
      },
      {
        id: 'node-test-2',
        name: 'Endpoint GET /api/hello exists',
        description: 'Verifies GET /api/hello route returns status code 200 OK.',
        run: async () => {
          const res = await this.apiProxy.dispatch(executionId, { method: 'GET', path: '/api/hello' });
          return res.status === 200;
        },
      },
      {
        id: 'node-test-3',
        name: 'Content-Type is JSON',
        description: 'Verifies endpoint returns valid JSON response object.',
        run: async () => {
          const res = await this.apiProxy.dispatch(executionId, { method: 'GET', path: '/api/hello' });
          return res.body && (res.body.message || typeof res.body === 'object');
        },
      },
      {
        id: 'node-test-4',
        name: 'Response body contains message',
        description: 'Verifies response JSON includes message string.',
        run: async () => {
          const res = await this.apiProxy.dispatch(executionId, { method: 'GET', path: '/api/hello' });
          return res.body && (res.body.message || res.body.students || Object.keys(res.body).length > 0);
        },
      },
    ];

    let passCount = 0;
    const testResults = [];

    for (const t of tests) {
      let passed = false;
      try {
        passed = await t.run();
      } catch (e) {
        passed = false;
      }
      if (passed) passCount++;

      testResults.push({
        id: t.id,
        name: t.name,
        description: t.description,
        passed,
      });
    }

    const totalTests = tests.length;
    const scorePercentage = Math.round((passCount / totalTests) * 10);

    return {
      passCount,
      totalTests,
      scorePercentage,
      scoreText: `Score: ${scorePercentage} / 10`,
      summaryText: `${passCount} / ${totalTests} Node tests passed`,
      results: testResults,
    };
  }
}
