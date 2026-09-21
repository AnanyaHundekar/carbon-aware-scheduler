import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Workflow,
  Task,
  InfrastructureNode,
  LLMModel,
  HourlyForecast,
  PriorityWeights,
  SchedulingDecision,
  ScenarioPreset,
  ScenarioDefinition
} from '../types';
import { db } from '../db/databaseService';
import { SCENARIO_PRESETS, BASELINE_NODE_ID, BASELINE_MODEL_ID } from '../db/seedData';
import { evaluateTaskSchedule } from '../engine/scheduler';
import confetti from 'canvas-confetti';

export type AppTab = 
  | 'landing'
  | 'dashboard'
  | 'builder'
  | 'results'
  | 'simulator'
  | 'infrastructure'
  | 'analytics'
  | 'history';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  
  // Data
  workflows: Workflow[];
  activeWorkflowId: string;
  setActiveWorkflowId: (id: string) => void;
  activeWorkflow: Workflow | undefined;
  nodes: InfrastructureNode[];
  models: LLMModel[];
  forecasts: HourlyForecast[];
  history: any[];
  
  // Green vs Greed Global Slider (0 = 100% Speed, 100 = 100% Eco)
  greenGreedValue: number;
  setGreenGreedValue: (val: number) => void;
  customWeights: PriorityWeights;
  setCustomWeights: (w: PriorityWeights) => void;
  
  // Scenarios
  activeScenario: ScenarioPreset | null;
  applyScenario: (preset: ScenarioPreset) => void;
  clearScenario: () => void;
  
  // Time-shifting & Quota
  applyTimeShift: boolean;
  setApplyTimeShift: (apply: boolean) => void;
  carbonQuotaDaily: number;
  carbonUsedDaily: number;
  isBudgetModalOpen: boolean;
  setIsBudgetModalOpen: (open: boolean) => void;
  
  // Decisions for active workflow
  taskDecisions: Map<string, SchedulingDecision>;
  aggregateMetrics: {
    totalLatency: number;
    totalCost: number;
    totalCarbon: number;
    totalEnergy: number;
    baselineCarbon: number;
    baselineCost: number;
    baselineLatency: number;
    baselineEnergy: number;
    carbonSavedPct: number;
    costSavedPct: number;
    energySavedPct: number;
  };
  
  // Actions
  updateWorkflowTasks: (tasks: Task[]) => void;
  addWorkflow: (wf: Workflow) => void;
  deleteWorkflow: (id: string) => void;
  triggerGridSpike: (nodeId?: string) => void;
  normalizeGrid: () => void;
  executeWorkflow: () => void;
  
  // 2-Minute Demo
  isDemoActive: boolean;
  demoStep: number;
  startDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  exitDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to interpolate weights from Green vs Greed slider (0 - 100)
