import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { store } from '../store/index.js';
import { Agent, AgentType, AgentStatus } from '../types/index.js';
import { logger } from '../utils/logger.js';

const CreateAgentSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.nativeEnum(AgentType),
  capabilities: z.array(z.string().max(255)).max(100),
});

const GetAgentSchema = z.object({
  agentId: z.string().uuid(),
});

const UpdateAgentSchema = z.object({
  agentId: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  status: z.nativeEnum(AgentStatus).optional(),
  capabilities: z.array(z.string().max(255)).max(100).optional(),
});

const ListAgentsSchema = z.object({
  status: z.nativeEnum(AgentStatus).optional(),
});

function handleCreateAgent(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = CreateAgentSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const { name, type, capabilities } = parsed.data;
  
  const agent: Agent = {
    id: uuidv4(),
    name,
    type,
    status: AgentStatus.IDLE,
    capabilities,
    createdAt: new Date(),
    lastActive: new Date(),
  };
  store.addAgent(agent);
  logger.info(`Created agent: ${agent.id}`);
  return { content: [{ type: 'text', text: JSON.stringify(agent, null, 2) }] };
}

function handleListAgents(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = ListAgentsSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  let agents = store.getAllAgents();
  if (parsed.data.status) {
    agents = agents.filter((a) => a.status === parsed.data.status);
  }
  return { content: [{ type: 'text', text: JSON.stringify(agents, null, 2) }] };
}

function handleGetAgent(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = GetAgentSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const agent = store.getAgent(parsed.data.agentId);
  if (!agent) {
    return { content: [{ type: 'text', text: 'Agent not found' }] };
  }
  return { content: [{ type: 'text', text: JSON.stringify(agent, null, 2) }] };
}

function handleUpdateAgent(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = UpdateAgentSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const { agentId, ...updates } = parsed.data;
  const agent = store.updateAgent(agentId, updates as Partial<Agent>);
  if (!agent) {
    return { content: [{ type: 'text', text: 'Agent not found' }] };
  }
  logger.info(`Updated agent: ${agentId}`);
  return { content: [{ type: 'text', text: JSON.stringify(agent, null, 2) }] };
}

function handleDeleteAgent(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = GetAgentSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const success = store.deleteAgent(parsed.data.agentId);
  if (!success) {
    return { content: [{ type: 'text', text: 'Agent not found' }] };
  }
  logger.info(`Deleted agent: ${parsed.data.agentId}`);
  return { content: [{ type: 'text', text: 'Agent deleted successfully' }] };
}

function handleActivateAgent(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = GetAgentSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const agent = store.updateAgent(parsed.data.agentId, { 
    status: AgentStatus.ACTIVE,
    lastActive: new Date(),
  });
  if (!agent) {
    return { content: [{ type: 'text', text: 'Agent not found' }] };
  }
  logger.info(`Activated agent: ${parsed.data.agentId}`);
  return { content: [{ type: 'text', text: JSON.stringify(agent, null, 2) }] };
}

export const agentTools = [
  {
    name: 'create_agent',
    description: 'Create a new red team agent with specified capabilities for security testing',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Agent name' },
        type: {
          type: 'string',
          enum: Object.values(AgentType),
          description: 'Agent type (reconnaissance, exploitation, post_exploitation, persistence, lateral_movement, command_control)',
        },
        capabilities: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of agent capabilities (e.g., port_scanning, sql_injection, phishing)',
        },
      },
      required: ['name', 'type', 'capabilities'],
    },
  },
  {
    name: 'list_agents',
    description: 'List all registered agents with optional status filtering',
    inputSchema: {
      type: 'object' as const,
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
      type: 'object' as const,
      properties: {
        agentId: { type: 'string', description: 'Agent ID (UUID format)' },
      },
      required: ['agentId'],
    },
  },
  {
    name: 'update_agent',
    description: 'Update an existing agent properties',
    inputSchema: {
      type: 'object' as const,
      properties: {
        agentId: { type: 'string', description: 'Agent ID (UUID format)' },
        name: { type: 'string', description: 'New agent name' },
        status: {
          type: 'string',
          enum: Object.values(AgentStatus),
          description: 'New agent status',
        },
        capabilities: {
          type: 'array',
          items: { type: 'string' },
          description: 'Updated capabilities list',
        },
      },
      required: ['agentId'],
    },
  },
  {
    name: 'activate_agent',
    description: 'Activate an agent for deployment in operations',
    inputSchema: {
      type: 'object' as const,
      properties: {
        agentId: { type: 'string', description: 'Agent ID to activate (UUID format)' },
      },
      required: ['agentId'],
    },
  },
  {
    name: 'delete_agent',
    description: 'Delete an agent from the system',
    inputSchema: {
      type: 'object' as const,
      properties: {
        agentId: { type: 'string', description: 'Agent ID (UUID format)' },
      },
      required: ['agentId'],
    },
  },
];

export function handleAgentTool(name: string, args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } | null {
  switch (name) {
    case 'create_agent':
      return handleCreateAgent(args);
    case 'list_agents':
      return handleListAgents(args);
    case 'get_agent':
      return handleGetAgent(args);
    case 'update_agent':
      return handleUpdateAgent(args);
    case 'activate_agent':
      return handleActivateAgent(args);
    case 'delete_agent':
      return handleDeleteAgent(args);
    default:
      return null;
  }
}
