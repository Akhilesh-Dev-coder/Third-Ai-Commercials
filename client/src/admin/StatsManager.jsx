import React, { useState, useEffect } from 'react';
import { fetchStats, updateStats } from '../services/api';
import { BarChart3, CheckCircle2, Save, Sparkles } from 'lucide-react';

export default function StatsManager() {
  const [statsData, setStatsData] = useState({
    projectsCount: 1450,
    clientsCount: 280,
    turnaroundHours: 72,
    satisfactionRate: 99
  });

  const [saved, setSaved] = useState(false);

  const loadStats = async () => {
    try {
      const res = await fetchStats();
      if (res.data.success && res.data.data) {
        setStatsData(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStats(statsData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel-heavy p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-5 h-5 text-brand-red" />
          <div>
            <h2 className="font-display font-extrabold text-xl text-white">Agency Key Metrics & Counters</h2>
            <p className="text-xs text-gray-400 font-mono">Update live stats showcased across public landing page</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-gray-300">Commercial Assets Created</label>
              <input
                type="number"
                required
                value={statsData.projectsCount}
                onChange={(e) => setStatsData({ ...statsData, projectsCount: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-gray-300">Global Client Accounts</label>
              <input
                type="number"
                required
                value={statsData.clientsCount}
                onChange={(e) => setStatsData({ ...statsData, clientsCount: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-gray-300">Guaranteed Delivery (Hours)</label>
              <input
                type="number"
                required
                value={statsData.turnaroundHours}
                onChange={(e) => setStatsData({ ...statsData, turnaroundHours: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-gray-300">Satisfaction Rate (%)</label>
              <input
                type="number"
                required
                value={statsData.satisfactionRate}
                onChange={(e) => setStatsData({ ...statsData, satisfactionRate: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-sans"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-2">
            <button
              type="submit"
              className="py-3.5 px-7 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white font-mono font-bold text-xs uppercase tracking-wider shadow-red-glow flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Website Stats</span>
            </button>

            {saved && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Metrics Updated Live
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
