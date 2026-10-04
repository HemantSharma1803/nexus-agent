import React from 'react';
import { TaskRecord } from '../types';
import { History, CheckCircle2, Clock, Trash2, ArrowRight } from 'lucide-react';

interface TaskHistoryScreenProps {
  tasks: TaskRecord[];
  onSelectTask: (task: TaskRecord) => void;
  onClearHistory: () => void;
  onNewTask: () => void;
}

export const TaskHistoryScreen: React.FC<TaskHistoryScreenProps> = ({
  tasks,
  onSelectTask,
  onClearHistory,
  onNewTask,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Task History</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Audit log of autonomous browser runs and verified outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tasks.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent hover:border-red-500/30 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
          <button
            onClick={onNewTask}
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5"
          >
            <span>Run Task</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 border border-[#1e2230] rounded-xl bg-[#0e1017] p-8">
          <History className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-gray-300">No task history yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Execute a task from the Run Task console to record autonomous browser execution logs.
          </p>
          <button
            onClick={onNewTask}
            className="mt-4 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Run first task
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="p-3.5 rounded-lg border border-[#1e2230] bg-[#0e1017] hover:bg-[#121622] hover:border-[#2a3045] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">
                    {task.goal}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                      task.status === 'Recovered'
                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Result: <span className="text-gray-200">{task.resultSummary}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-gray-400 shrink-0">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  {task.duration}
                </span>
                <span>{task.actionsCount} actions</span>
                <span className="text-gray-500 text-[11px]">{task.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
