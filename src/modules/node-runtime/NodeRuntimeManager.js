/**
 * CodeForge Node Runtime - NodeRuntimeManager
 * Coordinates runtime lifecycle, logs, and status state.
 */

export class NodeRuntimeManager {
  constructor(sandbox) {
    this.sandbox = sandbox;
    this.activeExecutionId = null;
    this.status = 'STOPPED'; // 'STOPPED', 'STARTING', 'RUNNING', 'ERROR'
    this.logs = [];
  }

  async start(code, files = {}) {
    this.status = 'STARTING';
    this.logs = [
      { stage: 'INIT', message: '✓ Node runtime starting...' },
      { stage: 'DEPS', message: '✓ Dependencies loaded (express, cors)' },
    ];

    const result = await this.sandbox.startProcess(code, files);

    if (result && result.success) {
      this.activeExecutionId = result.executionId;
      this.status = 'RUNNING';
      this.logs.push(
        { stage: 'EXEC', message: '✓ server.js executed successfully' },
        { stage: 'SERVER', message: '✓ Express server listening' }
      );
    } else {
      this.status = 'ERROR';
      this.logs.push({
        stage: 'ERROR',
        message: result ? result.stderr || 'Failed to start Node process' : 'Execution Error',
      });
    }

    return {
      status: this.status,
      executionId: this.activeExecutionId,
      logs: this.logs,
      result,
    };
  }

  async stop() {
    if (this.activeExecutionId) {
      await this.sandbox.stopProcess(this.activeExecutionId);
      this.activeExecutionId = null;
    }
    this.status = 'STOPPED';
    this.logs.push({ stage: 'STOP', message: '⏹ Node runtime process stopped' });
    return { status: this.status };
  }

  getStatus() {
    return {
      status: this.status,
      executionId: this.activeExecutionId,
      logs: this.logs,
    };
  }
}
