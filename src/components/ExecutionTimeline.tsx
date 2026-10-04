import React from 'react';
import { ExecutionStep, StepStatus } from '../types';
import { Check, Loader2, Circle, AlertTriangle, RefreshCw } from 'lucide-react';

interface ExecutionTimelineProps {
  steps: ExecutionStep[];
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({ steps }) => {
  const renderStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'DONE':
        return (
          <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        );
      case 'RUNNING':
        return (
          <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0 animate-pulse">
            <Loader2 className="w-2.5 h-2.5 animate-spin stroke-[2.5]" />
          </span>
        );
      case 'RECOVERED':
        return (
          <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center shrink-0">
            <RefreshCw className="w-2.5 h-2.5" />
          </span>
        );
      case 'FAILED':
        return (
          <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-2.5 h-2.5" />
          </span>
        );
      default:
        return (
          <span className="w-4 h-4 rounded-full bg-[#141824] text-gray-600 border border-[#202536] flex items-center justify-center shrink-0">
            <Circle className="w-1.5 h-1.5 text-gray-600" />
          </span>
        );
    }
  };

  const doneCount = steps.filter((s) => s.status === 'DONE' || s.status === 'RECOVERED').length;

  return (
    <div className="border border-[#1e2230] rounded-xl bg-[#0e1017] p-3.5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#1e2230]">
        <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">
          Agent Plan
        </h3>
        <span className="text-[11px] font-mono text-gray-400">
          {doneCount} / {steps.length} done
        </span>
      </div>

      {/* Vertical Steps List */}
      <div className="space-y-1.5 overflow-y-auto flex-1">
        {steps.map((step) => {
          const isCurrent = step.status === 'RUNNING';
          const isDone = step.status === 'DONE' || step.status === 'RECOVERED';

          return (
            <div
              key={step.id}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                isCurrent
                  ? 'bg-blue-600/15 border border-blue-500/30'
                  : 'border border-transparent'
              }`}
            >
              <span className="text-[10px] font-mono font-medium text-gray-500 w-4 shrink-0">
                0{step.number}
              </span>
              <div className="shrink-0">{renderStatusIcon(step.status)}</div>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs block truncate ${
                    isCurrent
                      ? 'text-white font-semibold'
                      : isDone
                      ? 'text-gray-400 line-through'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
