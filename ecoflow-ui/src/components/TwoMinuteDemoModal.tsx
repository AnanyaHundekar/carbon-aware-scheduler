import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Zap,
  Leaf,
  Layers,
  Sliders,
  Server,
  TrendingDown,
  Award
} from 'lucide-react';

export const TwoMinuteDemoModal: React.FC = () => {
  const {
    isDemoActive,
    demoStep,
    nextDemoStep,
    prevDemoStep,
    exitDemo,
    aggregateMetrics,
    applyScenario,
    setGreenGreedValue,
    setActiveTab,
    triggerGridSpike
  } = useApp();

  if (!isDemoActive) return null;

  const demoSteps = [
    {
      step: 1,
      title: "1. The Autonomous Logistics Pipeline",
      subtitle: "Ingesting 4-step multi-agent AI workflow",
      icon: <Layers className="w-5 h-5 text-terracotta-500" />,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          <p>
            Welcome to the <strong>EcoFlow AI Live Demo</strong>! We are looking at a real-time 4-step enterprise agent pipeline:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="font-bold text-stone-900 dark:text-white">Step 1: Manifest Parsing</span>
              <div className="text-stone-500">Extraction SLA &lt;600ms</div>
            </div>
            <div className="p-2 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="font-bold text-stone-900 dark:text-white">Step 2: Urgency Intent</span>
              <div className="text-stone-500">Classification &gt;84% Acc</div>
            </div>
            <div className="p-2 rounded bg-stone-100 dark:bg-stone-800 border border-amber-500/30 bg-amber-500/5">
              <span className="font-bold text-amber-700 dark:text-amber-300">Step 3: Path Optimization</span>
              <div className="text-stone-500">Time-Shift Eligible!</div>
            </div>
            <div className="p-2 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="font-bold text-stone-900 dark:text-white">Step 4: Driver Notification</span>
              <div className="text-stone-500">Summarization &lt;1.2s</div>
            </div>
          </div>
          <p className="text-stone-500 dark:text-stone-400">
            Next, our scheduler evaluates all 25 Node + Model combinations to filter hard constraints.
          </p>
        </div>
      )
    },
    {
      step: 2,
      title: "2. Hard Constraint Filtering & Weight Optimization",
      subtitle: "Eliminating violating permutations in real time",
      icon: <Sliders className="w-5 h-5 text-amber-500" />,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          <p>
            Standard schedulers either dump everything into expensive cloud models or blindly route to nearest nodes.
            <strong>EcoFlow AI enforces hard SLAs</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-200 font-medium">
            <li>Drops pairings violating Latency &gt; max SLA</li>
            <li>Eliminates underperforming models below accuracy threshold</li>
            <li>Calculates exact multi-objective score: Latency, Cost, Energy, Carbon</li>
          </ul>
          <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-center font-mono text-[11px]">
            Score = (w_L * L_norm) + (w_$ * C_norm) + (w_E * E_norm) + (w_C * CO2_norm) - (w_A * A_norm)
          </div>
        </div>
      )
    },
    {
      step: 3,
      title: "3. Carbon-Aware 12-Hour Time-Shifting",
      subtitle: "Intelligently shifting batch steps to peak solar/wind",
      icon: <Leaf className="w-5 h-5 text-sage-500" />,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          <p>
            Notice Step 3 (<strong>Route Optimization</strong>): The user flagged it as <span className="font-semibold text-sage-600 dark:text-sage-400">can_delay = true</span>.
          </p>
          <div className="p-3 rounded-xl bg-sage-500/10 border border-sage-500/30">
            <div className="flex items-center justify-between mb-1 font-semibold text-sage-700 dark:text-sage-300">
              <span>Forecast Engine Detection:</span>
              <span className="px-2 py-0.5 rounded bg-sage-500 text-white text-[10px]">-44% Extra CO2</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300">
              Regional solar generation surges in +4 hours, dropping grid carbon intensity from 240 to 112 gCO2/kWh.
              The scheduler automatically recommends scheduling Step 3 at peak solar hour!
            </p>
          </div>
        </div>
      )
    },
    {
      step: 4,
      title: "4. The Pareto Frontier Visualizer",
      subtitle: "Explaining trade-offs between Speed, Cost & Carbon",
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          <p>
            Every candidate is plotted on the <strong>Pareto Frontier Scatter Plot</strong> (X-axis: Carbon Emissions, Y-axis: Latency).
          </p>
          <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-[11px] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span><strong>Optimal Node:</strong> Minimum penalty score highlighted in Sunset Amber</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500" />
              <span><strong>Baseline Heavy:</strong> Apex-Ultra MoE on High-Perf Cluster</span>
            </div>
          </div>
          <p className="text-stone-500 dark:text-stone-400">
            Let's see what happens during a real-time infrastructure event next.
          </p>
        </div>
      )
    },
    {
      step: 5,
      title: "5. Digital Twin Resilience & Dynamic Re-Routing",
      subtitle: "Real-time failover when local grid carbon spikes",
      icon: <Server className="w-5 h-5 text-terracotta-500" />,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          <p>
            We just triggered a <strong>Simulated Grid Spike</strong> on the US-Central datacenter (carbon spiked to 640 gCO2/kWh, CPU load 96%).
          </p>
          <div className="p-3 rounded-xl bg-terracotta-500/10 border border-terracotta-500/30">
            <p className="font-semibold text-terracotta-700 dark:text-terracotta-300 text-[11px] mb-1">
              ⚡ Instantaneous Re-Route Triggered:
            </p>
            <p className="text-[11px] text-stone-600 dark:text-stone-300">
              The scheduler detected the carbon & load surge, dynamically transferring execution to the <strong>Nordic Hydro-Solar Green DC (98% renewable)</strong> with zero human intervention!
            </p>
          </div>
        </div>
      )
    },
    {
      step: 6,
      title: "6. Verified ROI & Hackathon Winning Summary",
      subtitle: "Mathematically proven savings across all vectors",
      icon: <Award className="w-5 h-5 text-amber-500" />,
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-sage-500/15 border border-sage-500/30">
              <div className="text-lg font-bold text-sage-600 dark:text-sage-400">-{aggregateMetrics.carbonSavedPct}%</div>
              <div className="text-[10px] text-stone-500">CO2 Emissions</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30">
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">-{aggregateMetrics.costSavedPct}%</div>
              <div className="text-[10px] text-stone-500">Inference Cost</div>
            </div>
            <div className="p-2 rounded-xl bg-terracotta-500/15 border border-terracotta-500/30">
              <div className="text-lg font-bold text-terracotta-600 dark:text-terracotta-400">{aggregateMetrics.totalLatency}ms</div>
              <div className="text-[10px] text-stone-500">Latency SLA Met</div>
            </div>
          </div>
          <p className="text-center font-medium text-stone-700 dark:text-stone-200">
            🎉 EcoFlow AI turns passive AI workloads into actively managed, sustainable compute pipelines.
          </p>
        </div>
      )
    }
  ];

  const currentStepData = demoSteps[demoStep - 1] || demoSteps[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md animate-bounce-in">
      <div className="glass-panel-elevated rounded-2xl border-2 border-amber-400/80 p-5 shadow-glow-amber">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-stone-800/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-300">
              {currentStepData.icon}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                2-Min Demo Mode (Step {demoStep} of {demoSteps.length})
              </span>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {currentStepData.title}
              </h4>
            </div>
          </div>
          <button
            onClick={exitDemo}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            title="Exit Demo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-3">
          {currentStepData.content}
        </div>

        {/* Progress Bar & Footer Actions */}
        <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {demoSteps.map((s) => (
              <div
                key={s.step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.step === demoStep
                    ? 'w-6 bg-terracotta-500'
                    : s.step < demoStep
                    ? 'w-2 bg-amber-400'
                    : 'w-2 bg-stone-300 dark:bg-stone-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {demoStep > 1 && (
              <button
                onClick={prevDemoStep}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {demoStep < demoSteps.length ? (
              <button
                onClick={nextDemoStep}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-sm"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={exitDemo}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-sage-500 hover:bg-sage-600 text-white text-xs font-bold shadow-sm"
              >
                <span>Finish Tour</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
