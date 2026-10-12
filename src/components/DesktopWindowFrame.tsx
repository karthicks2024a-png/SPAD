import React from 'react';
import { 
  Minus, Square, X, Download, Code, Sparkles, RefreshCw, 
  HelpCircle, ShieldCheck, Database, Layers
} from 'lucide-react';

interface Props {
  activeModule: string;
  onNavigate: (module: any) => void;
  onOpenSourceModal: () => void;
  onResetSampleData: () => void;
  totalStudents: number;
  totalAlerts: number;
}

export const DesktopWindowFrame: React.FC<Props> = ({
  activeModule,
  onNavigate,
  onOpenSourceModal,
  onResetSampleData,
  totalStudents,
  totalAlerts,
}) => {
  return (
    <div className="bg-[#0f172a] text-slate-200 select-none border-b border-slate-800">
      {/* 1. Window Title Bar (Mac/Windows desktop emulation) */}
      <div className="flex items-center justify-between px-3 py-1.5 text-xs border-b border-slate-800/80 bg-[#090d16]">
        <div className="flex items-center gap-2">
          {/* Mac-style traffic lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#ef4444] inline-block hover:opacity-80 transition cursor-pointer" title="Close" />
            <span className="w-3 h-3 rounded-full bg-[#f59e0b] inline-block hover:opacity-80 transition cursor-pointer" title="Minimize" />
            <span className="w-3 h-3 rounded-full bg-[#10b981] inline-block hover:opacity-80 transition cursor-pointer" title="Maximize" />
          </div>
          <span className="font-semibold text-slate-300 tracking-wide flex items-center gap-1.5">
            <span className="text-blue-400">📊</span>
            Student Performance Analytics System (SPAS) • Java 17 / JavaFX 21 Desktop
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="text-[11px] bg-slate-800/90 text-blue-300 px-2 py-0.5 rounded border border-blue-900/50 flex items-center gap-1 font-mono">
            <Layers className="w-3 h-3 text-blue-400" />
            JavaFX Modena Runtime Active
          </span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Minus className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
            <Square className="w-3 h-3 hover:text-white cursor-pointer" />
            <X className="w-3.5 h-3.5 hover:text-red-400 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* 2. Desktop Application Menu Bar */}
      <div className="flex items-center justify-between px-4 py-1 text-xs bg-[#1e293b]/90 border-b border-slate-700/60 text-slate-300">
        <div className="flex items-center gap-4">
          <div className="dropdown relative group cursor-pointer hover:text-white font-medium">
            <span>File</span>
            <div className="hidden group-hover:block absolute left-0 top-full mt-0.5 bg-[#0f172a] border border-slate-700 rounded shadow-xl py-1 w-48 z-50">
              <button onClick={() => onNavigate('Students')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">New Student Record...</button>
              <button onClick={() => onNavigate('Marks')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Record Exam Marks...</button>
              <div className="h-px bg-slate-800 my-1" />
              <button onClick={() => onNavigate('Reports')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Export Reports (CSV/TXT)...</button>
              <button onClick={onResetSampleData} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Restore Sample Data...</button>
            </div>
          </div>

          <div className="dropdown relative group cursor-pointer hover:text-white font-medium">
            <span>Modules</span>
            <div className="hidden group-hover:block absolute left-0 top-full mt-0.5 bg-[#0f172a] border border-slate-700 rounded shadow-xl py-1 w-52 z-50">
              <button onClick={() => onNavigate('Dashboard')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Dashboard Overview</button>
              <button onClick={() => onNavigate('Students')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Student Management</button>
              <button onClick={() => onNavigate('Subjects')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Subject & Grading</button>
              <button onClick={() => onNavigate('Marks')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Assessment & Marks</button>
              <button onClick={() => onNavigate('Attendance')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Attendance Tracker</button>
              <button onClick={() => onNavigate('Profile')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Academic Profile</button>
              <button onClick={() => onNavigate('Analytics')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Performance Analytics</button>
              <button onClick={() => onNavigate('Alerts')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Academic Alerts</button>
            </div>
          </div>

          <div className="dropdown relative group cursor-pointer hover:text-white font-medium">
            <span>Tools</span>
            <div className="hidden group-hover:block absolute left-0 top-full mt-0.5 bg-[#0f172a] border border-slate-700 rounded shadow-xl py-1 w-52 z-50">
              <button onClick={() => onNavigate('Settings')} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">Configure Thresholds...</button>
              <button onClick={onOpenSourceModal} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white text-slate-300 text-xs">JavaFX Source Code Explorer</button>
            </div>
          </div>

          <button onClick={onOpenSourceModal} className="hover:text-blue-300 font-medium flex items-center gap-1 text-blue-400">
            <Code className="w-3.5 h-3.5" />
            <span>Java Source Code & Maven ZIP</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px]">
            In-Memory Store: <strong className="text-slate-200">{totalStudents} Students</strong>
          </span>
          {totalAlerts > 0 && (
            <button 
              onClick={() => onNavigate('Alerts')} 
              className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[11px] font-semibold hover:bg-amber-500/30 transition flex items-center gap-1"
            >
              ⚠️ {totalAlerts} Support Alerts
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
