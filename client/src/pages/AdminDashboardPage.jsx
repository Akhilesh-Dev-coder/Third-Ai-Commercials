import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Film,
  Sparkles,
  MessageSquare,
  Users,
  Inbox,
  BarChart3,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Activity
} from 'lucide-react';

import ProjectsManager from '../admin/ProjectsManager';
import ServicesManager from '../admin/ServicesManager';
import ReviewsManager from '../admin/ReviewsManager';
import CEOManager from '../admin/CEOManager';
import InquiriesManager from '../admin/InquiriesManager';
import StatsManager from '../admin/StatsManager';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          <span>Verifying Security Token...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const tabs = [
    { id: 'projects', label: 'Commercial Projects', icon: Film },
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black/60 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Brand & Status */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-red to-amber-500 flex items-center justify-center font-display font-black text-white text-sm shadow-red-glow">
                3AI
              </div>
              <span className="font-display font-black text-lg tracking-tight">
                THIRD <span className="text-brand-red">CMS</span>
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold text-emerald-400 pt-1">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>TERMINAL ONLINE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    active
                      ? 'bg-brand-red text-white shadow-red-glow'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Actions */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-brand-red/20 border border-brand-red/40 flex items-center justify-center font-bold text-brand-red text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-gray-400 font-mono truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-gray-300 transition border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-red-950/60 hover:bg-brand-red text-xs font-mono font-bold text-white transition border border-red-900/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        <ProjectsManager />
      </main>
    </div>
  );
}
