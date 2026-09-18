import React from 'react';
import {
  FileEdit,
  Clock,
  CheckCircle2,
  PenTool,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Ban,
} from 'lucide-react';

interface StateMachineVisualizerProps {
  status: number | string;
}

const parseStatusNumber = (status: number | string): number => {
  if (typeof status === 'number') return status;
  switch (status?.toLowerCase()) {
    case 'draft': return 0;
    case 'pendingapproval': return 1;
    case 'approved': return 2;
    case 'signed': return 3;
    case 'active': return 4;
    case 'expiring': return 5;
    case 'terminated': return 6;
    case 'renewed': return 7;
    default: return 0;
  }
};

export const StateMachineVisualizer: React.FC<StateMachineVisualizerProps> = ({ status }) => {
  const currentNum = parseStatusNumber(status);

  // Main happy-path flow
  const steps = [
    { num: 0, label: 'Soạn Thảo (Draft)', icon: FileEdit },
    { num: 1, label: 'Chờ Phê Duyệt', icon: Clock },
    { num: 2, label: 'Đã Duyệt', icon: CheckCircle2 },
    { num: 3, label: 'Đã Ký Số', icon: PenTool },
    { num: 4, label: 'Hiệu Lực (Active)', icon: ShieldCheck },
  ];

  const isSpecialState = currentNum >= 5;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Tiến Trình Vòng Đời Hợp Đồng (Contract State Machine)
        </h3>
        {currentNum === 5 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" /> Sắp Hết Hạn
          </span>
        )}
        {currentNum === 6 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <Ban className="w-3.5 h-3.5" /> Đã Chấm Dứt / Thanh Lý
          </span>
        )}
        {currentNum === 7 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
            <RotateCcw className="w-3.5 h-3.5" /> Đã Gia Hạn
          </span>
        )}
      </div>

      <div className="relative">
        {/* Step indicators */}
        <div className="grid grid-cols-5 gap-2 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = !isSpecialState ? currentNum > step.num : true;
            const isCurrent = currentNum === step.num;

            return (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105 ring-4 ring-blue-100'
                      : isCompleted
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`mt-2 text-[11px] font-medium leading-tight ${
                    isCurrent
                      ? 'text-blue-600 font-bold'
                      : isCompleted
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Bước {idx + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar Line */}
        <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width: isSpecialState
                ? '100%'
                : `${Math.min(100, (currentNum / 4) * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
