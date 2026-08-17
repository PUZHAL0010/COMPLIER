/**
 * CodeForge Node Runtime - DependencyManager
 * Manages allowed dependencies and system package definitions.
 */

export class DependencyManager {
  constructor() {
    this.allowedDependencies = new Map([
      ['express', '^4.19.2'],
      ['cors', '^2.8.5'],
    ]);
  }

  getAllowedDependencies() {
    return Array.from(this.allowedDependencies.keys());
  }

  isDependencyAllowed(depName) {
    return this.allowedDependencies.has(depName);
  }

  generateManifest(customDependencies = {}) {
    const deps = {};
    this.allowedDependencies.forEach((version, name) => {
      deps[name] = version;
    });

    return JSON.stringify(
      {
        name: 'student-node-project',
        version: '1.0.0',
        private: true,
        main: 'server.js',
        dependencies: deps,
      },
      null,
      2
    );
  }
}
