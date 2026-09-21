import {
  InfrastructureNode,
  LLMModel,
  Task,
  PriorityWeights,
  SchedulingDecision,
  CandidateEvaluation,
  HourlyForecast,
  TimeShiftOption
} from '../types';
import { BASELINE_NODE_ID, BASELINE_MODEL_ID, HOURLY_FORECASTS } from '../db/seedData';

export interface SchedulerOptions {
  nodes: InfrastructureNode[];
  models: LLMModel[];
  task: Task;
  weights: PriorityWeights;
  forecasts?: HourlyForecast[];
  applyTimeShift?: boolean;
}

export function evaluateTaskSchedule(options: SchedulerOptions): SchedulingDecision {
  const { nodes, models, task, weights, forecasts = HOURLY_FORECASTS, applyTimeShift = false } = options;

  const totalTokens = (task.input_token_est || 1000) + (task.output_token_est || 300);

  // 1. Generate all Node + Model Candidate Combinations
  const rawCandidates: {
    node: InfrastructureNode;
    model: LLMModel;
    total_latency_ms: number;
    estimated_cost: number;
    estimated_energy_wh: number;
    estimated_carbon_g: number;
    accuracy: number;
    violates_constraints: boolean;
    violations: string[];
  }[] = [];

  for (const node of nodes) {
    for (const model of models) {
      const total_latency = node.latency_penalty_ms + model.avg_latency_ms;
      const energy_wh = (totalTokens / 1000) * model.energy_per_1k_tokens_wh * (1 + (node.cpu_util + node.gpu_util) / 200 * 0.2);
      const carbon_g = (energy_wh / 1000) * node.carbon_intensity;
      const compute_cost = (totalTokens / 1000) * model.cost_per_1k_tokens;
      const infrastructure_cost = (energy_wh / 1000) * node.energy_cost_kwh;
      const estimated_cost = Number((compute_cost + infrastructure_cost).toFixed(6));

      // Hard constraint evaluation
      const violations: string[] = [];
      if (total_latency > task.max_latency_ms) {
        violations.push(`Latency ${total_latency}ms exceeds SLA limit of ${task.max_latency_ms}ms`);
      }
      if (model.quality_score < task.min_accuracy) {
        violations.push(`Model accuracy ${model.quality_score}% is below required ${task.min_accuracy}%`);
      }
      if (estimated_cost > task.max_budget) {
        violations.push(`Cost $${estimated_cost.toFixed(4)} exceeds task budget of $${task.max_budget.toFixed(4)}`);
      }

      rawCandidates.push({
        node,
        model,
        total_latency_ms: total_latency,
        estimated_cost,
        estimated_energy_wh: energy_wh,
        estimated_carbon_g: carbon_g,
        accuracy: model.quality_score,
        violates_constraints: violations.length > 0,
        violations
      });
    }
  }

  // 2. Normalization Bounds (across all candidates)
  const lMin = Math.min(...rawCandidates.map(c => c.total_latency_ms));
  const lMax = Math.max(...rawCandidates.map(c => c.total_latency_ms));
  const cMin = Math.min(...rawCandidates.map(c => c.estimated_cost));
  const cMax = Math.max(...rawCandidates.map(c => c.estimated_cost));
  const eMin = Math.min(...rawCandidates.map(c => c.estimated_energy_wh));
  const eMax = Math.max(...rawCandidates.map(c => c.estimated_energy_wh));
  const co2Min = Math.min(...rawCandidates.map(c => c.estimated_carbon_g));
  const co2Max = Math.max(...rawCandidates.map(c => c.estimated_carbon_g));
  const aMin = Math.min(...rawCandidates.map(c => c.accuracy));
  const aMax = Math.max(...rawCandidates.map(c => c.accuracy));

  // 3. Compute Normalized Metrics and Multi-Objective Penalty Score
  const evaluatedCandidates: CandidateEvaluation[] = rawCandidates.map(c => {
    const norm_latency = lMax === lMin ? 0 : (c.total_latency_ms - lMin) / (lMax - lMin);
    const norm_cost = cMax === cMin ? 0 : (c.estimated_cost - cMin) / (cMax - cMin);
    const norm_energy = eMax === eMin ? 0 : (c.estimated_energy_wh - eMin) / (eMax - eMin);
    const norm_carbon = co2Max === co2Min ? 0 : (c.estimated_carbon_g - co2Min) / (co2Max - co2Min);
    const norm_accuracy = aMax === aMin ? 1 : (c.accuracy - aMin) / (aMax - aMin);

    // Score = (w_L * Latency_norm) + (w_$ * Cost_norm) + (w_E * Energy_norm) + (w_C * Carbon_norm) - (w_A * Accuracy_norm)
    let penalty_score = (
      (weights.latency * norm_latency) +
      (weights.cost * norm_cost) +
      (weights.energy * norm_energy) +
      (weights.carbon * norm_carbon) -
      (weights.accuracy * norm_accuracy)
    );

    // If candidate violates constraints, apply heavy penalty
    if (c.violates_constraints) {
      penalty_score += 100 + (c.violations.length * 20);
    }

    return {
      ...c,
      norm_latency,
      norm_cost,
      norm_energy,
      norm_carbon,
      norm_accuracy,
      penalty_score
    };
  });

  // 4. Select the candidate with the lowest penalty score
  // Prefer candidates that do NOT violate constraints
  const feasibleCandidates = evaluatedCandidates.filter(c => !c.violates_constraints);
  const candidatePool = feasibleCandidates.length > 0 ? feasibleCandidates : evaluatedCandidates;
  
  candidatePool.sort((a, b) => a.penalty_score - b.penalty_score);
  const selected = candidatePool[0];

  // 5. Baseline Evaluation (High-Perf Cloud + Flagship MoE Model)
  const baselineCandidate = evaluatedCandidates.find(
    c => c.node.id === BASELINE_NODE_ID && c.model.id === BASELINE_MODEL_ID
  ) || evaluatedCandidates[evaluatedCandidates.length - 1];

  const bLatency = baselineCandidate.total_latency_ms;
  const bCost = baselineCandidate.estimated_cost;
  const bCarbon = baselineCandidate.estimated_carbon_g;
  const bEnergy = baselineCandidate.estimated_energy_wh;

  const carbon_saved_pct = bCarbon > 0 ? Math.max(0, Number((((bCarbon - selected.estimated_carbon_g) / bCarbon) * 100).toFixed(1))) : 0;
  const cost_saved_pct = bCost > 0 ? Math.max(0, Number((((bCost - selected.estimated_cost) / bCost) * 100).toFixed(1))) : 0;
  const energy_saved_pct = bEnergy > 0 ? Math.max(0, Number((((bEnergy - selected.estimated_energy_wh) / bEnergy) * 100).toFixed(1))) : 0;
  const latency_delta_pct = bLatency > 0 ? Number((((bLatency - selected.total_latency_ms) / bLatency) * 100).toFixed(1)) : 0;

  // 6. Carbon-Aware Time-Shifting Engine
  let timeShiftRecommendation: TimeShiftOption | undefined;
  let scheduled_time = 'Immediate (T+0h)';

  if (task.can_delay) {
    // Current carbon intensity baseline of the selected node
    const currentIntensity = selected.node.carbon_intensity;
    // Scan next 12 hours from forecasts
    let bestSlot: HourlyForecast | null = null;
    let maxReduction = 0;

    for (const fc of forecasts) {
      if (fc.hour_offset === 0) continue;
      // Regional grid variation projection factor
      const projectedIntensity = (fc.carbon_intensity / 240) * currentIntensity;
      const reduction = ((currentIntensity - projectedIntensity) / currentIntensity) * 100;
      if (reduction > maxReduction) {
        maxReduction = reduction;
        bestSlot = fc;
      }
    }

    // If reduction is > 20%, recommend time-shifting
    if (bestSlot && maxReduction >= 20) {
      timeShiftRecommendation = {
        hour_offset: bestSlot.hour_offset,
        target_time: bestSlot.time_label,
        carbon_intensity: Math.round((bestSlot.carbon_intensity / 240) * currentIntensity),
        carbon_reduction_pct: Math.round(maxReduction),
        recommended: true,
        reason: `Solar/renewable surge expected at ${bestSlot.time_label} reduces regional grid carbon by ${Math.round(maxReduction)}%.`
      };

      if (applyTimeShift) {
        scheduled_time = `Delayed: ${bestSlot.time_label}`;
      }
    }
  }

  // 7. Dynamic "Why This Decision?" AI Explanation Generator
  const reasoning_text = generateExplanation({
    selected,
    task,
    baseline: baselineCandidate,
    carbon_saved_pct,
    cost_saved_pct,
    timeShiftRecommendation,
    appliedTimeShift: applyTimeShift
  });

  return {
    id: `decision-${task.id}-${Date.now().toString().slice(-4)}`,
    task_id: task.id,
    workflow_id: task.workflow_id,
    selected_node_id: selected.node.id,
    selected_model_id: selected.model.id,
    scheduled_time,
    expected_latency: selected.total_latency_ms,
    expected_cost: selected.estimated_cost,
    expected_carbon: Number(selected.estimated_carbon_g.toFixed(3)),
    expected_energy: Number(selected.estimated_energy_wh.toFixed(3)),
    score: Number(selected.penalty_score.toFixed(3)),
    reasoning_text,
    baseline_latency: bLatency,
    baseline_cost: bCost,
    baseline_carbon: Number(bCarbon.toFixed(3)),
    baseline_energy: Number(bEnergy.toFixed(3)),
    carbon_saved_pct,
    cost_saved_pct,
    energy_saved_pct,
    latency_delta_pct,
    time_shifted: applyTimeShift && !!timeShiftRecommendation,
    time_shift_recommendation: timeShiftRecommendation,
    all_candidates: evaluatedCandidates
  };
}

