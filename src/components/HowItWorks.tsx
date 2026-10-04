import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <div className="border border-[#1e2230] rounded-lg bg-[#0e1017] px-4 py-2 flex items-center justify-between text-xs text-gray-400">
      <div className="flex items-center gap-2">
        <span className="font-mono text-blue-400 font-bold text-[11px]">01 PLAN</span>
        <span className="text-gray-300">Understand the goal</span>
      </div>
      <span className="text-gray-700">→</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-blue-400 font-bold text-[11px]">02 OPERATE</span>
        <span className="text-gray-300">Interact with the web</span>
      </div>
      <span className="text-gray-700">→</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-blue-400 font-bold text-[11px]">03 VERIFY</span>
        <span className="text-gray-300">Confirm the result</span>
      </div>
    </div>
  );
};
