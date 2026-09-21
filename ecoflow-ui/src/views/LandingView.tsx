import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Zap,
  Leaf,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Server,
  Sliders,
  Play,
  Gauge,
  Layers,
  Award,
  Globe2,
  CheckCircle2
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { setActiveTab, startDemo, applyScenario } = useApp();

  // Interactive carbon calculator state
  const [dailyTokens, setDailyTokens] = useState<number>(500000); // 500k tokens
  const [currentCleanPct, setCurrentCleanPct] = useState<number>(25); // current renewable %

  // Calculation: baseline ~ 450 gCO2/kWh vs optimized ~ 40 gCO2/kWh
  const baselineKgYear = Number(((dailyTokens / 1000) * 12.5 * (450 / 1000) * 365 / 1000).toFixed(1));
  const optimizedKgYear = Number(((dailyTokens / 1000) * 1.5 * (40 / 1000) * 365 / 1000).toFixed(1));
  const savedKgYear = Math.max(0, Number((baselineKgYear - optimizedKgYear).toFixed(1)));
  const treesEquivalent = Math.round(savedKgYear / 21); // 1 mature tree absorbs ~21kg CO2/year
  const dollarSavedYear = Math.round((dailyTokens / 1000) * (0.025 - 0.003) * 365);

  return (
    <div className="space-y-16 pb-16 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-terracotta-500/20 via-amber-500/20 to-sage-500/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-amber-500/40 text-xs font-semibold text-stone-800 dark:text-stone-200 mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-terracotta-500 animate-ping" />
          <span>EcoFlow AI 2.0 • The Carbon-Aware Autonomous Agent Scheduler</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 font-sans leading-tight sm:leading-none mb-6">
          Don’t just run AI. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-terracotta-500 via-amber-500 to-terracotta-600 bg-clip-text text-transparent">
            Run AI intelligently.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed mb-8">
          Multi-objective scheduling for LLMs and multi-agent workflows. Mathematically balances 
          <strong className="text-stone-900 dark:text-white"> latency SLAs, inference costs, energy grid carbon intensity</strong>, and time-shifting opportunities.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-sm shadow-glow-terracotta transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Gauge className="w-4 h-4" />
            <span>Launch Executive Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={startDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl glass-panel border border-amber-400/80 hover:bg-amber-400/10 text-stone-900 dark:text-stone-100 font-bold text-sm shadow-sm transition-all"
          >
            <Play className="w-4 h-4 text-amber-500 fill-current" />
            <span>⚡ Start 2-Minute Demo</span>
          </button>
        </div>

        {/* Live Counters Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-4xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl border border-stone-200/70 dark:border-stone-800/70">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-terracotta-500">1,420+</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">Workflows Optimized</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-stone-200/70 dark:border-stone-800/70">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-sage-600 dark:text-sage-400">482.6 kg</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">CO2 Emissions Avoided</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-stone-200/70 dark:border-stone-800/70">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-500">$4,120</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">Inference Budget Saved</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-stone-200/70 dark:border-stone-800/70">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-800 dark:text-stone-200">99.8%</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">SLA Latency Adherence</div>
          </div>
        </div>
      </section>

      {/* Interactive Carbon Calculator Widget */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-terracotta-500/30 shadow-glow-terracotta">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-terracotta-500/20 text-terracotta-600 dark:text-terracotta-400">
                  Interactive ROI Estimator
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                Estimate Your Organization's Carbon & Cost Reduction
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-mono">Live Mathematical Model</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-700 dark:text-stone-300">Daily Agent Token Volume:</span>
                  <span className="font-mono text-terracotta-500 font-bold">{(dailyTokens / 1000).toLocaleString()}k tokens/day</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={dailyTokens}
                  onChange={(e) => setDailyTokens(Number(e.target.value))}
                  className="w-full h-2 accent-terracotta-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-700 dark:text-stone-300">Current Cloud Renewable Mix:</span>
                  <span className="font-mono text-amber-500 font-bold">{currentCleanPct}% clean</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={currentCleanPct}
                  onChange={(e) => setCurrentCleanPct(Number(e.target.value))}
                  className="w-full h-2 accent-amber-500"
                />
              </div>
            </div>

            {/* Live Results Card */}
            <div className="p-4 rounded-2xl bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-700">
                <span className="text-xs text-stone-500">Annual CO2 Saved:</span>
                <span className="text-base font-bold font-mono text-sage-600 dark:text-sage-400">
                  {savedKgYear.toLocaleString()} kg CO2 / yr
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-700">
                <span className="text-xs text-stone-500">Equivalent Trees Planted:</span>
                <span className="text-sm font-bold font-mono text-amber-500">
                  🌲 {treesEquivalent.toLocaleString()} mature trees
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">Estimated API Cost Savings:</span>
                <span className="text-sm font-bold font-mono text-terracotta-500">
                  ${dollarSavedYear.toLocaleString()} / yr
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab('builder')}
              className="flex items-center gap-2 text-xs font-bold text-terracotta-500 hover:text-terracotta-600 transition-colors"
            >
              <span>Build and schedule a custom workflow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6 Core Architecture Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-500">
            Engineered For Hackathons & Production Scale
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            The 6 Pillars of EcoFlow AI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 hover:border-terracotta-500/50 transition-all">
            <div className="p-3 rounded-xl bg-terracotta-500/10 text-terracotta-500 w-fit mb-4">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-2">
              Multi-Objective Scheduler
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Transparent mathematical scheduler evaluates (Node + Model) pairings, enforces hard SLAs, and minimizes penalty score using dynamic priority weights.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 hover:border-amber-500/50 transition-all">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 w-fit mb-4">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-2">
              12-Hour Carbon Time-Shifting
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Scans regional grid forecast curves. When future solar or wind surges drop carbon by &gt;20%, delay-tolerant batch tasks automatically reschedule.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 hover:border-sage-500/50 transition-all">
            <div className="p-3 rounded-xl bg-sage-500/10 text-sage-500 w-fit mb-4">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-2">
              Pareto Frontier Explorer
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Interactive 2D/3D trade-off scatter plot visualizing optimal recommendations against baseline heavy models, clearly proving efficiency without sacrifice.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 hover:border-terracotta-500/50 transition-all">
            <div className="p-3 rounded-xl bg-terracotta-500/10 text-terracotta-500 w-fit mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-2">
              Digital Twin Infrastructure
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Live telemetry grid of 5 server locations with animated CPU/GPU gauges and "Simulate Grid Spike" trigger showing instant failover routing.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 hover:border-amber-500/50 transition-all">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 w-fit mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-2">
              Carbon Quota Enforcer
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Daily carbon quota meter with automatic warm terracotta alerts proposing 1-click alternative low-carbon models whenever budgets are threatened.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-stone-200/70 dark:border-stone-800/70 hover:border-sage-500/50 transition-all">
            <div className="p-3 rounded-xl bg-sage-500/10 text-sage-500 w-fit mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mb-2">
              AI Natural Language Explainer
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Auto-generates contextual, transparent natural language explanations for every routing decision using genuine calculated physical metrics.
            </p>
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="glass-panel-elevated p-8 rounded-3xl border border-amber-400/50 shadow-glow-amber">
          <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">
            Ready to test EcoFlow AI in action?
          </h3>
          <p className="text-stone-600 dark:text-stone-300 text-sm max-w-lg mx-auto mb-6">
            Run the 2-minute live demo or configure custom workflow steps in the visual builder.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startDemo}
              className="px-6 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs shadow-glow-terracotta"
            >
              ⚡ Launch 2-Minute Demo Tour
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className="px-6 py-3 rounded-xl glass-panel border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs hover:border-amber-400"
            >
              Open Workflow Builder
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
