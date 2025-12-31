import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { config } from '../config/index.js';

describe('Server Initialization with SDK 1.25.1', () => {
  test('should create server instance successfully', () => {
    expect(() => {
      new Server(
        {
          name: config.serverName,
          version: config.version,
        },
        {
          capabilities: {
            tools: {},
            resources: {},
          },
        }
      );
    }).not.toThrow();
  });

  test('should have correct server info', () => {
    const server = new Server(
      {
        name: 'test-server',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    const serverInfo = (server as any)._serverInfo;
    expect(serverInfo).toBeDefined();
    expect(serverInfo.name).toBe('test-server');
    expect(serverInfo.version).toBe('2.0.0');
  });

  test('should have required capabilities', () => {
    const server = new Server(
      {
        name: 'test-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    const capabilities = (server as any)._capabilities;
    expect(capabilities).toBeDefined();
    expect(capabilities).toHaveProperty('tools');
    expect(capabilities).toHaveProperty('resources');
  });

  test('should support SDK 1.25.1 API', () => {
    const server = new Server(
      {
        name: 'test-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Verify that the server has the required methods from SDK 1.25.1
    expect(typeof server.setRequestHandler).toBe('function');
    expect(typeof server.connect).toBe('function');
    expect(typeof server.close).toBe('function');
  });
});
