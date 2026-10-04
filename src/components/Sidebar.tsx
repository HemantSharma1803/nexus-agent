import React from 'react';
import {
  Play,
  History,
  Globe,
  Sliders,
  Layers,
  Settings,
  ShieldCheck
} from 'lucide-react';

export type NavItem = 'run_task' | 'task_history' | 'browser_sessions' | 'integrations' | 'settings';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  taskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  taskCount,
}) => {
  return (
    <aside className="w-14 sm:w-56 bg-[#0c0e15] border-r border-[#1e2230] flex flex-col justify-between shrink-0 h-screen select-none">
      <div>
        {/* Brand Header */}
        <div className="p-2 sm:p-4 border-b border-[#1e2230]/70 flex items-center justify-center sm:justify-start gap-2.5">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm">
            N
          </div>
          <div className="hidden sm:block">
            <div className="font-semibold text-xs tracking-tight text-white leading-none">
              NEXUS
            </div>
            <div className="text-[10px] text-gray-400 font-mono tracking-wider mt-1 uppercase">
              Autonomous Web Operator
            </div>
          </div>
        </div>

        {/* WORKSPACE Section */}
        <div className="px-1.5 sm:px-3 pt-4 pb-2">
          <div className="hidden sm:block text-[10px] font-mono tracking-wider text-gray-500 uppercase px-2 mb-1.5 font-medium">
            Workspace
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => onSelectTab('run_task')}
              title="Run Task"
              className={`w-full flex items-center justify-center sm:justify-between px-1.5 sm:px-2.5 py-2 sm:py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentTab === 'run_task'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-[#141824]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Run Task</span>
              </div>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
            </button>

            <button
              onClick={() => onSelectTab('task_history')}
              title="Task History"
              className={`w-full flex items-center justify-center sm:justify-between px-1.5 sm:px-2.5 py-2 sm:py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentTab === 'task_history'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-[#141824]'
              }`}
            >
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Task History</span>
              </div>
              {taskCount > 0 && (
                <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1e2333] text-gray-400">
                  {taskCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('browser_sessions')}
              title="Browser Sessions"
              className={`w-full flex items-center justify-center sm:justify-between px-1.5 sm:px-2.5 py-2 sm:py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentTab === 'browser_sessions'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-[#141824]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Browser Sessions</span>
              </div>
              <span className="hidden sm:inline text-[10px] font-mono text-emerald-400">Sandbox</span>
            </button>
          </nav>
        </div>

        {/* SYSTEM Section */}
        <div className="px-1.5 sm:px-3 pt-3">
          <div className="hidden sm:block text-[10px] font-mono tracking-wider text-gray-500 uppercase px-2 mb-1.5 font-medium">
            System
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => onSelectTab('settings')}
              title="Agent Settings"
              className={`w-full flex items-center justify-center sm:justify-start gap-2 px-1.5 sm:px-2.5 py-2 sm:py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentTab === 'settings'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-[#141824]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Agent Settings</span>
            </button>

            <button
              onClick={() => onSelectTab('integrations')}
              title="Sandbox Info"
              className={`w-full flex items-center justify-center sm:justify-start gap-2 px-1.5 sm:px-2.5 py-2 sm:py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentTab === 'integrations'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-[#141824]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sandbox Info</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="hidden sm:block p-3 border-t border-[#1e2230] bg-[#090b10] space-y-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-300 font-medium text-[11px]">Agent Online</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-medium">Ready</span>
        </div>
        <div className="text-[10px] text-gray-500 font-mono">
          Safe Sandbox Active
        </div>
      </div>
    </aside>
  );
};
