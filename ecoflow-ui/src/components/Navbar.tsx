import React from 'react';
import { useApp, AppTab } from '../context/AppContext';
import {
  Leaf,
  Zap,
  Gauge,
  Sliders,
  Server,
  BarChart3,
  History,
  Sun,
  Moon,
  Play,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Coins,
  Clock
} from 'lucide-react';
import { SCENARIO_PRESETS } from '../db/seedData';
import { ScenarioPreset } from '../types';

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    greenGreedValue,
    setGreenGreedValue,
    activeScenario,
    applyScenario,
    clearScenario,
    carbonQuotaDaily,
    carbonUsedDaily,
    setIsBudgetModalOpen,
    startDemo
  } = useApp();

  const navItems: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <Gauge className="w-4 h-4" /> },
    { id: 'builder', label: 'Workflow Builder', icon: <Layers className="w-4 h-4" /> },
    { id: 'results', label: 'Scheduler', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'simulator', label: 'Pareto Trade-offs', icon: <Sliders className="w-4 h-4" /> },
    { id: 'infrastructure', label: 'Digital Twin', icon: <Server className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'history', label: 'Audit Logs', icon: <History className="w-4 h-4" /> },
  ];

  const quotaPct = Math.min(100, Math.round((carbonUsedDaily / carbonQuotaDaily) * 100));
  const isBudgetWarning = quotaPct >= 80;

  const scenarioIcons: Record<string, React.ReactNode> = {
    Zap: <Zap className="w-3.5 h-3.5" />,
    Scale: <Scale className="w-3.5 h-3.5" />,
    Leaf: <Leaf className="w-3.5 h-3.5" />,
    Coins: <Coins className="w-3.5 h-3.5" />,
    Clock: <Clock className="w-3.5 h-3.5" />,
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-stone-200/60 dark:border-stone-800/80 shadow-sm backdrop-blur-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-500 to-amber-500 text-white shadow-glow-terracotta">
              <Leaf className="w-5 h-5 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-sage-400 rounded-full border-2 border-stone-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-sans">
                  EcoFlow<span className="text-terracotta-500">.AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                  Hackathon Ready
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
                Carbon & Latency Aware Agent Scheduler
              </p>
            </div>
          </div>

          {/* Central: "Green vs Greed" Dynamic Slider */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 w-80">
            <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 whitespace-nowrap">
              <Zap className={`w-3.5 h-3.5 ${greenGreedValue < 40 ? 'text-amber-500 animate-bounce' : 'text-stone-400'}`} />
              <span className={greenGreedValue < 40 ? 'font-bold text-amber-600 dark:text-amber-400' : ''}>Speed</span>
            </div>
            
            <div className="flex-1 relative flex flex-col items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={greenGreedValue}
                onChange={(e) => setGreenGreedValue(Number(e.target.value))}
                className="w-full h-2 cursor-pointer accent-terracotta-500"
                title={`Green vs Greed Balance: ${greenGreedValue}% Eco Weight`}
              />
              <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
                {greenGreedValue === 50 ? 'Balanced Policy' : greenGreedValue > 50 ? `${greenGreedValue}% Eco Priority` : `${100 - greenGreedValue}% Speed Priority`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 whitespace-nowrap">
              <span className={greenGreedValue > 60 ? 'font-bold text-sage-600 dark:text-sage-400' : ''}>Eco</span>
              <Leaf className={`w-3.5 h-3.5 ${greenGreedValue > 60 ? 'text-sage-500 animate-pulse' : 'text-stone-400'}`} />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Daily Carbon Budget Indicator */}
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isBudgetWarning
                  ? 'bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400 border-terracotta-500/30 hover:bg-terracotta-500/20'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-terracotta-500/50'
              }`}
              title="Click to view daily carbon budget details"
            >
              <div className="relative flex items-center">
                {isBudgetWarning ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-terracotta-500 animate-pulse" />
                ) : (
                  <Leaf className="w-3.5 h-3.5 text-sage-500" />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{carbonUsedDaily}g</span>
                  <span className="text-stone-400">/ {carbonQuotaDaily}g CO2</span>
                </div>
                <div className="w-20 bg-stone-200 dark:bg-stone-700 h-1 rounded-full overflow-hidden mt-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isBudgetWarning ? 'bg-terracotta-500' : 'bg-sage-400'
                    }`}
                    style={{ width: `${quotaPct}%` }}
                  />
                </div>
              </div>
            </button>

            {/* ⚡ START 2-MIN DEMO Prominent Header Button */}
            <button
              onClick={startDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-terracotta-500 via-amber-500 to-terracotta-600 hover:from-terracotta-600 hover:to-amber-600 text-white font-semibold text-xs tracking-wide shadow-glow-amber hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title="Launch guided interactive 2-minute hackathon demo tour"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>⚡ 2-MIN DEMO</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Row: Tabs & 5 One-Click Scenario Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-t border-stone-200/50 dark:border-stone-800/50 gap-2 overflow-x-auto no-scrollbar">
          {/* Main 8 Views Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-terracotta-500 text-white shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100/70 dark:hover:bg-stone-800/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 5 One-Click Scenario Presets */}
          <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto py-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mr-1 flex items-center gap-1">
              Scenarios:
            </span>
            {SCENARIO_PRESETS.map((sc) => {
              const isSelected = activeScenario === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => isSelected ? clearScenario() : applyScenario(sc.id as ScenarioPreset)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap border transition-all ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 border-amber-500 font-semibold shadow-sm'
                      : 'bg-stone-100/80 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700/60 hover:border-amber-400/50'
                  }`}
                  title={`${sc.name} - ${sc.subtitle}: ${sc.description}`}
                >
                  {scenarioIcons[sc.icon] || <Zap className="w-3 h-3" />}
                  <span>{sc.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
