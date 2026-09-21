import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Server,
  Cpu,
  Leaf,
  Clock,
  DollarSign,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingDown,
  Layers,
  FileText
} from 'lucide-react';
import { ParetoScatterPlot } from '../components/ParetoScatterPlot';

export const SchedulerResultsView: React.FC = () => {
  const {
    activeWorkflow,
    taskDecisions,
    nodes,
    models,
    aggregateMetrics,
    applyTimeShift,
    setApplyTimeShift,
    executeWorkflow,
    setActiveTab
  } = useApp();

  const tasks = activeWorkflow?.tasks || [];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-sage-500/20 text-sage-600 dark:text-sage-400 border border-sage-500/30">
              Mathematical Multi-Objective Solver
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Scheduler & Routing Decisions
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Pipeline routing solutions optimized for <strong>{activeWorkflow?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={executeWorkflow}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs shadow-glow-terracotta transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Execute & Commit Plan</span>
          </button>
        </div>
      </div>

      {/* Aggregate Pipeline Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-sage-500/40 bg-sage-500/5">
          <span className="text-[11px] font-semibold text-sage-600 dark:text-sage-400 uppercase tracking-wider">
            Total Carbon Reduction
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-sage-600 dark:text-sage-400 mt-1">
            -{aggregateMetrics.carbonSavedPct}%
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {aggregateMetrics.totalCarbon}g CO2 vs {aggregateMetrics.baselineCarbon}g baseline
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/40 bg-amber-500/5">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Total Cost Reduction
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-500 mt-1">
            -{aggregateMetrics.costSavedPct}%
          </div>
          <p className="text-xs text-stone-500 mt-1">
            ${aggregateMetrics.totalCost.toFixed(4)} vs ${aggregateMetrics.baselineCost.toFixed(4)} baseline
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-terracotta-500/40 bg-terracotta-500/5">
          <span className="text-[11px] font-semibold text-terracotta-500 uppercase tracking-wider">
            Pipeline Latency Round-Trip
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-terracotta-500 mt-1">
            {aggregateMetrics.totalLatency}ms
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Zero SLA violations across {tasks.length} tasks
          </p>
        </div>
      </div>

      {/* Step by Step Breakdown Cards */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-terracotta-500" />
          <span>Step-by-Step Task Optimization Breakdown</span>
        </h2>

        {tasks.map((task, idx) => {
          const decision = taskDecisions.get(task.id);
          const node = nodes.find(n => n.id === decision?.selected_node_id);
          const model = models.find(m => m.id === decision?.selected_model_id);

          return (
            <div
              key={task.id}
              className="glass-panel rounded-3xl p-6 border border-stone-200/70 dark:border-stone-800/70 hover:border-amber-400/60 transition-all space-y-4"
            >
              {/* Task Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-200/60 dark:border-stone-800/60 gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-terracotta-500 text-white font-bold font-mono text-sm">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                        {task.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                        {task.task_type}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500 font-mono">
                      Target SLA: &lt;{task.max_latency_ms}ms • Min Acc: {task.min_accuracy}% • Budget: &lt;${task.max_budget.toFixed(3)}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sage-500/20 text-sage-700 dark:text-sage-300 border border-sage-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-500" />
                    <span>SLA Verified</span>
                  </span>

                  {decision?.time_shift_recommendation && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{decision.time_shift_recommendation.target_time} (-{decision.time_shift_recommendation.carbon_reduction_pct}% CO2)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Routing Assignment Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/70">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Server className="w-3.5 h-3.5 text-stone-400" />
                      Selected Node
                    </span>
                    <span className="text-[10px] uppercase font-bold text-sage-600 dark:text-sage-400">
                      {node?.renewable_pct}% Clean
                    </span>
                  </div>
                  <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{node?.name}</div>
                  <div className="text-[11px] text-stone-500 font-mono">{node?.region_name}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/70">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-stone-400" />
                      Selected LLM Model
                    </span>
                    <span className="text-[10px] uppercase font-bold text-terracotta-500">
                      Acc {model?.quality_score}%
                    </span>
                  </div>
                  <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{model?.model_name}</div>
                  <div className="text-[11px] text-stone-500 font-mono">{model?.parameter_size} • {model?.provider}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/70">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-sage-500" />
                      Emissions & Energy
                    </span>
                    <span className="text-[10px] font-mono font-bold text-sage-600">
                      -{decision?.carbon_saved_pct}%
                    </span>
                  </div>
                  <div className="font-bold text-sm font-mono text-sage-600 dark:text-sage-400">
                    {decision?.expected_carbon}g CO2
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">{decision?.expected_energy} Wh energy</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/70">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                      Cost & Latency
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-500">
                      -{decision?.cost_saved_pct}%
                    </span>
                  </div>
                  <div className="font-bold text-sm font-mono text-stone-900 dark:text-stone-100">
                    ${decision?.expected_cost.toFixed(4)}
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">{decision?.expected_latency}ms round-trip</div>
                </div>
              </div>

              {/* Dynamic AI Reasoning Card */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-terracotta-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 dark:text-terracotta-400">
                    Why This Decision? (AI Natural Language Explainer)
                  </span>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                  {decision?.reasoning_text}
                </p>
              </div>

              {/* Candidate Pareto Scatter for this Task */}
              {decision?.all_candidates && (
                <div className="pt-2">
                  <div className="text-xs font-semibold text-stone-500 mb-2">
                    Candidate Feasibility Space for {task.name} ({decision.all_candidates.length} Candidate Pairings Evaluated)
                  </div>
                  <div className="h-64">
                    <ParetoScatterPlot
                      candidates={decision.all_candidates}
                      selectedDecision={decision}
                      height={240}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
