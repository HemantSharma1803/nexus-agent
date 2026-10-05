import React, { useRef, useEffect } from 'react';
import { ActivityLogItem, CandidateEvaluation } from '../types';
import { CheckCircle2, AlertTriangle, ShieldCheck, Star } from 'lucide-react';

interface AgentActivityPanelProps {
  activities: ActivityLogItem[];
  candidates?: CandidateEvaluation[];
}

export const AgentActivityPanel: React.FC<AgentActivityPanelProps> = ({
  activities,
  candidates,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [activities]);

  const renderBadge = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'warning':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            UI changed
          </span>
        );
      case 'recovery':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5" />
            Nexus adapted
          </span>
        );
      case 'success':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified
          </span>
        );
      case 'action':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-medium">
            Action
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181d2a] text-gray-400 font-medium">
            Insight
          </span>
        );
    }
  };

  return (
    <div className="border border-[#1e2230] rounded-xl bg-[#0e1017] p-3.5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#1e2230]">
        <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">
          Agent Activity
        </h3>
        <span className="text-[11px] font-mono text-gray-400">
          Decisions & Actions
        </span>
      </div>

      <div
        ref={containerRef}
        className="space-y-2 overflow-y-auto flex-1 pr-0.5"
      >
        {/* Candidate Evaluation Summary Card if available */}
        {candidates && candidates.length > 0 && (
          <div className="p-2.5 rounded-lg bg-[#121624] border border-[#22283a] text-xs">
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Candidates Evaluated
            </div>
            <div className="space-y-1.5">
              {candidates.map((c) => (
                <div
                  key={c.id}
                  className={`p-1.5 rounded flex items-center justify-between text-[11px] ${
                    c.isBestMatch
                      ? 'bg-blue-600/15 border border-blue-500/40 text-white'
                      : 'bg-[#181c2b] text-gray-300'
                  }`}
                >
                  <div>
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-gray-400 ml-1.5 font-mono">
                      {c.rating}★ · {c.reviewsCount.toLocaleString()} rev · ₹{c.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-1 py-0.2 rounded font-semibold ${
                      c.statusText === 'OVER BUDGET'
                        ? 'text-red-400 bg-red-950/40 border border-red-500/30'
                        : c.isBestMatch
                        ? 'text-blue-300 bg-blue-950/40 border border-blue-500/30'
                        : 'text-gray-400'
                    }`}
                  >
                    {c.statusText}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-1.5 border-t border-[#1e2333] text-[10px] text-blue-300 flex items-center justify-between">
              <span className="font-mono font-bold uppercase">Best Valid Match: {candidates.find((c) => c.isBestMatch)?.name ?? '—'}</span>
              <span className="text-gray-400 font-sans">Selected by task policy</span>
            </div>
          </div>
        )}

        {/* Chronological Activity Log */}
        {activities.map((item) => (
          <div
            key={item.id}
            className={`p-2 rounded-lg border text-xs leading-relaxed transition-colors ${
              item.type === 'warning'
                ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                : item.type === 'recovery'
                ? 'bg-purple-950/20 border-purple-500/30 text-purple-200'
                : item.type === 'success'
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : 'bg-[#121520] border-[#1e2230]/70 text-gray-300'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] font-mono text-gray-500">
                {item.timestamp}
              </span>
              {renderBadge(item.type)}
            </div>
            <p className="font-sans text-[11px] leading-normal">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
