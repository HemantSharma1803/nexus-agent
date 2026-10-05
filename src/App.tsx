import React, { useState, useEffect, useRef } from 'react';
import { Sidebar, NavItem } from './components/Sidebar';
import { Header } from './components/Header';
import { HowItWorks } from './components/HowItWorks';
import { TaskInputHero } from './components/TaskInputHero';
import { ExecutionTimeline } from './components/ExecutionTimeline';
import { AgentActivityPanel } from './components/AgentActivityPanel';
import { SandboxBrowser } from './components/SandboxBrowser';
import { TaskCompletedModal } from './components/TaskCompletedModal';
import { TaskHistoryScreen } from './components/TaskHistoryScreen';
import { BrowserSessionsScreen } from './components/BrowserSessionsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import {
  ExecutionStep,
  ActivityLogItem,
  SandboxState,
  Product,
  TaskRecord,
  BrowserSessionRecord,
  CandidateEvaluation,
} from './types';
import { INITIAL_PRODUCTS } from './data/products';
import {
  DEFAULT_PLAN_STEPS,
  executeNexusTask,
} from './agent/executor';

const DEFAULT_GOAL =
  'Find the best-rated mechanical keyboard under ₹3,000 and add the best match to the cart.';

const INITIAL_TASK_HISTORY: TaskRecord[] = [];
const INITIAL_SESSIONS: BrowserSessionRecord[] = [];

