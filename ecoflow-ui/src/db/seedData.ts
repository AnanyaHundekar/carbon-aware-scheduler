import { InfrastructureNode, LLMModel, Workflow, HourlyForecast, ScenarioDefinition } from '../types';

export const SEEDED_NODES: InfrastructureNode[] = [
  {
    id: 'node-local',
    name: 'San Francisco Local On-Prem',
    region_name: 'US-West (SF Bay On-Premises)',
    node_type: 'Local',
    carbon_intensity: 220, // gCO2/kWh
    energy_cost_kwh: 0.18,
    latency_penalty_ms: 12,
    cpu_util: 42,
    gpu_util: 38,
    renewable_pct: 48,
    coordinates: { lat: 37.7749, lng: -122.4194 },
    status: 'online'
  },
  {
    id: 'node-edge',
    name: 'Frankfurt Edge Microcenter',
    region_name: 'EU-Central (Frankfurt Edge)',
    node_type: 'Edge',
    carbon_intensity: 175,
    energy_cost_kwh: 0.22,
    latency_penalty_ms: 28,
    cpu_util: 54,
    gpu_util: 46,
    renewable_pct: 64,
    coordinates: { lat: 50.1109, lng: 8.6821 },
    status: 'online'
  },
  {
    id: 'node-regional',
    name: 'AWS US-East Data Center',
    region_name: 'US-East (N. Virginia)',
    node_type: 'Regional Cloud',
    carbon_intensity: 360,
    energy_cost_kwh: 0.14,
    latency_penalty_ms: 68,
    cpu_util: 71,
    gpu_util: 68,
    renewable_pct: 22,
    coordinates: { lat: 38.0336, lng: -78.5080 },
    status: 'online'
  },
  {
    id: 'node-green',
    name: 'Nordic Hydro-Solar Green DC',
    region_name: 'EU-North (Luleå, Sweden)',
    node_type: 'Green Cloud',
    carbon_intensity: 38, // ultra green hydro/wind!
    energy_cost_kwh: 0.08,
    latency_penalty_ms: 110,
    cpu_util: 35,
    gpu_util: 40,
    renewable_pct: 98,
    coordinates: { lat: 65.5848, lng: 22.1567 },
    status: 'online'
  },
  {
    id: 'node-highperf',
    name: 'Iowa AI Supercluster (H100)',
    region_name: 'US-Central (Council Bluffs)',
    node_type: 'High-Perf Cloud',
    carbon_intensity: 460, // fossil/coal intensive grid
    energy_cost_kwh: 0.28,
    latency_penalty_ms: 45,
    cpu_util: 88,
    gpu_util: 94,
    renewable_pct: 16,
    coordinates: { lat: 41.2619, lng: -95.8608 },
    status: 'online'
  }
];

export const SEEDED_MODELS: LLMModel[] = [
  {
    id: 'model-nano',
    model_name: 'Eco-Nano 3B Instruct',
    provider: 'OpenWeights / Local',
    parameter_size: '3B',
    quality_score: 74,
    avg_latency_ms: 95,
    cost_per_1k_tokens: 0.00018,
    energy_per_1k_tokens_wh: 0.15
  },
  {
    id: 'model-small',
    model_name: 'Fast-Instruct 8B Flash',
    provider: 'Mistral / Meta',
    parameter_size: '8B',
    quality_score: 85,
    avg_latency_ms: 180,
    cost_per_1k_tokens: 0.00065,
    energy_per_1k_tokens_wh: 0.48
  },
  {
    id: 'model-medium',
    model_name: 'Balanced-Omni 14B Q',
    provider: 'Qwen / Alibaba',
    parameter_size: '14B',
    quality_score: 91,
    avg_latency_ms: 360,
    cost_per_1k_tokens: 0.0019,
    energy_per_1k_tokens_wh: 1.15
  },
  {
    id: 'model-large',
    model_name: 'DeepReason 70B Pro',
    provider: 'Anthropic / Meta',
    parameter_size: '70B',
    quality_score: 96,
    avg_latency_ms: 880,
    cost_per_1k_tokens: 0.0085,
    energy_per_1k_tokens_wh: 5.20
  },
  {
    id: 'model-flagship',
    model_name: 'Apex-Ultra MoE Heavy',
    provider: 'OpenAI / Google',
    parameter_size: '400B+',
    quality_score: 99,
    avg_latency_ms: 1520,
    cost_per_1k_tokens: 0.0280,
    energy_per_1k_tokens_wh: 14.80
  }
];

