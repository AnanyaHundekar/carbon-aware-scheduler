import {
  Workflow,
  Task,
  InfrastructureNode,
  LLMModel,
  SchedulingDecision,
  HourlyForecast
} from '../types';
import {
  SEEDED_WORKFLOWS,
  SEEDED_NODES,
  SEEDED_MODELS,
  HOURLY_FORECASTS,
  HISTORICAL_RUNS
} from './seedData';

const STORAGE_KEYS = {
  WORKFLOWS: 'ecoflow_workflows_v1',
  NODES: 'ecoflow_nodes_v1',
  MODELS: 'ecoflow_models_v1',
  DECISIONS: 'ecoflow_decisions_v1',
  HISTORY: 'ecoflow_history_v1',
  FORECASTS: 'ecoflow_forecasts_v1',
};

class DatabaseService {
  private workflows: Workflow[] = [];
  private nodes: InfrastructureNode[] = [];
  private models: LLMModel[] = [];
  private decisions: SchedulingDecision[] = [];
  private history: any[] = [];
  private forecasts: HourlyForecast[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedWf = localStorage.getItem(STORAGE_KEYS.WORKFLOWS);
      const savedNodes = localStorage.getItem(STORAGE_KEYS.NODES);
      const savedModels = localStorage.getItem(STORAGE_KEYS.MODELS);
      const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);

      this.workflows = savedWf ? JSON.parse(savedWf) : JSON.parse(JSON.stringify(SEEDED_WORKFLOWS));
      this.nodes = savedNodes ? JSON.parse(savedNodes) : JSON.parse(JSON.stringify(SEEDED_NODES));
      this.models = savedModels ? JSON.parse(savedModels) : JSON.parse(JSON.stringify(SEEDED_MODELS));
      this.history = savedHistory ? JSON.parse(savedHistory) : JSON.parse(JSON.stringify(HISTORICAL_RUNS));
      this.forecasts = JSON.parse(JSON.stringify(HOURLY_FORECASTS));
    } catch (e) {
      console.warn('Error accessing localStorage, falling back to in-memory state:', e);
      this.workflows = JSON.parse(JSON.stringify(SEEDED_WORKFLOWS));
      this.nodes = JSON.parse(JSON.stringify(SEEDED_NODES));
      this.models = JSON.parse(JSON.stringify(SEEDED_MODELS));
      this.history = JSON.parse(JSON.stringify(HISTORICAL_RUNS));
      this.forecasts = JSON.parse(JSON.stringify(HOURLY_FORECASTS));
    }
  }

  public resetAllToDefault() {
    localStorage.removeItem(STORAGE_KEYS.WORKFLOWS);
    localStorage.removeItem(STORAGE_KEYS.NODES);
    localStorage.removeItem(STORAGE_KEYS.MODELS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    this.init();
  }

  private persist(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to persist to localStorage', e);
    }
  }

  // Workflows & Tasks
  public getWorkflows(): Workflow[] {
    return this.workflows;
  }

  public getWorkflowById(id: string): Workflow | undefined {
    return this.workflows.find(w => w.id === id);
  }

  public saveWorkflow(wf: Workflow) {
    const idx = this.workflows.findIndex(w => w.id === wf.id);
    if (idx >= 0) {
      this.workflows[idx] = wf;
    } else {
      this.workflows.push(wf);
    }
    this.persist(STORAGE_KEYS.WORKFLOWS, this.workflows);
  }

  public deleteWorkflow(id: string) {
    this.workflows = this.workflows.filter(w => w.id !== id);
    this.persist(STORAGE_KEYS.WORKFLOWS, this.workflows);
  }

  public updateWorkflowTasks(workflowId: string, tasks: Task[]) {
    const wf = this.getWorkflowById(workflowId);
    if (wf) {
      wf.tasks = tasks;
      this.saveWorkflow(wf);
    }
  }

  // Infrastructure Nodes
  public getNodes(): InfrastructureNode[] {
    return this.nodes;
  }

  public updateNode(nodeId: string, updates: Partial<InfrastructureNode>) {
    const idx = this.nodes.findIndex(n => n.id === nodeId);
    if (idx >= 0) {
      this.nodes[idx] = { ...this.nodes[idx], ...updates };
      this.persist(STORAGE_KEYS.NODES, this.nodes);
    }
  }

  public simulateGridSpike(nodeId?: string) {
    // If a node is passed, spike that node; otherwise spike US-Central or a random cloud node
    const target = nodeId ? this.nodes.find(n => n.id === nodeId) : this.nodes.find(n => n.id === 'node-highperf');
    if (target) {
      target.carbon_intensity = Math.min(650, target.carbon_intensity + 180);
      target.cpu_util = 96;
      target.gpu_util = 98;
      target.renewable_pct = Math.max(5, target.renewable_pct - 15);
      this.persist(STORAGE_KEYS.NODES, this.nodes);
    }
  }

  public normalizeGrid() {
    this.nodes = JSON.parse(JSON.stringify(SEEDED_NODES));
    this.persist(STORAGE_KEYS.NODES, this.nodes);
  }

  // Models
  public getModels(): LLMModel[] {
    return this.models;
  }

  // Forecasts
  public getForecasts(): HourlyForecast[] {
    return this.forecasts;
  }

  // History
  public getHistory(): any[] {
    return this.history;
  }

  public addHistoryRecord(record: any) {
    this.history.unshift(record);
    if (this.history.length > 50) this.history.pop();
    this.persist(STORAGE_KEYS.HISTORY, this.history);
  }
}

export const db = new DatabaseService();
