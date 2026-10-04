import React from 'react';
import { TaskRecord } from '../types';
import { CheckCircle2, Star, Check, RotateCcw, X, Eye } from 'lucide-react';

interface TaskCompletedModalProps {
  task: TaskRecord;
  onClose: () => void;
  onRunAgain: () => void;
  onViewExecution: () => void;
}

export const TaskCompletedModal: React.FC<TaskCompletedModalProps> = ({
  task,
  onClose,
  onRunAgain,
  onViewExecution,
}) => {
  const product = task.selectedProduct;
  const isComparison = task.scenarioTitle === 'Compare Products';
  const isVerification = task.scenarioTitle === 'Find & Verify';
  const actionLabel = isComparison ? 'Recommendation prepared' : isVerification ? 'Stock criteria checked' : task.scenarioTitle === 'Data Extraction' ? 'Findings compiled' : 'Added to cart';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e111a] border border-[#262c3e] rounded-xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Execution Successful • {task.duration}
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              TASK COMPLETED
            </h2>
          </div>
        </div>

        {/* Best Match Hero Section */}
        {product && (
          <div className="p-3.5 rounded-lg bg-[#141824] border border-[#222738] mb-3.5">
            <div className="text-[10px] font-mono uppercase text-blue-400 font-semibold tracking-wide mb-1">
              Best Match Found
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-300">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)} ★</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    ({product.reviewsCount.toLocaleString()} reviews)
                  </span>
                </div>
              </div>
              <div className="text-base font-bold text-white font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}

        {/* Verified Result Checklist */}
        <div className="p-3 rounded-lg bg-[#10131d] border border-[#1e2230] space-y-1.5 mb-3.5 text-xs">
          <div className="text-gray-200 flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            <span>Within budget</span>
          </div>
          <div className="text-gray-200 flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            <span>In stock</span>
          </div>
          <div className="text-gray-200 flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            <span>{actionLabel}</span>
          </div>
          <div className="text-gray-200 flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            <span>Result verified</span>
          </div>
        </div>

        {/* Confidence metric */}
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-4 px-1">
          <span>{task.productsEvaluated} candidates evaluated</span>
          <span>{task.actionsCount} actions completed</span>
        </div>

        {/* Actions Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onViewExecution}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-gray-300 bg-[#141824] hover:bg-[#1a2030] border border-[#222738] transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View execution</span>
          </button>
          <button
            onClick={onRunAgain}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Run again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
