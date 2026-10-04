import React from 'react';
import { ArrowRight, Loader2, RotateCcw, ShieldCheck, Check } from 'lucide-react';

interface TaskInputHeroProps {
  taskInput: string;
  onTaskInputChange: (val: string) => void;
  isRunning: boolean;
  onRunTask: () => void;
  onResetDemo: () => void;
  onToggleViewPlan: () => void;
  showPlanPreview: boolean;
  adaptiveRecovery: boolean;
  onToggleAdaptiveRecovery: () => void;
}

export const DEMO_SCENARIO_PRESETS = [
  {
    id: 'shopping_research',
    label: 'Shopping research',
    text: 'Find the best-rated mechanical keyboard under ₹3,000 and add the best match to the cart.',
  },
  {
    id: 'compare_products',
    label: 'Compare products',
    text: 'Compare the top mechanical keyboards under ₹3,000 and recommend the best value option.',
  },
  {
    id: 'find_and_verify',
    label: 'Find & verify',
    text: 'Find a keyboard under ₹2,500 with a rating of at least 4.6 and verify that it is in stock.',
  },
  {
    id: 'data_extraction',
    label: 'Data extraction',
    text: 'Inspect catalog products, filter under ₹3,000, and compile candidates comparison.',
  },
];

export const TaskInputHero: React.FC<TaskInputHeroProps> = ({
  taskInput,
  onTaskInputChange,
  isRunning,
  onRunTask,
  onResetDemo,
  onToggleViewPlan,
  showPlanPreview,
  adaptiveRecovery,
  onToggleAdaptiveRecovery,
}) => {
  return (
    <div className="space-y-3">
      {/* Main Headline & Supporting Text */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
          Give NEXUS a task.<br />
          <span className="text-gray-400">It handles the web.</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
          Describe what you want done in plain language. NEXUS plans the workflow, operates the browser, adapts when things change, and verifies the result.
        </p>
      </div>

      {/* Main Task Input Card */}
      <div className="bg-[#0e1017] border border-[#222738] rounded-xl p-3.5 shadow-sm focus-within:border-blue-500/60 transition-colors">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => onTaskInputChange(e.target.value)}
            disabled={isRunning}
            placeholder="e.g. Find the best-rated mechanical keyboard under ₹3,000 and add the best match to the cart."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none font-medium"
          />

          <div className="flex items-center gap-2 shrink-0">
            {/* View Plan secondary button */}
            <button
              type="button"
              onClick={onToggleViewPlan}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                showPlanPreview
                  ? 'bg-blue-600/15 text-blue-300 border-blue-500/30'
                  : 'bg-[#141824] hover:bg-[#1a2030] text-gray-300 border-[#222738]'
              }`}
            >
              VIEW PLAN
            </button>

            {/* Reset Demo button */}
            <button
              type="button"
              onClick={onResetDemo}
              disabled={isRunning}
              title="Reset sandbox state and demo"
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white bg-[#141824] hover:bg-[#1a2030] border border-[#222738] transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Primary RUN TASK button */}
            {!isRunning ? (
              <button
                type="button"
                onClick={onRunTask}
                className="px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
              >
                <span>RUN TASK</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="px-5 py-2 rounded-lg text-xs sm:text-sm font-medium text-blue-300 bg-blue-950/60 border border-blue-500/40 flex items-center gap-2 cursor-wait"
              >
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>Operating...</span>
              </button>
            )}
          </div>
        </div>

        {/* Below input: Compact Examples and Adaptive Recovery Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 mt-2.5 border-t border-[#1e2230]/70 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-gray-500 font-mono mr-1">Examples:</span>
            {DEMO_SCENARIO_PRESETS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onTaskInputChange(item.text)}
                disabled={isRunning}
                className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#141824] hover:bg-[#1b2133] text-gray-300 hover:text-white border border-[#202536] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Adaptive Recovery toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={onToggleAdaptiveRecovery}
              disabled={isRunning}
              title="When enabled, simulates an interface control shift and autonomous self-healing recovery"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                adaptiveRecovery
                  ? 'bg-purple-950/30 text-purple-300 border-purple-500/40'
                  : 'bg-[#141824] text-gray-400 border-[#202536] hover:text-gray-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Adaptive Recovery:</span>
              <span className={`font-mono font-bold ${adaptiveRecovery ? 'text-purple-300' : 'text-gray-500'}`}>
                {adaptiveRecovery ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