// Baseline Default Heavy Model: High-Perf Cloud + Apex-Ultra
export const BASELINE_NODE_ID = 'node-highperf';
export const BASELINE_MODEL_ID = 'model-flagship';

export const SEEDED_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-logistics',
    name: 'Autonomous Logistics & Dispatch AI',
    description: 'Real-time routing, intent parsing, and scheduled delivery updates for multi-modal transport fleet.',
    priority_weights: {
      latency: 0.35,
      cost: 0.15,
      energy: 0.15,
      carbon: 0.25,
      accuracy: 0.10
    },
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    tasks: [
      {
        id: 'task-log-1',
        workflow_id: 'wf-logistics',
        name: 'Delivery Manifest Parsing',
        task_type: 'Extraction',
        min_accuracy: 78,
        max_latency_ms: 600,
        max_budget: 0.008,
        can_delay: false,
        step_order: 1,
        input_token_est: 1200,
        output_token_est: 350
      },
      {
        id: 'task-log-2',
        workflow_id: 'wf-logistics',
        name: 'Urgency & Intent Classification',
        task_type: 'Classification',
        min_accuracy: 84,
        max_latency_ms: 850,
        max_budget: 0.012,
        can_delay: false,
        step_order: 2,
        input_token_est: 850,
        output_token_est: 220
      },
      {
        id: 'task-log-3',
        workflow_id: 'wf-logistics',
        name: 'Fleet Path & Multi-Stop Optimization',
        task_type: 'Reasoning',
        min_accuracy: 90,
        max_latency_ms: 4500,
        max_budget: 0.045,
        can_delay: true, // Eligible for Carbon Time-Shifting!
        step_order: 3,
        input_token_est: 3400,
        output_token_est: 1600
      },
      {
        id: 'task-log-4',
        workflow_id: 'wf-logistics',
        name: 'Localized Driver Delivery Briefing',
        task_type: 'Summarization',
        min_accuracy: 76,
        max_latency_ms: 1200,
        max_budget: 0.005,
        can_delay: false,
        step_order: 4,
        input_token_est: 1400,
        output_token_est: 400
      }
    ]
  },
  {
    id: 'wf-legal',
    name: 'Enterprise Contract Risk Auditor',
    description: 'Deep compliance verification across master service agreements, liability limits, and indemnity clauses.',
    priority_weights: {
      latency: 0.10,
      cost: 0.15,
      energy: 0.15,
      carbon: 0.20,
      accuracy: 0.40
    },
    created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    tasks: [
      {
        id: 'task-leg-1',
        workflow_id: 'wf-legal',
        name: 'Clause Boundary Segmentation',
        task_type: 'Extraction',
        min_accuracy: 88,
        max_latency_ms: 1500,
        max_budget: 0.015,
        can_delay: false,
        step_order: 1,
        input_token_est: 2200,
        output_token_est: 600
      },
      {
        id: 'task-leg-2',
        workflow_id: 'wf-legal',
        name: 'Liability Risk & Compliance Assessment',
        task_type: 'Reasoning',
        min_accuracy: 96,
        max_latency_ms: 5000,
        max_budget: 0.060,
        can_delay: true,
        step_order: 2,
        input_token_est: 4500,
        output_token_est: 1800
      },
      {
        id: 'task-leg-3',
        workflow_id: 'wf-legal',
        name: 'General Counsel Risk Summary',
        task_type: 'Summarization',
        min_accuracy: 92,
        max_latency_ms: 2200,
        max_budget: 0.025,
        can_delay: false,
        step_order: 3,
        input_token_est: 2800,
        output_token_est: 850
      }
    ]
  },
  {
    id: 'wf-batch',
    name: 'Overnight Financial Reconciliation',
    description: 'High-volume batch auditing of daily ledger balance transfers with zero human intervention required.',
    priority_weights: {
      latency: 0.05,
      cost: 0.25,
      energy: 0.20,
      carbon: 0.45,
      accuracy: 0.05
    },
    created_at: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
    tasks: [
      {
        id: 'task-bat-1',
        workflow_id: 'wf-batch',
        name: 'Transaction Schema Normalization',
        task_type: 'Code Generation',
        min_accuracy: 82,
        max_latency_ms: 8000,
        max_budget: 0.010,
        can_delay: true,
        step_order: 1,
        input_token_est: 1800,
        output_token_est: 500
      },
      {
        id: 'task-bat-2',
        workflow_id: 'wf-batch',
        name: 'Cross-Border Fraud Vector Scoring',
        task_type: 'Reasoning',
        min_accuracy: 93,
        max_latency_ms: 12000,
        max_budget: 0.035,
        can_delay: true,
        step_order: 2,
        input_token_est: 3900,
        output_token_est: 1400
      }
    ]
  }
];

