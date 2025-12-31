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

  test('should create server with custom configuration', () => {
    expect(() => {
      new Server(
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
    }).not.toThrow();
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
