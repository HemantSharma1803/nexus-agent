import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, Check, Sparkles } from 'lucide-react';

interface SettingsScreenProps {
  onResetAllData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onResetAllData }) => {
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    onResetAllData();
    setResetSuccess(true);
    window.setTimeout(() => setResetSuccess(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="pb-3 border-b border-[#1e2230]">
        <h2 className="text-lg font-bold text-white tracking-tight">Agent Settings</h2>
        <p className="text-xs text-gray-400 mt-0.5">Review the current demo environment and reset its local state.</p>
      </div>

      <section className="border border-[#1e2230] rounded-xl bg-[#0e1017] p-4 space-y-2">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <div>
            <h3 className="text-xs font-semibold text-white">Task execution</h3>
            <p className="text-[11px] text-gray-400">A deterministic, client-side workflow demonstrates planning, browser-state updates, recovery, and verification.</p>
          </div>
        </div>
      </section>

      <section className="border border-[#1e2230] rounded-xl bg-[#0e1017] p-4 space-y-2">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <div>
            <h3 className="text-xs font-semibold text-white">NEXUS Market sandbox</h3>
            <p className="text-[11px] text-gray-400">Local demo catalog only. No external websites, accounts, credentials, or purchases are accessed.</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">All catalog changes and cart interactions are contained within this prototype.</p>
      </section>

      <section className="border border-[#1e2230] rounded-xl bg-[#0e1017] p-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold text-white">Reset demo data</h3>
          <p className="text-[11px] text-gray-400">Clear locally saved task history and sessions, and restore the sandbox.</p>
        </div>
        <button type="button" onClick={handleReset} className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-200 bg-[#161a28] hover:bg-[#20263a] border border-[#222738] transition-colors flex items-center gap-1.5 shrink-0">
          {resetSuccess ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Reset complete</span></> : <><RotateCcw className="w-3.5 h-3.5" /><span>RESET DEMO</span></>}
        </button>
      </section>
    </div>
  );
};