export const HOURLY_FORECASTS: HourlyForecast[] = [
  { hour_offset: 0, time_label: 'Now (+0h)', carbon_intensity: 240, renewable_pct: 42, solar_mw: 120, wind_mw: 280 },
  { hour_offset: 1, time_label: '+1h', carbon_intensity: 228, renewable_pct: 46, solar_mw: 240, wind_mw: 290 },
  { hour_offset: 2, time_label: '+2h', carbon_intensity: 195, renewable_pct: 54, solar_mw: 480, wind_mw: 310 },
  { hour_offset: 3, time_label: '+3h (Solar Peak)', carbon_intensity: 135, renewable_pct: 72, solar_mw: 820, wind_mw: 340 },
  { hour_offset: 4, time_label: '+4h (Lowest Carbon)', carbon_intensity: 112, renewable_pct: 81, solar_mw: 950, wind_mw: 380 },
  { hour_offset: 5, time_label: '+5h', carbon_intensity: 128, renewable_pct: 75, solar_mw: 890, wind_mw: 370 },
  { hour_offset: 6, time_label: '+6h', carbon_intensity: 165, renewable_pct: 64, solar_mw: 640, wind_mw: 330 },
  { hour_offset: 7, time_label: '+7h', carbon_intensity: 210, renewable_pct: 51, solar_mw: 320, wind_mw: 300 },
  { hour_offset: 8, time_label: '+8h (Evening Peak)', carbon_intensity: 310, renewable_pct: 28, solar_mw: 40, wind_mw: 260 },
  { hour_offset: 9, time_label: '+9h', carbon_intensity: 335, renewable_pct: 24, solar_mw: 0, wind_mw: 270 },
  { hour_offset: 10, time_label: '+10h (Night Wind)', carbon_intensity: 265, renewable_pct: 40, solar_mw: 0, wind_mw: 390 },
  { hour_offset: 11, time_label: '+11h (Night Wind)', carbon_intensity: 220, renewable_pct: 52, solar_mw: 0, wind_mw: 450 },
];