interface ExplanationParams {
  selected: CandidateEvaluation;
  task: Task;
  baseline: CandidateEvaluation;
  carbon_saved_pct: number;
  cost_saved_pct: number;
  timeShiftRecommendation?: TimeShiftOption;
  appliedTimeShift: boolean;
}

function generateExplanation(params: ExplanationParams): string {
  const { selected, task, carbon_saved_pct, cost_saved_pct, timeShiftRecommendation, appliedTimeShift } = params;
  const node = selected.node;
  const model = selected.model;

  const parts: string[] = [];

  parts.push(
    `Routed to ${node.name} (${node.region_name}) using ${model.model_name} ` +
    `because regional grid carbon is currently ${node.carbon_intensity} gCO2/kWh (${node.renewable_pct}% renewable) ` +
    `and accuracy of ${model.quality_score}% satisfies the minimum SLA threshold of ${task.min_accuracy}%.`
  );

  parts.push(
    `This execution path delivers ${carbon_saved_pct}% lower CO2 and ${cost_saved_pct}% cost savings ` +
    `compared to default cloud heavy baseline, with a responsive ${selected.total_latency_ms}ms round-trip latency.`
  );

  if (timeShiftRecommendation && !appliedTimeShift) {
    parts.push(
      `💡 Time-Shift Opportunity: Since this task allows flexible scheduling, delaying execution by ${timeShiftRecommendation.hour_offset}h ` +
      `to ${timeShiftRecommendation.target_time} yields an additional ${timeShiftRecommendation.carbon_reduction_pct}% carbon reduction.`
    );
  } else if (appliedTimeShift && timeShiftRecommendation) {
    parts.push(
      `⏳ Time-Shift Active: Scheduled at ${timeShiftRecommendation.target_time} capturing peak clean energy surge (-${timeShiftRecommendation.carbon_reduction_pct}% CO2).`
    );
  }

  return parts.join(' ');
}
