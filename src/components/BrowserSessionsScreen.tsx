import React from 'react';
import { BrowserSessionRecord } from '../types';
import { Globe, Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface BrowserSessionsScreenProps {
  sessions: BrowserSessionRecord[];
  onOpenSession: (sessionId: string) => void;
  onNewTask: () => void;
}

export const BrowserSessionsScreen: React.FC<BrowserSessionsScreenProps> = ({
  sessions,
  onOpenSession,
  onNewTask,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Browser Sessions</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Isolated web execution instances managed by Nexus.
          </p>
        </div>

        <button
          onClick={onNewTask}
          className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          New Session
        </button>
      </div>

      <div className="border border-[#1e2230] rounded-xl bg-[#0e1017] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121622] text-gray-400 font-mono border-b border-[#1e2230]">
              <tr>
                <th className="py-2.5 px-4 font-medium">Session ID</th>
                <th className="py-2.5 px-4 font-medium">Target</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium">Started</th>
                <th className="py-2.5 px-4 font-medium">Actions</th>
                <th className="py-2.5 px-4 font-medium">Result</th>
                <th className="py-2.5 px-4 font-medium text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2230]/70 text-gray-300">
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-[#121622] transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-medium text-white">
                    {session.id}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>{session.website}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {session.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-400">
                    {session.startedAt}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {session.actionsCount} actions
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-gray-200">
                    {session.result}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenSession(session.id)}
                      className="px-2 py-1 rounded bg-[#161a28] hover:bg-[#1f2538] text-gray-300 hover:text-white border border-[#222738] text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
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
