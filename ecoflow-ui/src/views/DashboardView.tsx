import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Gauge,
  Leaf,
  DollarSign,
  Clock,
  Zap,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Server,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';
import { SCENARIO_PRESETS } from '../db/seedData';
import { ScenarioPreset } from '../types';

export const DashboardView: React.FC = () => {
  const {
    activeWorkflow,
    workflows,
    setActiveWorkflowId,
    taskDecisions,
    aggregateMetrics,
    applyTimeShift,
    setApplyTimeShift,
    triggerGridSpike,
    executeWorkflow,
    nodes,
    models,
    setActiveTab,
    startDemo,
    activeScenario,
    applyScenario,
    clearScenario
  } = useApp();

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Welcome & Workflow Selector */}
      <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-sage-500/20 text-sage-600 dark:text-sage-400 border border-sage-500/30">
              Live Optimization Active
            </span>
            <span className="text-xs text-stone-400">
              Updated in real-time
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Workload Control & KPI Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Currently monitoring: <strong className="text-stone-800 dark:text-stone-200">{activeWorkflow?.name}</strong> ({activeWorkflow?.tasks?.length || 0} sequential tasks)
          </p>
        </div>

        {/* Workflow Switcher & Quick Run */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={activeWorkflow?.id}
            onChange={(e) => setActiveWorkflowId(e.target.value)}
            className="glass-input text-xs font-medium cursor-pointer"
          >
            {workflows.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <button
            onClick={executeWorkflow}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs shadow-glow-terracotta transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            title="Execute workflow with optimized routing and log run"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute Workflow</span>
          </button>
        </div>
      </div>

      {/* 4 High-Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Carbon Reduction */}
        <div className="glass-panel p-5 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 hover:border-sage-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">CO2 Emissions</span>
            <div className="p-2 rounded-xl bg-sage-500/20 text-sage-600 dark:text-sage-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-sage-600 dark:text-sage-400">
              {aggregateMetrics.totalCarbon}g
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sage-500/20 text-sage-700 dark:text-sage-300">
              -{aggregateMetrics.carbonSavedPct}%
            </span>
          </div>
          <div className="text-xs text-stone-400 mt-2">
            Baseline: {aggregateMetrics.baselineCarbon}g CO2 (Heavy Cloud)
          </div>
        </div>

        {/* Cost Reduction */}
        <div className="glass-panel p-5 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Inference Cost</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-500">
              ${aggregateMetrics.totalCost.toFixed(4)}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
              -{aggregateMetrics.costSavedPct}%
            </span>
          </div>
          <div className="text-xs text-stone-400 mt-2">
            Baseline: ${aggregateMetrics.baselineCost.toFixed(4)}
          </div>
        </div>

        {/* Latency Round-Trip */}
        <div className="glass-panel p-5 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 hover:border-terracotta-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Total Latency</span>
            <div className="p-2 rounded-xl bg-terracotta-500/20 text-terracotta-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-terracotta-500">
              {aggregateMetrics.totalLatency}ms
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400">
              Within SLA
            </span>
          </div>
          <div className="text-xs text-stone-400 mt-2">
            Baseline: {aggregateMetrics.baselineLatency}ms (High-Perf)
          </div>
        </div>

        {/* Energy Consumption */}
        <div className="glass-panel p-5 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Energy Consumption</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-stone-800 dark:text-stone-200">
              {aggregateMetrics.totalEnergy}Wh
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300">
              -{aggregateMetrics.energySavedPct}%
            </span>
          </div>
          <div className="text-xs text-stone-400 mt-2">
            Baseline: {aggregateMetrics.baselineEnergy}Wh
          </div>
        </div>

      </div>

      {/* Before vs. After Comparison Card */}
      <div className="glass-panel-elevated p-6 rounded-3xl border border-stone-300/80 dark:border-stone-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40">
                Mathematical Verification
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              Before vs. After Optimization Benchmark
            </h2>
            <p className="text-xs text-stone-500">
              Calculated dynamically by comparing recommended routing vs. Default Cloud Heavy baseline (Apex-Ultra MoE on US-Central AI Cluster).
            </p>
          </div>

          {/* Time-Shifting Toggle */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-stone-100 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700">
            <div className="text-right">
              <div className="text-xs font-bold text-stone-800 dark:text-stone-200">12h Carbon Time-Shifting</div>
              <div className="text-[10px] text-stone-400">Auto-shift flexible batch steps</div>
            </div>
            <button
              onClick={() => setApplyTimeShift(!applyTimeShift)}
              className={`w-11 h-6 rounded-full transition-colors relative ${applyTimeShift ? 'bg-sage-500' : 'bg-stone-300 dark:bg-stone-700'}`}
              title="Toggle 12-hour carbon time-shifting"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  applyTimeShift ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Side-by-side Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Baseline Panel */}
          <div className="p-5 rounded-2xl bg-stone-100/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-terracotta-500" />
                <span className="font-bold text-sm text-stone-800 dark:text-stone-200">Default Cloud Baseline</span>
              </div>
              <span className="text-xs text-stone-400 font-mono">Unmanaged Cloud</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400 mb-1">
                  <span>Carbon Emissions:</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{aggregateMetrics.baselineCarbon}g CO2</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div className="h-full bg-terracotta-500 w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400 mb-1">
                  <span>Token & Energy Cost:</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">${aggregateMetrics.baselineCost.toFixed(4)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div className="h-full bg-amber-500 w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400 mb-1">
                  <span>Average Latency:</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{aggregateMetrics.baselineLatency}ms</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div className="h-full bg-stone-400 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* EcoFlow AI Optimized Panel */}
          <div className="p-5 rounded-2xl bg-sage-500/10 border border-sage-500/30 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sage-500 animate-pulse" />
                <span className="font-bold text-sm text-sage-800 dark:text-sage-200">EcoFlow AI Scheduled</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sage-500 text-white">
                RECOMMENDED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-sage-700 dark:text-sage-300 mb-1">
                  <span>Carbon Emissions:</span>
                  <span className="font-mono font-bold">{aggregateMetrics.totalCarbon}g CO2 (-{aggregateMetrics.carbonSavedPct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-sage-200 dark:bg-sage-950 overflow-hidden">
                  <div
                    className="h-full bg-sage-500 transition-all duration-500"
                    style={{ width: `${Math.max(10, 100 - aggregateMetrics.carbonSavedPct)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-amber-700 dark:text-amber-300 mb-1">
                  <span>Token & Energy Cost:</span>
                  <span className="font-mono font-bold">${aggregateMetrics.totalCost.toFixed(4)} (-{aggregateMetrics.costSavedPct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-amber-200 dark:bg-amber-950 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${Math.max(10, 100 - aggregateMetrics.costSavedPct)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-700 dark:text-stone-300 mb-1">
                  <span>Total Pipeline Latency:</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-100">{aggregateMetrics.totalLatency}ms</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full bg-terracotta-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (aggregateMetrics.totalLatency / Math.max(1, aggregateMetrics.baselineLatency)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Active Workload Feed / Tasks Overview */}
      <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Active Workflow Step Decisions ({activeWorkflow?.tasks?.length || 0} Steps)
            </h3>
            <p className="text-xs text-stone-500">
              Real-time routing assignments generated by multi-objective mathematical scheduler.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('results')}
            className="flex items-center gap-1.5 text-xs font-bold text-terracotta-500 hover:text-terracotta-600 transition-colors"
          >
            <span>View Full Decisions & Explanations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {activeWorkflow?.tasks?.map((task, idx) => {
            const decision = taskDecisions.get(task.id);
            const node = nodes.find(n => n.id === decision?.selected_node_id);
            const model = models.find(m => m.id === decision?.selected_model_id);

            return (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-400/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-terracotta-500/20 text-terracotta-600 dark:text-terracotta-400 text-xs font-bold font-mono">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {task.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                        {task.task_type}
                      </span>
                      {decision?.time_shifted && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sage-500/20 text-sage-700 dark:text-sage-300 border border-sage-500/40 animate-pulse">
                          ⏳ Time-Shifted ({decision.time_shift_recommendation?.target_time})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex flex-wrap items-center gap-3">
                      <span>SLA: &lt;{task.max_latency_ms}ms</span>
                      <span>•</span>
                      <span>Min Acc: {task.min_accuracy}%</span>
                      <span>•</span>
                      <span>Budget: &lt;${task.max_budget.toFixed(3)}</span>
                    </div>
                  </div>
                </div>

                {/* Routing Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs">
                    <span className="text-[10px] text-stone-400 block">Assigned Node</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{node?.name || 'Local'}</span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs">
                    <span className="text-[10px] text-stone-400 block">LLM Model</span>
                    <span className="font-bold text-terracotta-500">{model?.model_name || 'Nano'}</span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-sage-500/10 border border-sage-500/30 text-xs text-right">
                    <span className="text-[10px] text-sage-600 block">Carbon Saved</span>
                    <span className="font-bold font-mono text-sage-700 dark:text-sage-300">-{decision?.carbon_saved_pct || 0}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
