export type NodeType = 'Local' | 'Edge' | 'Regional Cloud' | 'Green Cloud' | 'High-Perf Cloud';

export type TaskType = 'Reasoning' | 'Classification' | 'Extraction' | 'Creative' | 'Code Generation' | 'Summarization';

export interface PriorityWeights {
  latency: number;   // w_L
  cost: number;      // w_$
  energy: number;    // w_E
  carbon: number;    // w_C
  accuracy: number;  // w_A
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  priority_weights: PriorityWeights;
  created_at: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  workflow_id: string;
  name: string;
  task_type: TaskType;
  min_accuracy: number;     // 1 - 100
  max_latency_ms: number;   // ms SLA
  max_budget: number;       // $ max allowable per run
  can_delay: boolean;       // whether this task allows time-shifting
  step_order: number;
  input_token_est?: number;
  output_token_est?: number;
}

export interface InfrastructureNode {
  id: string;
  name: string;
  region_name: string;
  node_type: NodeType;
  carbon_intensity: number;  // gCO2/kWh
  energy_cost_kwh: number;   // $ / kWh
  latency_penalty_ms: number;// network latency overhead
  cpu_util: number;          // % 0-100
  gpu_util: number;          // % 0-100
  renewable_pct: number;     // % 0-100
  coordinates?: { lat: number; lng: number };
  status: 'online' | 'degraded' | 'maintenance';
}

export interface LLMModel {
  id: string;
  model_name: string;
  provider: string;
  parameter_size: string;
  quality_score: number;          // 1 - 100
  avg_latency_ms: number;         // execution time
  cost_per_1k_tokens: number;     // $
  energy_per_1k_tokens_wh: number;// Wh per 1k tokens
}

export interface TimeShiftOption {
  hour_offset: number;
  target_time: string;
  carbon_intensity: number;
  carbon_reduction_pct: number;
  recommended: boolean;
  reason: string;
}

export interface CandidateEvaluation {
  node: InfrastructureNode;
  model: LLMModel;
  total_latency_ms: number;
  estimated_cost: number;
  estimated_energy_wh: number;
  estimated_carbon_g: number;
  accuracy: number;
  
  // Normalized values (0 - 1)
  norm_latency: number;
  norm_cost: number;
  norm_energy: number;
  norm_carbon: number;
  norm_accuracy: number;
  
  penalty_score: number;
  violates_constraints: boolean;
  violations: string[];
}

export interface SchedulingDecision {
  id: string;
  task_id: string;
  workflow_id?: string;
  selected_node_id: string;
  selected_model_id: string;
  scheduled_time: string;
  expected_latency: number;
  expected_cost: number;
  expected_carbon: number;
  expected_energy: number;
  score: number;
  reasoning_text: string;
  
  // Comparative Baseline (High-Perf Cloud + Largest Model)
  baseline_latency: number;
  baseline_cost: number;
  baseline_carbon: number;
  baseline_energy: number;
  
  // Reductions
  carbon_saved_pct: number;
  cost_saved_pct: number;
  energy_saved_pct: number;
  latency_delta_pct: number;
  
  // Time-shifting metadata
  time_shifted: boolean;
  time_shift_recommendation?: TimeShiftOption;
  all_candidates?: CandidateEvaluation[];
}

export interface HourlyForecast {
  hour_offset: number;
  time_label: string;
  carbon_intensity: number; // gCO2/kWh
  renewable_pct: number;
  solar_mw: number;
  wind_mw: number;
}

export type ScenarioPreset = 
  | 'emergency'
  | 'legal'
  | 'green_batch'
  | 'startup'
  | 'overnight';

export interface ScenarioDefinition {
  id: ScenarioPreset;
  name: string;
  subtitle: string;
  icon: string;
  weights: PriorityWeights;
  description: string;
}
