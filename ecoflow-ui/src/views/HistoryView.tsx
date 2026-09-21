import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, Download, Search, Filter, CheckCircle2, Clock, Sparkles, FileSpreadsheet } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { history } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.workflow_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.node_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.scenario && item.scenario.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || item.status.toLowerCase().includes(filterStatus.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ecoflow_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Workflow', 'Timestamp', 'Node', 'Model', 'Carbon Saved %', 'Cost Saved %', 'Latency ms', 'Status', 'Scenario'];
    const rows = history.map(item => [
      item.id,
      `"${item.workflow_name}"`,
      item.timestamp,
      `"${item.node_name}"`,
      `"${item.model_name}"`,
      item.carbon_saved_pct,
      item.cost_saved_pct,
      item.latency_ms,
      item.status,
      `"${item.scenario || 'Custom'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `ecoflow_history_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
              Audit Compliance & Provenance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Execution History & Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Immutable log of historical agent dispatch decisions with verified carbon and cost savings.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-panel border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-semibold"
            title="Download CSV report"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-sage-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-glow-terracotta transition-all"
            title="Download full JSON dataset"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by workflow, node, model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input w-full pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-stone-400 font-medium">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="glass-input text-xs font-semibold"
          >
            <option value="all">All Executions</option>
            <option value="completed">Completed</option>
            <option value="time-shifted">Time-Shifted</option>
          </select>
        </div>
      </div>

      {/* History Log Table */}
      <div className="glass-panel rounded-3xl border border-stone-200/70 dark:border-stone-800/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase tracking-wider text-stone-400 bg-stone-100/70 dark:bg-stone-800/70 border-b border-stone-200/60 dark:border-stone-700/60">
              <tr>
                <th className="px-4 py-3">Run ID</th>
                <th className="px-4 py-3">Workflow Name</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Selected Infrastructure</th>
                <th className="px-4 py-3">LLM Model Tier</th>
                <th className="px-4 py-3 font-mono">Latency</th>
                <th className="px-4 py-3 font-mono">CO2 Saved</th>
                <th className="px-4 py-3 font-mono">Cost Saved</th>
                <th className="px-4 py-3">Policy Scenario</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50 dark:divide-stone-800/50">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-terracotta-500 whitespace-nowrap">
                    {item.id}
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                    {item.workflow_name}
                  </td>
                  <td className="px-4 py-3 text-stone-500 whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {item.node_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {item.model_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {item.latency_ms}ms
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-sage-600 dark:text-sage-400">
                    -{item.carbon_saved_pct}%
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-amber-500">
                    -{item.cost_saved_pct}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {item.scenario || 'Custom Policy'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.status.includes('Time-Shifted') ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>{item.status}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sage-500/20 text-sage-700 dark:text-sage-300 border border-sage-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-sage-500" />
                        <span>{item.status}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
