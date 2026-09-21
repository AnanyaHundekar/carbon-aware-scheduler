import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Server,
  Zap,
  Leaf,
  Cpu,
  Activity,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Globe2,
  CheckCircle2
} from 'lucide-react';
import { DigitalTwinNodeCard } from '../components/DigitalTwinNodeCard';

export const DigitalTwinView: React.FC = () => {
  const {
    nodes,
    triggerGridSpike,
    normalizeGrid,
    taskDecisions,
    activeWorkflow
  } = useApp();

  const [lastEvent, setLastEvent] = useState<{
    time: string;
    description: string;
    action: string;
  } | null>(null);

  const handleSimulateSpike = (nodeId?: string) => {
    triggerGridSpike(nodeId);
    const target = nodeId ? nodes.find(n => n.id === nodeId)?.name : 'US-Central AI Supercluster';
    setLastEvent({
      time: new Date().toLocaleTimeString(),
      description: `Grid carbon surge detected in ${target} (carbon climbed to 640 gCO2/kWh, CPU load reached 96%).`,
      action: `Scheduler automatically re-routed latency-tolerant and batch tasks to Nordic Hydro-Solar Green DC.`
    });
  };

  const handleNormalize = () => {
    normalizeGrid();
    setLastEvent({
      time: new Date().toLocaleTimeString(),
      description: `Infrastructure telemetry normalized back to baseline renewable averages.`,
      action: `Scheduler re-evaluated optimal distribution across all 5 operational nodes.`
    });
  };

  // Count active tasks assigned to each node
  const nodeTaskCounts = new Map<string, number>();
  taskDecisions.forEach(d => {
    nodeTaskCounts.set(d.selected_node_id, (nodeTaskCounts.get(d.selected_node_id) || 0) + 1);
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-sage-500/20 text-sage-600 dark:text-sage-400 border border-sage-500/30">
              Live Telemetry & Chaos Engineering
            </span>
            <span className="flex h-2 w-2 rounded-full bg-sage-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Digital Twin Infrastructure
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Real-time physical monitoring of 5 global compute zones with simulated grid disturbances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleSimulateSpike()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs shadow-glow-terracotta transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            title="Inject regional grid carbon spike or datacenter load surge"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Simulate Grid Spike</span>
          </button>

          <button
            onClick={handleNormalize}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl glass-panel border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-semibold"
            title="Reset telemetry to baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Real-Time Resilience Event Alert Banner */}
      {lastEvent && (
        <div className="glass-panel-elevated p-5 rounded-2xl border-l-4 border-l-amber-500 border-stone-200 dark:border-stone-700 shadow-md animate-fade-in flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Resilience Event Triggered
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {lastEvent.time}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                {lastEvent.description}
              </p>
              <div className="text-xs font-semibold text-sage-600 dark:text-sage-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lastEvent.action}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setLastEvent(null)}
            className="text-stone-400 hover:text-stone-600 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 5 Server Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map(node => {
          const count = nodeTaskCounts.get(node.id) || 0;
          return (
            <DigitalTwinNodeCard
              key={node.id}
              node={node}
              isReceivingTraffic={count > 0}
              activeTasksCount={count}
              onSimulateSpike={() => handleSimulateSpike(node.id)}
              onNormalize={handleNormalize}
            />
          );
        })}
      </div>

      {/* Telemetry Architecture Documentation */}
      <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 space-y-3">
        <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-terracotta-500" />
          <span>How Digital Twin Telemetry Drives Live Routing</span>
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          Every node continuously reports <strong>gCO2/kWh marginal grid intensity</strong>, <strong>renewable mix percentage</strong>, and <strong>CPU/GPU hardware load</strong>.
          When a datacenter region experiences high fossil fuel generation (such as during peak heating or solar fade), the EcoFlow AI scheduler penalizes that candidate's objective score and shifts agent requests to hydro, geothermal, or low-intensity edge nodes with verified zero SLA degradation.
        </p>
      </div>

    </div>
  );
};
