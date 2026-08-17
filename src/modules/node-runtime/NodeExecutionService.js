/**
 * CodeForge Node Runtime - NodeExecutionService
 * Public Entry Point & Facade exposing small interface to main CodeForge IDE.
 */

import { NodeSandbox } from './NodeSandbox';
import { NodeRuntimeManager } from './NodeRuntimeManager';
import { ApiProxy } from './ApiProxy';
import { NodeTestRunner } from './NodeTestRunner';
import { DependencyManager } from './DependencyManager';
import { PortManager } from './PortManager';

export class NodeExecutionService {
  constructor(apiBaseUrl = '') {
    this.sandbox = new NodeSandbox(apiBaseUrl);
    this.runtimeManager = new NodeRuntimeManager(this.sandbox);
    this.apiProxy = new ApiProxy(this.sandbox);
    this.testRunner = new NodeTestRunner(this.apiProxy);
    this.dependencyManager = new DependencyManager();
    this.portManager = new PortManager();
  }

  /**
   * Public Interface Method: runNodeProject
   */
  async runNodeProject(code = '', files = {}) {
    return await this.runtimeManager.start(code, files);
  }

  /**
   * Public Interface Method: stopNodeProject
   */
  async stopNodeProject() {
    return await this.runtimeManager.stop();
  }

  /**
   * Public Interface Method: testNodeProject
   */
  async testNodeProject(code = '') {
    const status = this.runtimeManager.getStatus();
    return await this.testRunner.runTests(status.executionId, code);
  }

  /**
   * Public Interface Method: getNodeStatus
   */
  getNodeStatus() {
    return this.runtimeManager.getStatus();
  }

  /**
   * Public Interface Method: getApiResponse
   */
  async getApiResponse(requestOptions = {}) {
    const status = this.runtimeManager.getStatus();
    return await this.apiProxy.dispatch(status.executionId, requestOptions);
  }
}