export const SCENARIO_PRESETS: ScenarioDefinition[] = [
  {
    id: 'emergency',
    name: 'Emergency AI Task',
    subtitle: 'High Speed Priority',
    icon: 'Zap',
    weights: { latency: 0.80, cost: 0.05, energy: 0.05, carbon: 0.05, accuracy: 0.05 },
    description: 'Fastest turnaround path. Prioritizes edge/local nodes with low network latency and snappy models.'
  },
  {
    id: 'legal',
    name: 'High Accuracy Legal Task',
    subtitle: 'High Quality Priority',
    icon: 'Scale',
    weights: { latency: 0.10, cost: 0.05, energy: 0.05, carbon: 0.10, accuracy: 0.70 },
    description: 'Requires strict accuracy thresholds (>95%). Selects larger reasoning models while seeking clean energy.'
  },
  {
    id: 'green_batch',
    name: 'Green Computing Batch',
    subtitle: 'High Carbon Priority',
    icon: 'Leaf',
    weights: { latency: 0.05, cost: 0.10, energy: 0.15, carbon: 0.65, accuracy: 0.05 },
    description: 'Max Eco mode. Routes to 98% renewable hydro/solar data centers with optimized parameter models.'
  },
  {
    id: 'startup',
    name: 'Budget-Constrained Startup',
    subtitle: 'High Cost Priority',
    icon: 'Coins',
    weights: { latency: 0.15, cost: 0.65, energy: 0.10, carbon: 0.05, accuracy: 0.05 },
    description: 'Lowest API token costs and energy expenditure while adhering to baseline SLAs.'
  },
  {
    id: 'overnight',
    name: 'Flexible Overnight Processing',
    subtitle: 'Time-Shifting Priority',
    icon: 'Clock',
    weights: { latency: 0.05, cost: 0.20, energy: 0.20, carbon: 0.50, accuracy: 0.05 },
    description: 'Takes full advantage of the 12-hour grid forecast to schedule batch jobs at maximum clean energy surges.'
  }
];

export const HISTORICAL_RUNS = [
  {
    id: 'run-894',
    workflow_name: 'Autonomous Logistics & Dispatch AI',
    timestamp: '10 mins ago',
    node_name: 'Nordic Hydro-Solar Green DC',
    model_name: 'Balanced-Omni 14B Q',
    carbon_saved_pct: 68.4,
    cost_saved_pct: 54.2,
    latency_ms: 470,
    status: 'Completed',
    scenario: 'Green Computing Batch'
  },
  {
    id: 'run-893',
    workflow_name: 'Enterprise Contract Risk Auditor',
    timestamp: '25 mins ago',
    node_name: 'Nordic Hydro-Solar Green DC',
    model_name: 'DeepReason 70B Pro',
    carbon_saved_pct: 61.2,
    cost_saved_pct: 38.0,
    latency_ms: 990,
    status: 'Completed',
    scenario: 'High Accuracy Legal Task'
  },
  {
    id: 'run-892',
    workflow_name: 'Autonomous Logistics & Dispatch AI',
    timestamp: '42 mins ago',
    node_name: 'Frankfurt Edge Microcenter',
    model_name: 'Fast-Instruct 8B Flash',
    carbon_saved_pct: 49.5,
    cost_saved_pct: 71.0,
    latency_ms: 208,
    status: 'Completed',
    scenario: 'Emergency AI Task'
  },
  {
    id: 'run-891',
    workflow_name: 'Overnight Financial Reconciliation',
    timestamp: '2 hours ago',
    node_name: 'Nordic Hydro-Solar Green DC',
    model_name: 'Fast-Instruct 8B Flash',
    carbon_saved_pct: 82.6,
    cost_saved_pct: 85.3,
    latency_ms: 1250,
    status: 'Time-Shifted (+4h)',
    scenario: 'Flexible Overnight Processing'
  },
  {
    id: 'run-890',
    workflow_name: 'Autonomous Logistics & Dispatch AI',
    timestamp: '3 hours ago',
    node_name: 'San Francisco Local On-Prem',
    model_name: 'Eco-Nano 3B Instruct',
    carbon_saved_pct: 52.1,
    cost_saved_pct: 78.4,
    latency_ms: 107,
    status: 'Completed',
    scenario: 'Budget-Constrained Startup'
  }
];
