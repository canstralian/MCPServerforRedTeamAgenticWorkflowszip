import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../store/index.js';
import { Agent, AgentType, AgentStatus } from '../types/index.js';
import { logger } from '../utils/logger.js';

function handleCreateAgent(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const agent: Agent = {
    id: uuidv4(),
    name: args.name as string,
    type: args.type as AgentType,
    status: AgentStatus.IDLE,
    capabilities: args.capabilities as string[],
    createdAt: new Date(),
    lastActive: new Date(),
  };
  store.addAgent(agent);
  logger.info(`Created agent: ${agent.id}`);
  return { content: [{ type: 'text', text: JSON.stringify(agent, null, 2) }] };
}

function handleListAgents(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  let agents = store.getAllAgents();
  if (args.status) {
    agents = agents.filter((a) => a.status === args.status);
  }
  return { content: [{ type: 'text', text: JSON.stringify(agents, null, 2) }] };
}

function handleGetAgent(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const agent = store.getAgent(args.agentId as string);
  if (!agent) {
    return { content: [{ type: 'text', text: 'Agent not found' }] };
  }
  return { content: [{ type: 'text', text: JSON.stringify(agent, null, 2) }] };
}

function handleUpdateAgent(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const { agentId, ...updates } = args as { agentId: string; [key: string]: unknown };
  const agent = store.updateAgent(agentId, updates as Partial<Agent>);
  if (!agent) {
    return { content: [{ type: 'text', text: 'Agent not found' }] };
  }
  logger.info(`Updated agent: ${agentId}`);
  return { content: [{ type: 'text', text: JSON.stringify(agent, null, 2) }] };
}

function handleDeleteAgent(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const success = store.deleteAgent(args.agentId as string);
  if (!success) {
    return { content: [{ type: 'text', text: 'Agent not found' }] };
  }
  logger.info(`Deleted agent: ${args.agentId}`);
  return { content: [{ type: 'text', text: 'Agent deleted successfully' }] };
}

export function registerAgentTools(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'create_agent',
          description: 'Create a new red team agent with specified capabilities',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Agent name' },
              type: {
                type: 'string',
                enum: Object.values(AgentType),
                description: 'Agent type',
              },
              capabilities: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of agent capabilities',
              },
            },
            required: ['name', 'type', 'capabilities'],
          },
        },
        {
          name: 'list_agents',
          description: 'List all registered agents',
          inputSchema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: Object.values(AgentStatus),
                description: 'Filter by agent status',
              },
            },
          },
        },
        {
          name: 'get_agent',
          description: 'Get detailed information about a specific agent',
          inputSchema: {
            type: 'object',
            properties: {
              agentId: { type: 'string', description: 'Agent ID' },
            },
            required: ['agentId'],
          },
        },
        {
          name: 'update_agent',
          description: 'Update an existing agent',
          inputSchema: {
            type: 'object',
            properties: {
              agentId: { type: 'string', description: 'Agent ID' },
              name: { type: 'string', description: 'New agent name' },
              status: {
                type: 'string',
                enum: Object.values(AgentStatus),
                description: 'New agent status',
              },
            },
            required: ['agentId'],
          },
        },
        {
          name: 'delete_agent',
          description: 'Delete an agent',
          inputSchema: {
            type: 'object',
            properties: {
              agentId: { type: 'string', description: 'Agent ID' },
            },
            required: ['agentId'],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'create_agent':
        return handleCreateAgent(args as Record<string, unknown>);
      case 'list_agents':
        return handleListAgents(args as Record<string, unknown>);
      case 'get_agent':
        return handleGetAgent(args as Record<string, unknown>);
      case 'update_agent':
        return handleUpdateAgent(args as Record<string, unknown>);
      case 'delete_agent':
        return handleDeleteAgent(args as Record<string, unknown>);
      default:
        return { content: [{ type: 'text', text: 'Unknown tool' }] };
    }
  });
}
