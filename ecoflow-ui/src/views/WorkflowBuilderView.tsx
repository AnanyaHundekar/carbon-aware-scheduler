import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskType } from '../types';
import {
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  X,
  Sliders,
  Sparkles,
  Leaf,
  Clock,
  Zap,
  HelpCircle
} from 'lucide-react';

const TASK_TYPES: TaskType[] = [
  'Extraction',
  'Classification',
  'Reasoning',
  'Summarization',
  'Code Generation',
  'Creative'
];

export const WorkflowBuilderView: React.FC = () => {
  const {
    activeWorkflow,
    updateWorkflowTasks,
    taskDecisions,
    nodes,
    models,
    setActiveTab
  } = useApp();

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Task>>({});

  const tasks = activeWorkflow?.tasks || [];

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditForm({ ...task });
  };

  const handleSaveEdit = () => {
    if (!editingTaskId) return;
    const updated = tasks.map(t => (t.id === editingTaskId ? { ...t, ...editForm } as Task : t));
    updateWorkflowTasks(updated);
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditForm({});
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id).map((t, idx) => ({ ...t, step_order: idx + 1 }));
    updateWorkflowTasks(updated);
  };

  const handleMoveTask = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= tasks.length) return;

    const newTasks = [...tasks];
    const temp = newTasks[idx];
    newTasks[idx] = newTasks[targetIdx];
    newTasks[targetIdx] = temp;

    const reordered = newTasks.map((t, i) => ({ ...t, step_order: i + 1 }));
    updateWorkflowTasks(reordered);
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: `task-custom-${Date.now().toString().slice(-4)}`,
      workflow_id: activeWorkflow?.id || 'wf-custom',
      name: `Step ${tasks.length + 1}: Custom Intelligence Task`,
      task_type: 'Reasoning',
      min_accuracy: 85,
      max_latency_ms: 2500,
      max_budget: 0.02,
      can_delay: true,
      step_order: tasks.length + 1,
      input_token_est: 2000,
      output_token_est: 800
    };
    const updated = [...tasks, newTask];
    updateWorkflowTasks(updated);
    handleStartEdit(newTask);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
              Interactive Pipeline Designer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Visual Workflow Builder
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Configure agent tasks, accuracy thresholds, latency SLAs, and time-shifting flexibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddTask}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-glow-terracotta transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Step</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className="px-4 py-2.5 rounded-xl glass-panel border border-stone-300 dark:border-stone-700 text-xs font-bold hover:border-terracotta-500 transition-colors"
          >
            View Optimized Schedule →
          </button>
        </div>
      </div>

      {/* Workflow Task Steps */}
      <div className="space-y-4">
        {tasks.map((task, idx) => {
          const isEditing = editingTaskId === task.id;
          const decision = taskDecisions.get(task.id);
          const assignedNode = nodes.find(n => n.id === decision?.selected_node_id);
          const assignedModel = models.find(m => m.id === decision?.selected_model_id);

          return (
            <div
              key={task.id}
              className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
                isEditing
                  ? 'border-terracotta-500/80 shadow-glow-terracotta ring-2 ring-terracotta-500/20'
                  : 'border-stone-200/70 dark:border-stone-800/70 hover:border-amber-400/50'
              }`}
            >
              {/* Card Header Row */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-terracotta-500 text-white font-bold font-mono text-sm shadow-sm">
                      {idx + 1}
                    </span>
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-0.5 mt-1">
                      <button
                        onClick={() => handleMoveTask(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20"
                        title="Move Step Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveTask(idx, 'down')}
                        disabled={idx === tasks.length - 1}
                        className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20"
                        title="Move Step Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                        {task.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                        {task.task_type}
                      </span>
                      {task.can_delay && (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-sage-500/20 text-sage-700 dark:text-sage-300 border border-sage-500/30">
                          🌱 Time-Shift Eligible
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-400 mt-2 font-mono">
                      <span>Min Acc: <strong className="text-stone-800 dark:text-stone-200">{task.min_accuracy}%</strong></span>
                      <span>•</span>
                      <span>Max SLA: <strong className="text-stone-800 dark:text-stone-200">{task.max_latency_ms}ms</strong></span>
                      <span>•</span>
                      <span>Max Budget: <strong className="text-stone-800 dark:text-stone-200">${task.max_budget.toFixed(3)}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Instant Live Scheduler Recommendation Pill */}
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <div className="px-3 py-2 rounded-xl bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-right">
                    <span className="text-[10px] text-stone-400 block font-sans">Live Scheduled Target</span>
                    <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      {assignedNode?.node_type} • <span className="text-terracotta-500">{assignedModel?.model_name}</span>
                    </div>
                    <div className="text-[10px] font-mono text-sage-600 dark:text-sage-400">
                      -{decision?.carbon_saved_pct || 0}% Carbon ({decision?.expected_latency || 0}ms)
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {!isEditing ? (
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700 transition-colors"
                        title="Edit task SLA thresholds"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 rounded-xl bg-sage-500 text-white shadow-sm"
                          title="Save Changes"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-red-500 border border-stone-200 dark:border-stone-700 transition-colors"
                      title="Delete step"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Inline Edit Form Drawer */}
              {isEditing && (
                <div className="p-5 bg-stone-50/80 dark:bg-stone-800/40 border-t border-stone-200/60 dark:border-stone-700/60 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                        Task Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="glass-input w-full"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                        Task Category
                      </label>
                      <select
                        value={editForm.task_type || 'Reasoning'}
                        onChange={(e) => setEditForm({ ...editForm, task_type: e.target.value as TaskType })}
                        className="glass-input w-full"
                      >
                        {TASK_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                        Estimated Input Tokens
                      </label>
                      <input
                        type="number"
                        step="100"
                        value={editForm.input_token_est || 1000}
                        onChange={(e) => setEditForm({ ...editForm, input_token_est: Number(e.target.value) })}
                        className="glass-input w-full font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                        Estimated Output Tokens
                      </label>
                      <input
                        type="number"
                        step="100"
                        value={editForm.output_token_est || 300}
                        onChange={(e) => setEditForm({ ...editForm, output_token_est: Number(e.target.value) })}
                        className="glass-input w-full font-mono"
                      />
                    </div>
                  </div>

                  {/* Sliders for SLAs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-stone-700 dark:text-stone-300">Min Accuracy SLA:</span>
                        <span className="font-mono text-terracotta-500 font-bold">{editForm.min_accuracy}%</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="99"
                        value={editForm.min_accuracy || 85}
                        onChange={(e) => setEditForm({ ...editForm, min_accuracy: Number(e.target.value) })}
                        className="w-full h-2 accent-terracotta-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-stone-700 dark:text-stone-300">Max Latency SLA:</span>
                        <span className="font-mono text-amber-500 font-bold">{editForm.max_latency_ms}ms</span>
                      </div>
                      <input
                        type="range"
                        min="200"
                        max="15000"
                        step="100"
                        value={editForm.max_latency_ms || 2000}
                        onChange={(e) => setEditForm({ ...editForm, max_latency_ms: Number(e.target.value) })}
                        className="w-full h-2 accent-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-stone-700 dark:text-stone-300">Max Budget:</span>
                        <span className="font-mono text-sage-600 dark:text-sage-400 font-bold">${(editForm.max_budget || 0.02).toFixed(3)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.002"
                        max="0.100"
                        step="0.002"
                        value={editForm.max_budget || 0.02}
                        onChange={(e) => setEditForm({ ...editForm, max_budget: Number(e.target.value) })}
                        className="w-full h-2 accent-sage-500"
                      />
                    </div>
                  </div>

                  {/* Delay Tolerance Toggle */}
                  <div className="pt-2 flex items-center justify-between border-t border-stone-200/60 dark:border-stone-700/60">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-sage-500" />
                      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Allow 12-Hour Carbon Time-Shifting (can_delay = true)
                      </span>
                    </div>
                    <button
                      onClick={() => setEditForm({ ...editForm, can_delay: !editForm.can_delay })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        editForm.can_delay ? 'bg-sage-500' : 'bg-stone-300 dark:bg-stone-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                          editForm.can_delay ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
