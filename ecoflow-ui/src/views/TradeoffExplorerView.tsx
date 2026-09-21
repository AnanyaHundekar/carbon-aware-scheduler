import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, Sparkles, Filter, CheckCircle, AlertTriangle, Layers, RotateCcw, Info } from 'lucide-react';
import { ParetoScatterPlot } from '../components/ParetoScatterPlot';
import { PriorityWeights } from '../types';

export const TradeoffExplorerView: React.FC = () => {
  const {
    activeWorkflow,
    customWeights,
    setCustomWeights,
    taskDecisions,
    nodes,
    models,
    activeScenario,
    clearScenario
  } = useApp();

  // Selected task to explore in the scatter plot
  const tasks = activeWorkflow?.tasks || [];
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');

  const activeTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];
  const decision = activeTask ? taskDecisions.get(activeTask.id) : undefined;
  const candidates = decision?.all_candidates || [];

  const handleWeightChange = (key: keyof PriorityWeights, val: number) => {
    clearScenario();
    setCustomWeights({
      ...customWeights,
      [key]: val
    });
  };

  const handleResetWeights = () => {
    clearScenario();
    setCustomWeights({
      latency: 0.3,
      carbon: 0.3,
      cost: 0.2,
      energy: 0.1,
      accuracy: 0.1
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
              Pareto Frontier & Multi-Dimensional Trade-Offs
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            What-If Simulator & Trade-Off Explorer
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Dynamically tune multi-objective priority weights and observe real-time frontier shifts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="glass-input text-xs font-bold"
          >
            {tasks.map(t => (
              <option key={t.id} value={t.id}>
                Explore: {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleResetWeights}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700 text-xs font-semibold"
            title="Reset to balanced weights"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Multi-Slider Controls + Pareto Scatter Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 5 Weight Sliders */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 space-y-6">
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-terracotta-500" />
              <span>Multi-Objective Weights</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Score = (w_L*L) + (w_$*C) + (w_E*E) + (w_C*CO2) - (w_A*A)
            </p>
          </div>

          <div className="space-y-5">
            {/* Carbon Weight */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-sage-600 dark:text-sage-400 font-bold">w_C : Carbon Weight</span>
                <span className="font-mono font-bold text-sage-600 dark:text-sage-400">
                  {Math.round(customWeights.carbon * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={customWeights.carbon}
                onChange={(e) => handleWeightChange('carbon', Number(e.target.value))}
                className="w-full h-2 accent-sage-500"
              />
            </div>

            {/* Latency / Speed Weight */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-terracotta-500 font-bold">w_L : Latency (Speed) Weight</span>
                <span className="font-mono font-bold text-terracotta-500">
                  {Math.round(customWeights.latency * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={customWeights.latency}
                onChange={(e) => handleWeightChange('latency', Number(e.target.value))}
                className="w-full h-2 accent-terracotta-500"
              />
            </div>

            {/* Cost Weight */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-500 font-bold">w_$ : Inference Cost Weight</span>
                <span className="font-mono font-bold text-amber-500">
                  {Math.round(customWeights.cost * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={customWeights.cost}
                onChange={(e) => handleWeightChange('cost', Number(e.target.value))}
                className="w-full h-2 accent-amber-500"
              />
            </div>

            {/* Energy Weight */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-blue-500 font-bold">w_E : Energy (Wh) Weight</span>
                <span className="font-mono font-bold text-blue-500">
                  {Math.round(customWeights.energy * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={customWeights.energy}
                onChange={(e) => handleWeightChange('energy', Number(e.target.value))}
                className="w-full h-2 accent-blue-500"
              />
            </div>

            {/* Accuracy Weight */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-purple-500 font-bold">w_A : Accuracy Reward</span>
                <span className="font-mono font-bold text-purple-500">
                  {Math.round(customWeights.accuracy * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={customWeights.accuracy}
                onChange={(e) => handleWeightChange('accuracy', Number(e.target.value))}
                className="w-full h-2 accent-purple-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-xs text-stone-500 space-y-1">
            <div className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>How Scoring Works:</span>
            </div>
            <p>
              Penalty score increases with higher latency, cost, and carbon, while model quality reduces penalty. The scheduler picks the candidate with the lowest penalty score.
            </p>
          </div>
        </div>

        {/* Right Column: Live Pareto Scatter Plot */}
        <div className="lg:col-span-8 glass-panel-elevated p-6 rounded-3xl border border-stone-200/80 dark:border-stone-700/80 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                Pareto Frontier for "{activeTask?.name}"
              </h3>
              <p className="text-xs text-stone-500">
                All 25 Node & Model pairings plotted in real time. Bubble size represents token cost.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold text-xs font-mono">
              Min Penalty: {decision?.score}
            </span>
          </div>

          <div className="flex-1 w-full min-h-[400px]">
            <ParetoScatterPlot
              candidates={candidates}
              selectedDecision={decision}
              height={380}
            />
          </div>
        </div>

      </div>

      {/* Candidate Combinations Matrix Table */}
      <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Evaluated Candidate Combinations ({candidates.length} Permutations)
            </h3>
            <p className="text-xs text-stone-500">
              Transparent review of every physical parameter tested by the scheduler.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase tracking-wider text-stone-400 bg-stone-100/60 dark:bg-stone-800/60 border-b border-stone-200/50 dark:border-stone-700/50">
              <tr>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Infrastructure Node</th>
                <th className="px-3 py-2.5">LLM Model</th>
                <th className="px-3 py-2.5 font-mono">Latency</th>
                <th className="px-3 py-2.5 font-mono">Carbon</th>
                <th className="px-3 py-2.5 font-mono">Cost</th>
                <th className="px-3 py-2.5 font-mono">Accuracy</th>
                <th className="px-3 py-2.5 font-mono">Penalty Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-stone-800/40">
              {candidates.map((c, i) => {
                const isSelected = decision?.selected_node_id === c.node.id && decision?.selected_model_id === c.model.id;
                return (
                  <tr
                    key={i}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-amber-400/10 font-semibold'
                        : c.violates_constraints
                        ? 'opacity-40 hover:opacity-80'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-900 font-bold text-[10px]">
                          ★ OPTIMAL
                        </span>
                      ) : c.violates_constraints ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-500 font-bold text-[10px]">
                          BREACH
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-sage-500/15 text-sage-600 dark:text-sage-400 font-bold text-[10px]">
                          FEASIBLE
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                      {c.node.name} <span className="text-stone-400 font-normal">({c.node.region_name})</span>
                    </td>
                    <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                      {c.model.model_name}
                    </td>
                    <td className="px-3 py-2.5 font-mono">{c.total_latency_ms}ms</td>
                    <td className="px-3 py-2.5 font-mono text-sage-600 dark:text-sage-400">{c.estimated_carbon_g.toFixed(2)}g</td>
                    <td className="px-3 py-2.5 font-mono">${c.estimated_cost.toFixed(4)}</td>
                    <td className="px-3 py-2.5 font-mono">{c.accuracy}%</td>
                    <td className="px-3 py-2.5 font-mono font-bold text-terracotta-500">{c.penalty_score.toFixed(3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
