// Maximum limits to prevent DoS attacks
const MAX_AGENTS = 1000;
const MAX_OPERATIONS = 1000;
const MAX_TARGETS = 10000;
const MAX_FINDINGS = 100000;
class DataStore {
    agents = new Map();
    operations = new Map();
    targets = new Map();
    findings = new Map();
    // Agent methods
    addAgent(agent) {
        if (this.agents.size >= MAX_AGENTS) {
            throw new Error(`Maximum number of agents (${MAX_AGENTS}) reached`);
        }
        if (this.agents.has(agent.id)) {
            throw new Error(`Agent with id ${agent.id} already exists`);
        }
        this.agents.set(agent.id, agent);
    }
    getAgent(id) {
        return this.agents.get(id);
    }
    getAllAgents() {
        return Array.from(this.agents.values());
    }
    updateAgent(id, updates) {
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
    deleteAgent(id) {
        return this.agents.delete(id);
    }
    // Operation methods
    addOperation(operation) {
        if (this.operations.size >= MAX_OPERATIONS) {
            throw new Error(`Maximum number of operations (${MAX_OPERATIONS}) reached`);
        }
        if (this.operations.has(operation.id)) {
            throw new Error(`Operation with id ${operation.id} already exists`);
        }
        this.operations.set(operation.id, operation);
    }
    getOperation(id) {
        return this.operations.get(id);
    }
    getAllOperations() {
        return Array.from(this.operations.values());
    }
    updateOperation(id, updates) {
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
    deleteOperation(id) {
        return this.operations.delete(id);
    }
    // Target methods
    addTarget(target) {
        if (this.targets.size >= MAX_TARGETS) {
            throw new Error(`Maximum number of targets (${MAX_TARGETS}) reached`);
        }
        if (this.targets.has(target.id)) {
            throw new Error(`Target with id ${target.id} already exists`);
        }
        this.targets.set(target.id, target);
    }
    getTarget(id) {
        return this.targets.get(id);
    }
    getAllTargets() {
        return Array.from(this.targets.values());
    }
    updateTarget(id, updates) {
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
    deleteTarget(id) {
        return this.targets.delete(id);
    }
    // Finding methods
    addFinding(finding) {
        if (this.findings.size >= MAX_FINDINGS) {
            throw new Error(`Maximum number of findings (${MAX_FINDINGS}) reached`);
        }
        if (this.findings.has(finding.id)) {
            throw new Error(`Finding with id ${finding.id} already exists`);
        }
        this.findings.set(finding.id, finding);
    }
    getFinding(id) {
        return this.findings.get(id);
    }
    getAllFindings() {
        return Array.from(this.findings.values());
    }
    getFindingsByOperation(operationId) {
        return Array.from(this.findings.values()).filter((f) => f.operationId === operationId);
    }
    getFindingsByAgent(agentId) {
        return Array.from(this.findings.values()).filter((f) => f.agentId === agentId);
    }
}
export const store = new DataStore();
//# sourceMappingURL=index.js.map