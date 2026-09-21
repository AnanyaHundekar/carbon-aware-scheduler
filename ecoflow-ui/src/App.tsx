import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CarbonBudgetModal } from './components/CarbonBudgetModal';
import { TwoMinuteDemoModal } from './components/TwoMinuteDemoModal';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { WorkflowBuilderView } from './views/WorkflowBuilderView';
import { SchedulerResultsView } from './views/SchedulerResultsView';
import { TradeoffExplorerView } from './views/TradeoffExplorerView';
import { DigitalTwinView } from './views/DigitalTwinView';
import { AnalyticsView } from './views/AnalyticsView';
import { HistoryView } from './views/HistoryView';

import { Leaf } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeTab === 'landing' && <LandingView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'builder' && <WorkflowBuilderView />}
        {activeTab === 'results' && <SchedulerResultsView />}
        {activeTab === 'simulator' && <TradeoffExplorerView />}
        {activeTab === 'infrastructure' && <DigitalTwinView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'history' && <HistoryView />}
      </main>

      {/* Floating Modals */}
      <CarbonBudgetModal />
      <TwoMinuteDemoModal />

      {/* Modern Eco-Tech Footer */}
      <footer className="glass-panel border-t border-stone-200/60 dark:border-stone-800/80 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-terracotta-500 text-white flex items-center justify-center font-bold text-[10px]">
              E
            </div>
            <span>
              <strong>EcoFlow AI</strong> — Carbon & Latency Aware Agent Workflow Scheduler
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setActiveTab('landing')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Overview
            </button>
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Dashboard
            </button>
            <button onClick={() => setActiveTab('builder')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Builder
            </button>
            <button onClick={() => setActiveTab('results')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Scheduler
            </button>
            <button onClick={() => setActiveTab('simulator')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Pareto Explorer
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span>Engineered with sustainable compute principles</span>
            <Leaf className="w-3.5 h-3.5 text-sage-500" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
