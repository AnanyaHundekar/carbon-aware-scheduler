import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { CandidateEvaluation, SchedulingDecision } from '../types';
import { BASELINE_NODE_ID, BASELINE_MODEL_ID } from '../db/seedData';

interface ParetoScatterPlotProps {
  candidates: CandidateEvaluation[];
  selectedDecision?: SchedulingDecision;
  height?: number;
}

interface ScatterPoint {
  x: number; // Carbon (gCO2)
  y: number; // Latency (ms)
  z: number; // Cost ($)
  nodeName: string;
  region: string;
  modelName: string;
  accuracy: number;
  score: number;
  isOptimal: boolean;
  isBaseline: boolean;
  violates: boolean;
  violations: string[];
}

export const ParetoScatterPlot: React.FC<ParetoScatterPlotProps> = ({
  candidates,
  selectedDecision,
  height = 380
}) => {
  const points: ScatterPoint[] = candidates.map(c => {
    const isOptimal = selectedDecision
      ? c.node.id === selectedDecision.selected_node_id && c.model.id === selectedDecision.selected_model_id
      : false;
    const isBaseline = c.node.id === BASELINE_NODE_ID && c.model.id === BASELINE_MODEL_ID;

    return {
      x: Number(c.estimated_carbon_g.toFixed(3)),
      y: c.total_latency_ms,
      z: Math.max(10, Math.round(c.estimated_cost * 10000)), // scaled for visualization radius
      nodeName: c.node.name,
      region: c.node.region_name,
      modelName: c.model.model_name,
      accuracy: c.accuracy,
      score: Number(c.penalty_score.toFixed(3)),
      isOptimal,
      isBaseline,
      violates: c.violates_constraints,
      violations: c.violations
    };
  });

  const optimalPoint = points.find(p => p.isOptimal);
  const baselinePoint = points.find(p => p.isBaseline);
  const feasiblePoints = points.filter(p => !p.isOptimal && !p.isBaseline && !p.violates);
  const violatingPoints = points.filter(p => p.violates);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: ScatterPoint = payload[0].payload;
      return (
        <div className="glass-panel-elevated p-3 rounded-xl border border-stone-300 dark:border-stone-700 shadow-xl text-xs max-w-xs z-50">
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-stone-200 dark:border-stone-700">
            <span className="font-bold text-stone-900 dark:text-stone-100">{data.modelName}</span>
            {data.isOptimal && (
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-stone-900 text-[10px] font-bold">
                ★ OPTIMAL
              </span>
            )}
            {data.isBaseline && (
              <span className="px-1.5 py-0.5 rounded bg-terracotta-500 text-white text-[10px] font-bold">
                BASELINE
              </span>
            )}
            {data.violates && (
              <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold">
                SLA BREACH
              </span>
            )}
          </div>
          <div className="space-y-1 text-stone-600 dark:text-stone-300">
            <div><strong className="text-stone-700 dark:text-stone-200">Node:</strong> {data.nodeName}</div>
            <div><strong className="text-stone-700 dark:text-stone-200">Region:</strong> {data.region}</div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
              <div>Carbon: <span className="font-semibold text-sage-600 dark:text-sage-400">{data.x}g CO2</span></div>
              <div>Latency: <span className="font-semibold text-stone-800 dark:text-stone-200">{data.y}ms</span></div>
              <div>Accuracy: <span className="font-semibold text-stone-800 dark:text-stone-200">{data.accuracy}%</span></div>
              <div>Penalty Score: <span className="font-semibold text-terracotta-500">{data.score}</span></div>
            </div>
            {data.violates && data.violations.length > 0 && (
              <div className="text-[10px] text-red-500 pt-1 border-t border-stone-200 dark:border-stone-700">
                {data.violations.join('; ')}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Legend & KPI highlight */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-stone-900 animate-pulse" />
            <span className="font-semibold text-stone-800 dark:text-stone-200">Optimal (Selected)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-terracotta-500" />
            <span className="text-stone-600 dark:text-stone-400">Cloud Heavy Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sage-400" />
            <span className="text-stone-600 dark:text-stone-400">Feasible Candidates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400/40" />
            <span className="text-stone-400">SLA Violating</span>
          </div>
        </div>

        {optimalPoint && baselinePoint && (
          <div className="flex items-center gap-2 font-mono text-[11px] text-stone-500">
            <span>CO2: <strong className="text-sage-600 dark:text-sage-400">{optimalPoint.x}g</strong> vs {baselinePoint.x}g</span>
            <span>•</span>
            <span>Latency: <strong className="text-stone-800 dark:text-stone-200">{optimalPoint.y}ms</strong> vs {baselinePoint.y}ms</span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis
              type="number"
              dataKey="x"
              name="Carbon"
              unit="g"
              label={{ value: 'Carbon Emissions (gCO2) → [Lower is Greener]', position: 'insideBottom', offset: -10, fill: '#888', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Latency"
              unit="ms"
              label={{ value: 'Round-trip Latency (ms) → [Lower is Faster]', angle: -90, position: 'insideLeft', offset: 0, fill: '#888', fontSize: 11 }}
            />
            <ZAxis type="number" dataKey="z" range={[60, 400]} />
            <Tooltip content={<CustomTooltip />} />

            {/* Feasible candidates */}
            <Scatter name="Feasible Candidates" data={feasiblePoints} fill="#81B29A" opacity={0.7} />

            {/* SLA Violating candidates */}
            <Scatter name="Violating" data={violatingPoints} fill="#a8a29e" opacity={0.3} />

            {/* Baseline heavy candidate */}
            {baselinePoint && (
              <Scatter name="Baseline" data={[baselinePoint]} fill="#E07A5F" />
            )}

            {/* Optimal Selected Candidate */}
            {optimalPoint && (
              <Scatter name="Optimal" data={[optimalPoint]} fill="#F2CC8F" stroke="#cc6145" strokeWidth={2} />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
