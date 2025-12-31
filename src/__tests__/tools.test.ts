import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { registerTools } from '../tools/index.js';
import { listTools, callTool } from './helpers.js';

// Mock the connectors to avoid ESM issues with external dependencies
jest.mock('../connectors/index.js', () => ({
  connectors: {
    getOrCreateConnection: jest.fn(),
    listConnections: jest.fn(),
    deleteConnection: jest.fn(),
  },
  linearConnector: { execute: jest.fn() },
  notionConnector: { execute: jest.fn() },
  googleConnector: { execute: jest.fn() },
  githubConnector: { execute: jest.fn() },
}));

describe('Tool Registration with SDK 1.25.1', () => {
  let server: Server;

  beforeEach(() => {
    server = new Server(
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
  });

  test('should register tools successfully', () => {
    expect(() => registerTools(server)).not.toThrow();
  });

  test('should list all registered tools', async () => {
    registerTools(server);

    const result = await listTools(server);
    expect(result).toHaveProperty('tools');
    expect(Array.isArray(result.tools)).toBe(true);
    expect(result.tools.length).toBeGreaterThan(0);

    // Verify each tool has required properties
    result.tools.forEach((tool: any) => {
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('description');
      expect(tool).toHaveProperty('inputSchema');
      expect(tool.inputSchema).toHaveProperty('type');
      expect(tool.inputSchema.type).toBe('object');
    });
  });

  test('should handle tool calls for agent tools', async () => {
    registerTools(server);

    const result = await callTool(server, 'list_agents', {});

    expect(result).toHaveProperty('content');
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0]).toHaveProperty('type');
    expect(result.content[0]).toHaveProperty('text');
  });

  test('should handle unknown tool gracefully', async () => {
    registerTools(server);

    const result = await callTool(server, 'nonexistent_tool', {});

    expect(result).toHaveProperty('content');
    expect(result.content[0].text).toContain('Unknown tool');
  });

  test('should handle agent creation', async () => {
    registerTools(server);
    
    const result = await callTool(server, 'create_agent', {
      name: 'Test Agent',
      type: 'reconnaissance',
      capabilities: ['network-scan', 'port-scan'],
    });

    expect(result).toHaveProperty('content');
    expect(result.content[0].type).toBe('text');
    
    const agentData = JSON.parse(result.content[0].text);
    expect(agentData).toHaveProperty('id');
    expect(agentData).toHaveProperty('name', 'Test Agent');
    expect(agentData).toHaveProperty('type', 'reconnaissance');
    expect(agentData).toHaveProperty('status', 'idle');
  });

  test('should reject invalid tool arguments', async () => {
    registerTools(server);
    
    const result = await callTool(server, 'create_agent', {
      // Missing required 'name' field
      type: 'reconnaissance',
    });

    expect(result).toHaveProperty('content');
    expect(result.content[0].text).toContain('Invalid arguments');
  });
});
