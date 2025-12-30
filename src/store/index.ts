import { Agent, Operation, Target, Finding } from '../types/index.js';

class DataStore {
  private agents: Map<string, Agent> = new Map();
  private operations: Map<string, Operation> = new Map();
  private targets: Map<string, Target> = new Map();
  private findings: Map<string, Finding> = new Map();

  // Agent methods
  addAgent(agent: Agent): void {
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
    if (agent) {
      const updated = { ...agent, ...updates };
      this.agents.set(id, updated);
      return updated;
    }
    return undefined;
  }

  deleteAgent(id: string): boolean {
    return this.agents.delete(id);
  }

  // Operation methods
  addOperation(operation: Operation): void {
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
    if (operation) {
      const updated = { ...operation, ...updates };
      this.operations.set(id, updated);
      return updated;
    }
    return undefined;
  }

  deleteOperation(id: string): boolean {
    return this.operations.delete(id);
  }

  // Target methods
  addTarget(target: Target): void {
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
    if (target) {
      const updated = { ...target, ...updates };
      this.targets.set(id, updated);
      return updated;
    }
    return undefined;
  }

  deleteTarget(id: string): boolean {
    return this.targets.delete(id);
  }

  // Finding methods
  addFinding(finding: Finding): void {
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
