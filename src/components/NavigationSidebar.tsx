import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Bot,
  BarChart3,
  FolderKanban,
  Clock,
  Settings,
  HelpCircle,
  Activity,
  Layers
} from 'lucide-react';
import { NavigationTab } from '../types';

interface NavigationSidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  documentCount: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onTabChange,
  documentCount
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'Documents', label: 'Documents', icon: FileText, badge: documentCount },
    { id: 'AI Assistant', label: 'AI Assistant', icon: Bot, badge: 'Active' },
    { id: 'Analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'Collections', label: 'Collections', icon: FolderKanban },
    { id: 'Recent Activity', label: 'Recent Activity', icon: Clock }
  ];

  return (
    <aside
      id="navigation-sidebar"
      className="w-[220px] shrink-0 bg-[#131924] text-slate-300 flex flex-col justify-between border-r border-slate-800/80 select-none z-20"
      style={{ height: '100vh' }}
    >
      {/* Top Header */}
      <div className="flex flex-col">
        {/* Brand header */}
        <div className="px-4 py-4 border-b border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-100 font-display font-bold text-xs tracking-wider shadow-sm">
              EA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display font-semibold text-slate-100 text-[13.5px] leading-tight truncate">
                AI-Based EDA Assistant
              </span>
              <span className="font-mono text-[10px] text-slate-400 tracking-tight">
                Enterprise RAG v2.4
              </span>
            </div>
          </div>

          {/* Workspace badge */}
          <div className="mt-1 px-2.5 py-1.5 rounded bg-slate-900/80 border border-slate-800/90 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-slate-300 font-mono">Workspace</span>
              <span className="text-[11.5px] font-medium text-slate-200 truncate">Research Workspace</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[9px] text-emerald-400">SYNC</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-0.5" aria-label="Main Workspace Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1D2736] text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-200' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      item.badge === 'Active'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                        : isActive
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Grounded Index Stats */}
        <div className="mx-3 my-2 p-2.5 rounded border border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10.5px] text-slate-300 font-medium flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-slate-400" />
              Indexed RAG Graph
            </span>
            <span className="font-mono text-[10px] text-emerald-400 font-medium">Ready</span>
          </div>
          <div className="text-[11px] text-slate-300 flex justify-between font-mono">
            <span>Vectors</span>
            <span className="text-slate-300">2.4M chunks</span>
          </div>
          <div className="text-[11px] text-slate-300 flex justify-between font-mono mt-0.5">
            <span>Recall Acc.</span>
            <span className="text-slate-300">98.4%</span>
          </div>
        </div>
      </div>

      {/* Bottom User Area */}
      <div className="p-3 border-t border-slate-800/80 flex flex-col gap-1">
        <button
          id="nav-settings-btn"
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[12.5px] font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors text-left"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Settings</span>
        </button>

        <button
          id="nav-help-btn"
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[12.5px] font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors text-left"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Help & Support</span>
        </button>

        {/* User profile row */}
        <div className="mt-2 pt-2.5 border-t border-slate-800 flex items-center gap-2.5 px-1">
          <div className="relative">
            <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-semibold text-xs shadow-inner">
              SM
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#131924]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12.5px] font-medium text-slate-200 truncate">
              Shrishti Mourya
            </span>
            <span className="text-[10px] text-slate-400 truncate flex items-center gap-1 font-mono">
              <Activity className="w-2.5 h-2.5 text-emerald-400" />
              Research Workspace
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
