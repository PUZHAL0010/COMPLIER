/**
 * CodeForge Node Runtime - PortManager
 * Allocates and manages internal execution ports for Node processes.
 */

export class PortManager {
  constructor(basePort = 4000, maxPort = 4999) {
    this.basePort = basePort;
    this.maxPort = maxPort;
    this.allocatedPorts = new Set();
  }

  allocatePort() {
    for (let port = this.basePort; port <= this.maxPort; port++) {
      if (!this.allocatedPorts.has(port)) {
        this.allocatedPorts.add(port);
        return port;
      }
    }
    // Fallback to random port if exhausted
    const fallbackPort = Math.floor(Math.random() * (this.maxPort - this.basePort)) + this.basePort;
    this.allocatedPorts.add(fallbackPort);
    return fallbackPort;
  }

  releasePort(port) {
    this.allocatedPorts.delete(port);
  }
}
