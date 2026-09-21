import React from 'react';
import { InfrastructureNode } from '../types';
import { Server, Zap, Leaf, Cpu, Activity, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface DigitalTwinNodeCardProps {
  node: InfrastructureNode;
  isReceivingTraffic: boolean;
  activeTasksCount: number;
  onSimulateSpike: () => void;
  onNormalize: () => void;
}

export const DigitalTwinNodeCard: React.FC<DigitalTwinNodeCardProps> = ({
  node,
  isReceivingTraffic,
  activeTasksCount,
  onSimulateSpike,
  onNormalize
}) => {
  const isGreen = node.carbon_intensity < 100;
  const isHeavySpike = node.carbon_intensity > 400 || node.cpu_util > 90;

  return (
    <div
      className={`glass-panel rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden ${
        isReceivingTraffic
          ? 'border-amber-400/90 shadow-glow-amber ring-2 ring-amber-400/30'
          : isHeavySpike
          ? 'border-terracotta-500/80 shadow-glow-terracotta'
          : 'border-stone-200/70 dark:border-stone-800/70'
      }`}
    >
      {/* Top Banner for Active Traffic Routing */}
      {isReceivingTraffic && (
        <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-amber-500 to-terracotta-500 text-white text-[10px] font-bold px-3 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>ACTIVE WORKLOAD ROUTED</span>
          </div>
          <span>{activeTasksCount} Task(s) Assigned</span>
        </div>
      )}

      {/* Header */}
      <div className={`flex items-start justify-between gap-2 mb-3 ${isReceivingTraffic ? 'mt-3' : ''}`}>
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl flex items-center justify-center ${
              isGreen
                ? 'bg-sage-500/20 text-sage-600 dark:text-sage-400 border border-sage-500/30'
                : isHeavySpike
                ? 'bg-terracotta-500/20 text-terracotta-600 dark:text-terracotta-400 border border-terracotta-500/30'
                : 'bg-stone-200/50 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                {node.name}
              </h4>
              <span className={`w-2 h-2 rounded-full ${node.status === 'online' ? 'bg-sage-400 animate-pulse' : 'bg-amber-400'}`} />
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
              {node.region_name} • {node.node_type}
            </span>
          </div>
        </div>

        {/* Node Type Badge */}
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
            node.node_type === 'Green Cloud'
              ? 'bg-sage-500/20 text-sage-700 dark:text-sage-300 border border-sage-500/40'
              : node.node_type === 'Local'
              ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
              : node.node_type === 'Edge'
              ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
          }`}
        >
          {node.node_type}
        </span>
      </div>

      {/* Grid Carbon Intensity & Renewable % Callout */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700/60">
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
            <span>Grid Carbon</span>
            <Leaf className={`w-3.5 h-3.5 ${isGreen ? 'text-sage-500' : 'text-stone-400'}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold font-mono ${
              isGreen ? 'text-sage-600 dark:text-sage-400' : isHeavySpike ? 'text-terracotta-500' : 'text-stone-800 dark:text-stone-200'
            }`}>
              {node.carbon_intensity}
            </span>
            <span className="text-[10px] text-stone-400">gCO2/kWh</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700/60">
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
            <span>Renewable Mix</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-stone-800 dark:text-stone-200">
              {node.renewable_pct}%
            </span>
            <span className="text-[10px] text-stone-400">clean</span>
          </div>
        </div>
      </div>

      {/* CPU & GPU Utilization Gauges */}
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-stone-500 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-stone-400" />
              CPU Utilization
            </span>
            <span className={`font-mono font-semibold ${node.cpu_util > 80 ? 'text-terracotta-500' : 'text-stone-700 dark:text-stone-300'}`}>
              {node.cpu_util}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                node.cpu_util > 80 ? 'bg-terracotta-500' : 'bg-amber-400'
              }`}
              style={{ width: `${node.cpu_util}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-stone-500 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-stone-400" />
              GPU Utilization
            </span>
            <span className={`font-mono font-semibold ${node.gpu_util > 80 ? 'text-terracotta-500' : 'text-stone-700 dark:text-stone-300'}`}>
              {node.gpu_util}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                node.gpu_util > 80 ? 'bg-terracotta-500' : 'bg-sage-400'
              }`}
              style={{ width: `${node.gpu_util}%` }}
            />
          </div>
        </div>
      </div>

      {/* Technical Specs Footer */}
      <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between text-[11px] text-stone-500 font-mono mb-3">
        <span>Latency: <strong className="text-stone-800 dark:text-stone-200">+{node.latency_penalty_ms}ms</strong></span>
        <span>Cost: <strong className="text-stone-800 dark:text-stone-200">${node.energy_cost_kwh}/kWh</strong></span>
      </div>

      {/* Simulator Trigger Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSimulateSpike}
          className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-terracotta-500/10 hover:bg-terracotta-500/20 text-terracotta-600 dark:text-terracotta-400 border border-terracotta-500/30 text-xs font-semibold transition-colors"
          title="Simulate sudden coal grid spike or heavy server load surge"
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Simulate Spike</span>
        </button>
        <button
          onClick={onNormalize}
          className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700 transition-colors"
          title="Reset to baseline normal"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
