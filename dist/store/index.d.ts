import { Agent, Operation, Target, Finding } from '../types/index.js';
declare class DataStore {
    private agents;
    private operations;
    private targets;
    private findings;
    addAgent(agent: Agent): void;
    getAgent(id: string): Agent | undefined;
    getAllAgents(): Agent[];
    updateAgent(id: string, updates: Partial<Agent>): Agent | undefined;
    deleteAgent(id: string): boolean;
    addOperation(operation: Operation): void;
    getOperation(id: string): Operation | undefined;
    getAllOperations(): Operation[];
    updateOperation(id: string, updates: Partial<Operation>): Operation | undefined;
    deleteOperation(id: string): boolean;
    addTarget(target: Target): void;
    getTarget(id: string): Target | undefined;
    getAllTargets(): Target[];
    updateTarget(id: string, updates: Partial<Target>): Target | undefined;
    deleteTarget(id: string): boolean;
    addFinding(finding: Finding): void;
    getFinding(id: string): Finding | undefined;
    getAllFindings(): Finding[];
    getFindingsByOperation(operationId: string): Finding[];
    getFindingsByAgent(agentId: string): Finding[];
}
export declare const store: DataStore;
export {};
//# sourceMappingURL=index.d.ts.map