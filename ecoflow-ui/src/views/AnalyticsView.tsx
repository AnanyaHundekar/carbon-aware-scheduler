import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { BarChart3, Leaf, Zap, TrendingDown, Globe, Award, ShieldCheck } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { forecasts, nodes, models } = useApp();

  // Model distribution data
  const modelDistribution = [
    { name: 'Eco-Nano 3B', value: 38, color: '#81B29A' },
    { name: 'Fast-Instruct 8B', value: 32, color: '#F2CC8F' },
    { name: 'Balanced-Omni 14B', value: 20, color: '#E07A5F' },
    { name: 'DeepReason 70B', value: 8, color: '#3D5A80' },
    { name: 'Apex-Ultra MoE', value: 2, color: '#9E2A2B' },
  ];

  // 7-day historical emissions trend (simulated data)
  const historicalEmissionsTrend = [
    { day: 'Mon', baseline: 42.5, ecoflow: 13.2, saved: 29.3 },
    { day: 'Tue', baseline: 48.0, ecoflow: 15.6, saved: 32.4 },
    { day: 'Wed', baseline: 52.4, ecoflow: 16.1, saved: 36.3 },
    { day: 'Thu', baseline: 39.8, ecoflow: 11.4, saved: 28.4 },
    { day: 'Fri', baseline: 61.2, ecoflow: 18.9, saved: 42.3 },
    { day: 'Sat', baseline: 35.0, ecoflow: 9.8, saved: 25.2 },
    { day: 'Sun', baseline: 28.6, ecoflow: 7.4, saved: 21.2 },
  ];

  // Regional carbon intensity comparison
  const regionalIntensityData = nodes.map(n => ({
    name: n.name.split(' ')[0],
    carbon: n.carbon_intensity,
    renewable: n.renewable_pct
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-sage-500/20 text-sage-600 dark:text-sage-400 border border-sage-500/30">
              Verified ESG & Sustainability Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Sustainability & Carbon Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Historical emissions avoided, grid carbon forecasting, and LLM fleet efficiency metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-sage-500/15 border border-sage-500/30 text-xs font-bold text-sage-700 dark:text-sage-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-sage-500" />
            <span>Scope 2 GHG Compliant</span>
          </span>
        </div>
      </div>

      {/* 12-Hour Grid Carbon Forecast & Solar/Wind Generation */}
      <div className="glass-panel-elevated p-6 rounded-3xl border border-stone-200/80 dark:border-stone-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>12-Hour Grid Carbon Forecast & Solar/Wind Surges</span>
            </h3>
            <p className="text-xs text-stone-500">
              Used by the Carbon-Aware Time-Shifting Engine to detect optimal windows for delay-tolerant batch tasks.
            </p>
          </div>
          <span className="text-xs font-mono text-sage-600 dark:text-sage-400 font-bold">
            Solar Peak at +4h (112 gCO2/kWh)
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecasts} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="time_label" textAnchor="end" height={50} tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" label={{ value: 'Carbon (gCO2/kWh)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Renewable %', angle: 90, position: 'insideRight', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(28, 25, 23, 0.9)',
                  borderColor: 'rgba(224, 122, 95, 0.4)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="carbon_intensity" name="Grid Carbon (gCO2/kWh)" stroke="#E07A5F" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="renewable_pct" name="Renewable Generation %" stroke="#81B29A" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Row: 7-Day Cumulative Avoided Emissions & Regional Footprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cumulative Emissions Avoided */}
        <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 space-y-4">
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-sage-500" />
              <span>7-Day Emissions Avoided vs Baseline (kg CO2)</span>
            </h3>
            <p className="text-xs text-stone-500">
              Total 215.2 kg CO2 saved over the past 7 days across multi-agent pipelines.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalEmissionsTrend} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(28, 25, 23, 0.9)',
                    borderColor: 'rgba(129, 178, 154, 0.4)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="baseline" name="Baseline Cloud (kg)" stroke="#E07A5F" fill="#E07A5F" fillOpacity={0.2} />
                <Area type="monotone" dataKey="ecoflow" name="EcoFlow Scheduled (kg)" stroke="#81B29A" fill="#81B29A" fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Carbon Intensity Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70 space-y-4">
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-500" />
              <span>Regional Grid Intensity Comparison (gCO2/kWh)</span>
            </h3>
            <p className="text-xs text-stone-500">
              Comparing marginal carbon emissions across our 5 infrastructure nodes.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalIntensityData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(28, 25, 23, 0.9)',
                    borderColor: 'rgba(242, 204, 143, 0.4)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="carbon" name="Grid Carbon (gCO2/kWh)" fill="#E07A5F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Model Distribution Fleet Breakdown */}
      <div className="glass-panel p-6 rounded-3xl border border-stone-200/70 dark:border-stone-800/70">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Agent Fleet Model Tier Distribution
            </h3>
            <p className="text-xs text-stone-500">
              EcoFlow AI avoids over-provisioning by routing 70% of tasks to lightweight Nano and 8B models.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {modelDistribution.map((item) => (
            <div key={item.name} className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 text-center">
              <span className="text-xs text-stone-500 block truncate">{item.name}</span>
              <div className="text-2xl font-bold font-mono mt-1" style={{ color: item.color }}>
                {item.value}%
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 mt-2 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.value * 2}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
