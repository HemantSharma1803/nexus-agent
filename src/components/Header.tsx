import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface HeaderProps {
  status: 'READY' | 'WORKING' | 'ADAPTING' | 'VERIFIED' | 'FAILED';
}

export const Header: React.FC<HeaderProps> = ({ status }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'WORKING':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Nexus is working</span>
          </div>
        );
      case 'ADAPTING':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs text-purple-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>Nexus adapting</span>
          </div>
        );
      case 'VERIFIED':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Task verified</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141824] border border-[#222738] text-xs text-gray-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Agent Online</span>
          </div>
        );
    }
  };

  return (
    <header className="h-13 border-b border-[#1e2230] bg-[#0d0f17] px-5 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Brand title */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm text-white tracking-tight">NEXUS</span>
        <span className="hidden sm:inline text-gray-600">/</span>
        <span className="hidden sm:inline text-xs text-gray-400 tracking-wide font-medium">
          Autonomous Web Operator
        </span>
      </div>

      {/* Right status indicators */}
      <div className="flex items-center gap-2.5">
        {getStatusBadge()}

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141824] border border-[#222738] text-xs text-gray-300">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] text-gray-300">Sandbox Environment</span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <span>Safe Sandbox</span>
        </div>
      </div>
    </header>
  );
};
