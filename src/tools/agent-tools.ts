import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { store } from '../store/index.js';
import { Agent, AgentType, AgentStatus } from '../types/index.js';
import { logger } from '../utils/logger.js';

// TODO: Add agent configuration validation (min/max capabilities count)
// TODO: Add agent template system for predefined agent configurations
// TODO: Implement agent capability versioning and compatibility checks

const CreateAgentSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(AgentType),
  capabilities: z.array(z.string()),
  // TODO: Add optional configuration parameter for agent-specific settings
  // TODO: Add optional tags parameter for agent categorization
});

const GetAgentSchema = z.object({
  agentId: z.string().uuid(),
});

const UpdateAgentSchema = z.object({
  agentId: z.string().uuid(),
  name: z.string().optional(),
  status: z.nativeEnum(AgentStatus).optional(),
  capabilities: z.array(z.string()).optional(),
});

const ListAgentsSchema = z.object({
  status: z.nativeEnum(AgentStatus).optional(),
  // TODO: Add pagination support (page, pageSize)
  // TODO: Add sorting options (by createdAt, lastActive, name)
  // TODO: Add filtering by agent type
  // TODO: Add search capability by name or capabilities
});

// TODO: Add dedicated schema for agent health check operations
// TODO: Add schema for batch agent operations

function handleCreateAgent(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = CreateAgentSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const { name, type, capabilities } = parsed.data;
  
  // TODO: Validate agent name uniqueness
  // TODO: Check max agent count limit from config
  // TODO: Validate capabilities against known capability registry
  // TODO: Emit agent creation event for monitoring
  
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
  // TODO: Implement pagination to handle large agent lists
  // TODO: Add sorting by different fields
  // TODO: Include agent statistics in response (task count, success rate)
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
  // TODO: Include agent execution history and metrics in response
  // TODO: Include currently assigned operations
  // TODO: Add agent health status check
  return { content: [{ type: 'text', text: JSON.stringify(agent, null, 2) }] };
}

function handleUpdateAgent(args: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  const parsed = UpdateAgentSchema.safeParse(args);
  if (!parsed.success) {
    return { content: [{ type: 'text', text: `Invalid arguments: ${parsed.error.message}` }] };
  }
  const { agentId, ...updates } = parsed.data;
  // TODO: Validate status transitions (e.g., can't go from FAILED to ACTIVE without intervention)
  // TODO: Emit agent update event for audit trail
  // TODO: Validate capability updates against known capabilities
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
  // TODO: Check if agent is in use by active operations before deleting
  // TODO: Implement soft delete with archival instead of hard delete
  // TODO: Clean up agent-related data (findings, assignments)
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
  // TODO: Add pre-activation validation checks (capabilities available, resources allocated)
  // TODO: Implement agent warmup/initialization process
  // TODO: Send activation notification/webhook
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

// TODO: Add handleDeactivateAgent for graceful agent shutdown
// TODO: Add handleGetAgentMetrics for performance monitoring
// TODO: Add handleGetAgentLogs for troubleshooting
// TODO: Add handleCloneAgent to duplicate agent configurations
// TODO: Add handleBulkUpdateAgents for batch operations

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

export function registerAgentTools(server: Server): void {
}