function calculateWeightsFromSlider(sliderVal: number): PriorityWeights {
  const ecoFactor = sliderVal / 100; // 0 (greed) to 1 (green)
  
  // Greed: high speed/latency, low carbon
  // Green: high carbon & energy, lower latency priority
  const latency = Number((0.75 * (1 - ecoFactor) + 0.05 * ecoFactor).toFixed(2));
  const carbon = Number((0.05 * (1 - ecoFactor) + 0.70 * ecoFactor).toFixed(2));
  const energy = Number((0.05 * (1 - ecoFactor) + 0.15 * ecoFactor).toFixed(2));
  const cost = Number((0.10 * (1 - ecoFactor) + 0.05 * ecoFactor).toFixed(2));
  const accuracy = 0.10; // fixed minimum baseline weight

  // Normalize sum to 1.0
  const sum = latency + carbon + energy + cost + accuracy;
  return {
    latency: Number((latency / sum).toFixed(2)),
    carbon: Number((carbon / sum).toFixed(2)),
    energy: Number((energy / sum).toFixed(2)),
    cost: Number((cost / sum).toFixed(2)),
    accuracy: Number((accuracy / sum).toFixed(2))
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<AppTab>('landing');
  
  // Entities
  const [workflows, setWorkflows] = useState<Workflow[]>(() => db.getWorkflows());
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>('wf-logistics');
  const [nodes, setNodes] = useState<InfrastructureNode[]>(() => db.getNodes());
  const [models] = useState<LLMModel[]>(() => db.getModels());
  const [forecasts] = useState<HourlyForecast[]>(() => db.getForecasts());
  const [history, setHistory] = useState<any[]>(() => db.getHistory());
  
  // Green vs Greed Slider (50 = balanced)
  const [greenGreedValue, setGreenGreedValueState] = useState<number>(65);
  const [customWeights, setCustomWeights] = useState<PriorityWeights>(() => calculateWeightsFromSlider(65));
  const [activeScenario, setActiveScenario] = useState<ScenarioPreset | null>(null);
  
  // Time-shifting and Budget
  const [applyTimeShift, setApplyTimeShift] = useState<boolean>(true);
  const [carbonQuotaDaily] = useState<number>(50.0); // 50g daily target
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  
  // 2-Minute Demo
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setGreenGreedValue = (val: number) => {
    setGreenGreedValueState(val);
    setActiveScenario(null);
    setCustomWeights(calculateWeightsFromSlider(val));
  };

  const applyScenario = (preset: ScenarioPreset) => {
    setActiveScenario(preset);
    const def = SCENARIO_PRESETS.find(s => s.id === preset);
    if (def) {
      setCustomWeights(def.weights);
      // approximate slider position
      if (preset === 'emergency') setGreenGreedValueState(10);
      else if (preset === 'green_batch') setGreenGreedValueState(95);
      else if (preset === 'overnight') setGreenGreedValueState(85);
      else if (preset === 'startup') setGreenGreedValueState(30);
      else setGreenGreedValueState(50);
    }
  };

  const clearScenario = () => {
    setActiveScenario(null);
    setCustomWeights(calculateWeightsFromSlider(greenGreedValue));
  };

  const activeWorkflow = useMemo(() => {
    return workflows.find(w => w.id === activeWorkflowId) || workflows[0];
  }, [workflows, activeWorkflowId]);

  // Compute decisions for active workflow in real time
  const taskDecisions = useMemo(() => {
    const decisions = new Map<string, SchedulingDecision>();
    if (!activeWorkflow || !activeWorkflow.tasks) return decisions;

    for (const task of activeWorkflow.tasks) {
      const decision = evaluateTaskSchedule({
        nodes,
        models,
        task,
        weights: customWeights,
        forecasts,
        applyTimeShift
      });
      decisions.set(task.id, decision);
    }
    return decisions;
  }, [activeWorkflow, nodes, models, customWeights, forecasts, applyTimeShift]);

  // Aggregate metrics
  const aggregateMetrics = useMemo(() => {
    let totalLatency = 0;
    let totalCost = 0;
    let totalCarbon = 0;
    let totalEnergy = 0;
    let baselineCarbon = 0;
    let baselineCost = 0;
    let baselineLatency = 0;
    let baselineEnergy = 0;

    taskDecisions.forEach(d => {
      totalLatency += d.expected_latency;
      totalCost += d.expected_cost;
      totalCarbon += d.expected_carbon;
      totalEnergy += d.expected_energy;
      baselineCarbon += d.baseline_carbon;
      baselineCost += d.baseline_cost;
      baselineLatency += d.baseline_latency;
      baselineEnergy += d.baseline_energy;
    });

    const carbonSavedPct = baselineCarbon > 0 ? Number((((baselineCarbon - totalCarbon) / baselineCarbon) * 100).toFixed(1)) : 0;
    const costSavedPct = baselineCost > 0 ? Number((((baselineCost - totalCost) / baselineCost) * 100).toFixed(1)) : 0;
    const energySavedPct = baselineEnergy > 0 ? Number((((baselineEnergy - totalEnergy) / baselineEnergy) * 100).toFixed(1)) : 0;

    return {
      totalLatency,
      totalCost: Number(totalCost.toFixed(5)),
      totalCarbon: Number(totalCarbon.toFixed(3)),
      totalEnergy: Number(totalEnergy.toFixed(3)),
      baselineCarbon: Number(baselineCarbon.toFixed(3)),
      baselineCost: Number(baselineCost.toFixed(5)),
      baselineLatency,
      baselineEnergy: Number(baselineEnergy.toFixed(3)),
      carbonSavedPct,
      costSavedPct,
      energySavedPct
    };
  }, [taskDecisions]);

  // Calculate carbon used today
  const carbonUsedDaily = useMemo(() => {
    const baseUsed = 28.5; // gCO2 baseline past runs today
    return Number((baseUsed + aggregateMetrics.totalCarbon).toFixed(2));
  }, [aggregateMetrics.totalCarbon]);

  // Check budget modal trigger if carbon used exceeds quota
  useEffect(() => {
    if (carbonUsedDaily > carbonQuotaDaily) {
      setIsBudgetModalOpen(true);
    }
  }, [carbonUsedDaily, carbonQuotaDaily]);

  const updateWorkflowTasks = (tasks: Task[]) => {
    if (!activeWorkflow) return;
    db.updateWorkflowTasks(activeWorkflow.id, tasks);
    setWorkflows(db.getWorkflows());
  };

  const addWorkflow = (wf: Workflow) => {
    db.saveWorkflow(wf);
    setWorkflows(db.getWorkflows());
    setActiveWorkflowId(wf.id);
  };

  const deleteWorkflow = (id: string) => {
    db.deleteWorkflow(id);
    const updated = db.getWorkflows();
    setWorkflows(updated);
    if (updated.length > 0) setActiveWorkflowId(updated[0].id);
  };

  const triggerGridSpike = (nodeId?: string) => {
    db.simulateGridSpike(nodeId);
    setNodes([...db.getNodes()]);
  };

  const normalizeGrid = () => {
    db.normalizeGrid();
    setNodes([...db.getNodes()]);
  };

  const executeWorkflow = () => {
    if (!activeWorkflow) return;
    const newRecord = {
      id: `run-${Math.floor(1000 + Math.random() * 9000)}`,
      workflow_name: activeWorkflow.name,
      timestamp: 'Just now',
      node_name: taskDecisions.values().next().value?.selected_node_id 
        ? nodes.find(n => n.id === taskDecisions.values().next().value?.selected_node_id)?.name 
        : 'Nordic Hydro-Solar Green DC',
      model_name: taskDecisions.values().next().value?.selected_model_id
        ? models.find(m => m.id === taskDecisions.values().next().value?.selected_model_id)?.model_name
        : 'Balanced-Omni 14B Q',
      carbon_saved_pct: aggregateMetrics.carbonSavedPct,
      cost_saved_pct: aggregateMetrics.costSavedPct,
      latency_ms: aggregateMetrics.totalLatency,
      status: applyTimeShift ? 'Time-Shifted' : 'Completed',
      scenario: activeScenario ? SCENARIO_PRESETS.find(s => s.id === activeScenario)?.name : 'Custom Policy'
    };
    db.addHistoryRecord(newRecord);
    setHistory([...db.getHistory()]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E07A5F', '#F2CC8F', '#81B29A']
      });
    } catch (e) {
      // ignore
    }
  };

  // 2-Minute Demo Controls
  const startDemo = () => {
    setIsDemoActive(true);
    setDemoStep(1);
    setActiveWorkflowId('wf-logistics');
    setActiveTab('dashboard');
  };

  const nextDemoStep = () => {
    setDemoStep(prev => {
      const next = prev + 1;
      if (next === 2) {
        setActiveTab('builder');
      } else if (next === 3) {
        setActiveTab('results');
      } else if (next === 4) {
        setActiveTab('simulator');
      } else if (next === 5) {
        setActiveTab('infrastructure');
        triggerGridSpike();
      } else if (next === 6) {
        setActiveTab('results');
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#E07A5F', '#F2CC8F', '#81B29A', '#ffffff']
          });
        } catch (e) {}
      }
      return next;
    });
  };

  const prevDemoStep = () => {
    setDemoStep(prev => Math.max(1, prev - 1));
  };

  const exitDemo = () => {
    setIsDemoActive(false);
    setDemoStep(0);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        workflows,
        activeWorkflowId,
        setActiveWorkflowId,
        activeWorkflow,
        nodes,
        models,
        forecasts,
        history,
        greenGreedValue,
        setGreenGreedValue,
        customWeights,
        setCustomWeights,
        activeScenario,
        applyScenario,
        clearScenario,
        applyTimeShift,
        setApplyTimeShift,
        carbonQuotaDaily,
        carbonUsedDaily,
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        taskDecisions,
        aggregateMetrics,
        updateWorkflowTasks,
        addWorkflow,
        deleteWorkflow,
        triggerGridSpike,
        normalizeGrid,
        executeWorkflow,
        isDemoActive,
        demoStep,
        startDemo,
        nextDemoStep,
        prevDemoStep,
        exitDemo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
