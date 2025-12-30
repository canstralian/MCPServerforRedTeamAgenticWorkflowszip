import { Agent, Operation, Target, Finding } from '../types/index.js';

// Maximum limits to prevent DoS attacks
const MAX_AGENTS = 1000;
const MAX_OPERATIONS = 1000;
const MAX_TARGETS = 10000;
const MAX_FINDINGS = 100000;

class DataStore {
  private agents: Map<string, Agent> = new Map();
  private operations: Map<string, Operation> = new Map();
  private targets: Map<string, Target> = new Map();
  private findings: Map<string, Finding> = new Map();

  // Agent methods
  addAgent(agent: Agent): void {
    if (this.agents.size >= MAX_AGENTS) {
      throw new Error(`Maximum number of agents (${MAX_AGENTS}) reached`);
    }
    if (this.agents.has(agent.id)) {
      throw new Error(`Agent with id ${agent.id} already exists`);
    }
    this.agents.set(agent.id, agent);
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  updateAgent(id: string, updates: Partial<Agent>): Agent | undefined {
    const agent = this.agents.get(id);
    if (!agent) {
      return undefined;
    }
    // Prevent updating the id
    if (updates.id && updates.id !== id) {
      throw new Error('Cannot update agent id');
    }
    const updated = { ...agent, ...updates, id };
    this.agents.set(id, updated);
    return updated;
  }

  deleteAgent(id: string): boolean {
    return this.agents.delete(id);
  }

  // Operation methods
  addOperation(operation: Operation): void {
    if (this.operations.size >= MAX_OPERATIONS) {
      throw new Error(`Maximum number of operations (${MAX_OPERATIONS}) reached`);
    }
    if (this.operations.has(operation.id)) {
      throw new Error(`Operation with id ${operation.id} already exists`);
    }
    this.operations.set(operation.id, operation);
  }

  getOperation(id: string): Operation | undefined {
    return this.operations.get(id);
  }

  getAllOperations(): Operation[] {
    return Array.from(this.operations.values());
  }

  updateOperation(id: string, updates: Partial<Operation>): Operation | undefined {
    const operation = this.operations.get(id);
    if (!operation) {
      return undefined;
    }
    // Prevent updating the id
    if (updates.id && updates.id !== id) {
      throw new Error('Cannot update operation id');
    }
    const updated = { ...operation, ...updates, id };
    this.operations.set(id, updated);
    return updated;
  }

  deleteOperation(id: string): boolean {
    return this.operations.delete(id);
  }

  // Target methods
  addTarget(target: Target): void {
    if (this.targets.size >= MAX_TARGETS) {
      throw new Error(`Maximum number of targets (${MAX_TARGETS}) reached`);
    }
    if (this.targets.has(target.id)) {
      throw new Error(`Target with id ${target.id} already exists`);
    }
    this.targets.set(target.id, target);
  }

  getTarget(id: string): Target | undefined {
    return this.targets.get(id);
  }

  getAllTargets(): Target[] {
    return Array.from(this.targets.values());
  }

  updateTarget(id: string, updates: Partial<Target>): Target | undefined {
    const target = this.targets.get(id);
    if (!target) {
      return undefined;
    }
    // Prevent updating the id
    if (updates.id && updates.id !== id) {
      throw new Error('Cannot update target id');
    }
    const updated = { ...target, ...updates, id };
    this.targets.set(id, updated);
    return updated;
  }

  deleteTarget(id: string): boolean {
    return this.targets.delete(id);
  }

  // Finding methods
  addFinding(finding: Finding): void {
    if (this.findings.size >= MAX_FINDINGS) {
      throw new Error(`Maximum number of findings (${MAX_FINDINGS}) reached`);
    }
    if (this.findings.has(finding.id)) {
      throw new Error(`Finding with id ${finding.id} already exists`);
    }
    this.findings.set(finding.id, finding);
  }

  getFinding(id: string): Finding | undefined {
    return this.findings.get(id);
  }

  getAllFindings(): Finding[] {
    return Array.from(this.findings.values());
  }

  getFindingsByOperation(operationId: string): Finding[] {
    return Array.from(this.findings.values()).filter(
      (f) => f.operationId === operationId
    );
  }

  getFindingsByAgent(agentId: string): Finding[] {
    return Array.from(this.findings.values()).filter(
      (f) => f.agentId === agentId
    );
  }
}

export const store = new DataStore();
