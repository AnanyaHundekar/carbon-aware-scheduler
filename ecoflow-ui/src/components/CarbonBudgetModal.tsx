import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Leaf, Zap, CheckCircle2, X, ArrowRight, ShieldAlert } from 'lucide-react';

export const CarbonBudgetModal: React.FC = () => {
  const {
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    carbonQuotaDaily,
    carbonUsedDaily,
    applyScenario,
    setGreenGreedValue,
    setActiveTab
  } = useApp();

  if (!isBudgetModalOpen) return null;

  const excessCarbon = Number((carbonUsedDaily - carbonQuotaDaily).toFixed(2));

  const handleApplyEcoPlan = () => {
    // Switch to Max Eco / Green Computing Batch preset
    applyScenario('green_batch');
    setGreenGreedValue(90);
    setIsBudgetModalOpen(false);
    setActiveTab('results');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel-elevated border-2 border-terracotta-500/60 p-6 shadow-glow-terracotta text-stone-900 dark:text-stone-100">
        
        {/* Header Close */}
        <button
          onClick={() => setIsBudgetModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Badge & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-terracotta-500/20 text-terracotta-500 border border-terracotta-500/40">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-terracotta-600 dark:text-terracotta-400">
                Policy Enforcer
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-terracotta-500 text-white">
                Quota Exceeded
              </span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Daily Carbon Budget Exceeded
            </h3>
          </div>
        </div>

        {/* Alert description */}
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
          Active workflow execution forecast requires <strong className="text-terracotta-500 font-semibold">{carbonUsedDaily}g CO2</strong>, which exceeds your configured daily ceiling of <strong className="font-semibold">{carbonQuotaDaily}g CO2</strong> by <span className="text-terracotta-600 dark:text-terracotta-400 font-bold">+{excessCarbon}g</span>.
        </p>

        {/* Recommended Eco Alternative Plan */}
        <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/90 border border-sage-500/40 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-sage-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
                Recommended Green Alternative Plan
              </span>
            </div>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sage-500/20 text-sage-700 dark:text-sage-300 border border-sage-500/30">
              -62% Carbon
            </span>
          </div>

          <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
            <div className="flex items-center justify-between py-1 border-b border-stone-200/50 dark:border-stone-700/50">
              <span className="text-stone-500">Target Node:</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">Nordic Hydro-Solar Green DC (EU-North)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-stone-200/50 dark:border-stone-700/50">
              <span className="text-stone-500">Model Substitution:</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">Balanced-Omni 14B Q (91% SLA Accuracy)</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-stone-500">Projected Emissions:</span>
              <span className="font-bold text-sage-600 dark:text-sage-400">14.2g CO2 (Well within 50g limit)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={() => setIsBudgetModalOpen(false)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Override & Run Anyway
          </button>
          <button
            onClick={handleApplyEcoPlan}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-glow-terracotta transition-all"
          >
            <span>Apply Eco Alternative</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