const DEFAULT_SANDBOX_STATE: SandboxState = {
  searchQuery: '',
  priceCap: 4000,
  sortBy: 'featured',
  selectedProductId: null,
  cart: [],
  cartOpen: false,
  activeSelector: null,
  currentActionLabel: null,
  ratingLabelAdaptive: 'rating',
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavItem>('run_task');
  const [taskInput, setTaskInput] = useState<string>(DEFAULT_GOAL);
  const [agentStatus, setAgentStatus] = useState<
    'PLANNING' | 'OPERATING' | 'RECOVERING' | 'VERIFYING' | 'COMPLETED' | 'READY'
  >('READY');
  const [showPlanPreview, setShowPlanPreview] = useState<boolean>(false);
  const [adaptiveRecoveryEnabled, setAdaptiveRecoveryEnabled] = useState<boolean>(true);

  // Core execution state
  const [steps, setSteps] = useState<ExecutionStep[]>(DEFAULT_PLAN_STEPS);
  const [activities, setActivities] = useState<ActivityLogItem[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: 'NEXUS Autonomous Web Operator ready. Click "RUN TASK →" to execute.',
      type: 'info',
    },
  ]);
  const [candidatesEvaluated, setCandidatesEvaluated] = useState<CandidateEvaluation[]>([]);
  const [sandboxState, setSandboxState] = useState<SandboxState>(DEFAULT_SANDBOX_STATE);

  // Persistence
  const [taskHistory, setTaskHistory] = useState<TaskRecord[]>(() => {
    try {
      const stored = localStorage.getItem('nexus_saas_tasks');
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed as TaskRecord[];
      }
    } catch (e) {}
    return INITIAL_TASK_HISTORY;
  });

  const [sessions, setSessions] = useState<BrowserSessionRecord[]>(() => {
    try {
      const stored = localStorage.getItem('nexus_saas_sessions');
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed as BrowserSessionRecord[];
      }
    } catch (e) {}
    return INITIAL_SESSIONS;
  });

  const [completedTaskModal, setCompletedTaskModal] = useState<TaskRecord | null>(null);

  const cancelRef = useRef<{ cancelled: boolean }>({ cancelled: false });
  const executionRef = useRef(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexus_saas_tasks', JSON.stringify(taskHistory));
    } catch (e) {}
  }, [taskHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_saas_sessions', JSON.stringify(sessions));
    } catch (e) {}
  }, [sessions]);

  const isRunning =
    agentStatus === 'PLANNING' ||
    agentStatus === 'OPERATING' ||
    agentStatus === 'RECOVERING' ||
    agentStatus === 'VERIFYING';

  const handleRunTask = async (goalOverride?: string) => {
    const goal = (goalOverride ?? taskInput).trim();
    // Guard both the ref and visible status so a stale execution state can never
    // make RUN TASK appear unresponsive after a failed/interrupted run.
    if (!goal || executionRef.current || isRunning) return;
    if (goalOverride) setTaskInput(goal);

    executionRef.current = true;
    cancelRef.current = { cancelled: false };
    setAgentStatus('PLANNING');

    // Reset sandbox for a clean, deterministic run.
    setSandboxState(DEFAULT_SANDBOX_STATE);
    setCandidatesEvaluated([]);
    setSteps(DEFAULT_PLAN_STEPS.map((s) => ({ ...s, status: 'QUEUED' })));
    setCompletedTaskModal(null);

    setActivities([
      {
        id: `act-start-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: `Task initiated: "${goal}". Synthesizing execution plan.`,
        type: 'info',
      },
    ]);

    try {
      await executeNexusTask({
        goal,
        adaptiveRecoveryEnabled,
        onStepsChange: setSteps,
        onActivity: (act) => setActivities((prev) => [...prev, act]),
        onSandboxChange: setSandboxState,
        onStatusChange: setAgentStatus,
        onCandidatesEvaluated: setCandidatesEvaluated,
        onFinish: (taskRecord, sessionRecord) => {
          setAgentStatus('COMPLETED');
          setTaskHistory((prev) => [taskRecord, ...prev]);
          setSessions((prev) => [sessionRecord, ...prev]);
          setCompletedTaskModal(taskRecord);
        },
        cancelSignal: cancelRef.current,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown execution error';
      console.error('NEXUS task execution failed:', error);
      setAgentStatus('READY');
      executionRef.current = false;
      setActivities((prev) => [
        ...prev,
        {
          id: `act-error-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          message: `Execution stopped safely: ${message}`,
          type: 'warning',
        },
      ]);
    } finally {
      executionRef.current = false;
    }
  };

  const handleCancelTask = () => {
    if (!executionRef.current) return;
    cancelRef.current.cancelled = true;
    executionRef.current = false;
    setAgentStatus('READY');
    setActivities((prev) => [
      ...prev,
      {
        id: `act-cancel-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: 'Execution cancelled by operator. Sandbox state preserved for inspection.',
        type: 'warning',
      },
    ]);
  };

  const handleResetDemo = () => {
    cancelRef.current.cancelled = true;
    executionRef.current = false;
    setAgentStatus('READY');
    setSandboxState(DEFAULT_SANDBOX_STATE);
    setCandidatesEvaluated([]);
    setSteps(DEFAULT_PLAN_STEPS.map((s) => ({ ...s, status: 'QUEUED' })));
    setActivities([
      {
        id: `reset-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: 'Demo state reset. NEXUS ready for next execution.',
        type: 'info',
      },
    ]);
  };

  const handleManualAddToCart = (product: Product) => {
    setSandboxState((prev) => {
      const existing = prev.cart.find((i) => i.product.id === product.id);
      let updatedCart;
      if (existing) {
        updatedCart = prev.cart.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedCart = [...prev.cart, { product, quantity: 1 }];
      }
      return {
        ...prev,
        cart: updatedCart,
        cartOpen: true,
      };
    });
  };

  const handleClearHistory = () => {
    setTaskHistory([]);
    setSessions([]);
    try {
      localStorage.removeItem('nexus_saas_tasks');
      localStorage.removeItem('nexus_saas_sessions');
    } catch (e) { /* Storage may be unavailable in restricted browser contexts. */ }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-200 flex font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Compact Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        taskCount={taskHistory.length}
      />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          status={
            agentStatus === 'PLANNING' || agentStatus === 'OPERATING'
              ? 'WORKING'
              : agentStatus === 'RECOVERING'
              ? 'ADAPTING'
              : agentStatus === 'VERIFYING' || agentStatus === 'COMPLETED'
              ? 'VERIFIED'
              : 'READY'
          }
        />

        {/* Dynamic Workspace Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 max-w-[1550px] w-full mx-auto">
          {currentTab === 'run_task' && (
            <>
              {/* Task Hero Input (The Obvious Focal Point) */}
              <TaskInputHero
                taskInput={taskInput}
                onTaskInputChange={setTaskInput}
                isRunning={isRunning}
                onRunTask={handleRunTask}
                onCancelTask={handleCancelTask}
                onResetDemo={handleResetDemo}
                onToggleViewPlan={() => setShowPlanPreview((prev) => !prev)}
                showPlanPreview={showPlanPreview}
                adaptiveRecovery={adaptiveRecoveryEnabled}
                onToggleAdaptiveRecovery={() =>
                  setAdaptiveRecoveryEnabled((prev) => !prev)
                }
              />

              {/* Operator telemetry: turns the landing view into a working console */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
                {[
                  { label: 'Completed runs', value: taskHistory.length, hint: taskHistory.length ? `${taskHistory.filter((t) => t.status === 'Recovered').length} recovered` : 'No runs yet' },
                  { label: 'Avg confidence', value: taskHistory.length ? `${Math.round(taskHistory.reduce((sum, t) => sum + t.confidence, 0) / taskHistory.length)}%` : '—', hint: 'Across verified tasks' },
                  { label: 'Browser sessions', value: sessions.length, hint: isRunning ? '1 session active' : 'Sandbox idle' },
                  { label: 'Agent mode', value: adaptiveRecoveryEnabled ? 'Adaptive' : 'Standard', hint: adaptiveRecoveryEnabled ? 'Self-healing enabled' : 'Recovery disabled' },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-[#1e2230] bg-[#0e1017] px-3 py-2.5">
                    <div className="text-[10px] uppercase tracking-wider font-mono text-gray-500">{metric.label}</div>
                    <div className="flex items-end justify-between gap-2 mt-1">
                      <span className="text-lg font-bold text-white font-mono">{metric.value}</span>
                      <span className="text-[10px] text-gray-500 text-right">{metric.hint}</span>
                    </div>
                  </div>
                ))}
              </div>

              {showPlanPreview && (
                <section className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider font-mono">Execution plan preview</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">NEXUS will convert the instruction into observable browser actions.</p>
                    </div>
                    <span className="text-[10px] font-mono text-blue-400">{steps.length} stages</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {steps.map((step) => (
                      <div key={step.id} className="rounded-lg border border-[#20283a] bg-[#0e131e] px-2.5 py-2">
                        <div className="text-[9px] font-mono text-gray-600">0{step.number}</div>
                        <div className="text-[11px] text-gray-200 mt-0.5">{step.label}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Minimal 3-Stage Architecture Strip */}
              <HowItWorks />

              {/* Live Execution Workspace (Hero Layout: Left Plan, Center Browser, Right Activity) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch min-h-[540px]">
                {/* LEFT: Agent Plan (col-span-3) */}
                <div className="lg:col-span-3 min-h-[260px] lg:min-h-[540px]">
                  <ExecutionTimeline steps={steps} />
                </div>

                {/* CENTER: Live Browser Sandbox (Hero Dominating Viewport, col-span-6) */}
                <div className="lg:col-span-6 min-h-[480px] lg:min-h-[540px]">
                  <SandboxBrowser
                    sandboxState={sandboxState}
                    onUpdateState={setSandboxState}
                    onManualAddToCart={handleManualAddToCart}
                  />
                </div>

                {/* RIGHT: Agent Activity & Decision System (col-span-3) */}
                <div className="lg:col-span-3 min-h-[280px] lg:min-h-[540px]">
                  <AgentActivityPanel
                    activities={activities}
                    candidates={
                      candidatesEvaluated.length > 0 ? candidatesEvaluated : undefined
                    }
                  />
                </div>
              </div>

              {taskHistory.length > 0 && (
                <section className="border border-[#1e2230] rounded-xl bg-[#0e1017] p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">Recent executions</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">Persistent audit trail from the operator workspace.</p>
                    </div>
                    <button onClick={() => setCurrentTab('task_history')} className="text-[11px] text-blue-400 hover:text-blue-300 font-medium">View all →</button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-2">
                    {taskHistory.slice(0, 3).map((task) => (
                      <button key={task.id} onClick={() => setCompletedTaskModal(task)} className="text-left p-2.5 rounded-lg border border-[#202536] bg-[#10131c] hover:bg-[#151a27] hover:border-[#2b344b] transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-gray-500">{task.timestamp} · {task.duration}</span>
                          <span className="text-[9px] font-mono text-emerald-400">{task.confidence}%</span>
                        </div>
                        <div className="text-xs font-semibold text-white mt-1 truncate">{task.scenarioTitle}</div>
                        <div className="text-[10px] text-gray-400 mt-1 line-clamp-2">{task.resultSummary}</div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {currentTab === 'task_history' && (
            <TaskHistoryScreen
              tasks={taskHistory}
              onSelectTask={(task) => setCompletedTaskModal(task)}
              onClearHistory={handleClearHistory}
              onNewTask={() => setCurrentTab('run_task')}
            />
          )}

          {currentTab === 'browser_sessions' && (
            <BrowserSessionsScreen
              sessions={sessions}
              onOpenSession={(sessId) => {
                const matched = taskHistory.find(
                  (t) =>
                    t.id === sessId ||
                    sessions.find((s) => s.id === sessId)?.taskId === t.id
                );
                if (matched) setCompletedTaskModal(matched);
                else setCurrentTab('run_task');
              }}
              onNewTask={() => setCurrentTab('run_task')}
            />
          )}

          {(currentTab === 'integrations' || currentTab === 'settings') && (
            <SettingsScreen
              onResetAllData={() => {
                handleClearHistory();
                handleResetDemo();
              }}
            />
          )}
        </main>
      </div>

      {/* Verified Task Completed Modal (The Result Hierarchy) */}
      {completedTaskModal && (
        <TaskCompletedModal
          task={completedTaskModal}
          onClose={() => setCompletedTaskModal(null)}
          onRunAgain={() => {
            setCompletedTaskModal(null);
            setCurrentTab('run_task');
            handleRunTask(completedTaskModal.goal);
          }}
          onViewExecution={() => {
            setCompletedTaskModal(null);
          }}
        />
      )}
    </div>
  );
}
