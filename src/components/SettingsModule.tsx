import React, { useState } from 'react';
import { AppSettings, Student, Subject, MarkRecord, AttendanceRecord } from '../types';
import { 
  Settings as SettingsIcon, Sliders, RefreshCw, Database, 
  CheckCircle, AlertTriangle, Download, ShieldAlert 
} from 'lucide-react';

interface Props {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetSampleData: () => void;
  students: Student[];
  subjects: Subject[];
  marks: MarkRecord[];
  attendance: AttendanceRecord[];
}

export const SettingsModule: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  onResetSampleData,
  students,
  subjects,
  marks,
  attendance,
}) => {
  const [passingPct, setPassingPct] = useState(String(settings.passingPercentage));
  const [attWarn, setAttWarn] = useState(String(settings.attendanceWarningThreshold));
  const [supportScore, setSupportScore] = useState(String(settings.academicSupportScoreThreshold));
  const [highPerf, setHighPerf] = useState(String(settings.highPerformanceThreshold));
  const [academicYear, setAcademicYear] = useState(settings.defaultAcademicYear);
  const [includeExcused, setIncludeExcused] = useState(settings.includeExcusedInAttendance);

  const [saveNotice, setSaveNotice] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const pass = parseFloat(passingPct) || 40;
    const att = parseFloat(attWarn) || 75;
    const sup = parseFloat(supportScore) || 40;
    const high = parseFloat(highPerf) || 80;

    onUpdateSettings({
      passingPercentage: pass,
      attendanceWarningThreshold: att,
      academicSupportScoreThreshold: sup,
      highPerformanceThreshold: high,
      defaultAcademicYear: academicYear.trim(),
      includeExcusedInAttendance: includeExcused
    });

    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  const exportFullBackupJson = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      settings,
      students,
      subjects,
      marks,
      attendance
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SPAS_Institutional_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System Preferences & Data Management</h2>
          <p className="text-xs text-slate-500">
            Tune academic alert cutoffs, modify evaluation rules, and manage sample records
          </p>
        </div>

        {saveNotice && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded animate-pulse">
            ✓ Settings Saved & Alert Engine Recalculated!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Threshold Settings Form */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Academic Performance Benchmarks</span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Standard Assessment Passing Percentage (%)
              </label>
              <input
                type="number"
                value={passingPct}
                onChange={e => setPassingPct(e.target.value)}
                min="0"
                max="100"
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-800"
                required
              />
              <span className="text-[11px] text-slate-400">Used for pass/fail classification across all courses.</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Attendance Warning Threshold (%)
              </label>
              <input
                type="number"
                value={attWarn}
                onChange={e => setAttWarn(e.target.value)}
                min="0"
                max="100"
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-800"
                required
              />
              <span className="text-[11px] text-slate-400">Students with attendance below this cutoff trigger warning alerts.</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Academic Support Score Cutoff (%)
              </label>
              <input
                type="number"
                value={supportScore}
                onChange={e => setSupportScore(e.target.value)}
                min="0"
                max="100"
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-800"
                required
              />
              <span className="text-[11px] text-slate-400">Students with mean score below this cutoff trigger supportive review alerts.</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                High Performance Benchmark (%)
              </label>
              <input
                type="number"
                value={highPerf}
                onChange={e => setHighPerf(e.target.value)}
                min="0"
                max="100"
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-800"
                required
              />
              <span className="text-[11px] text-slate-400">Qualifies students for top achiever classification on dashboard.</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Default Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                required
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={includeExcused}
                  onChange={e => setIncludeExcused(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium">Treat Excused Absences as Countable Sessions</span>
              </label>
              <p className="text-[11px] text-slate-400 ml-5 mt-0.5">
                Default is unchecked (Excused absences do not penalize percentage).
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-xs transition cursor-pointer"
              >
                Apply Threshold Changes
              </button>
            </div>
          </form>
        </div>

        {/* 2. Data Store & Sample Reset */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
              <Database className="w-4 h-4 text-blue-600" />
              <span>In-Memory Data Store Status</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-500 font-semibold text-[11px]">STUDENT RECORDS</div>
                <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{students.length}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-500 font-semibold text-[11px]">SUBJECTS REGISTERED</div>
                <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{subjects.length}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-500 font-semibold text-[11px]">ASSESSMENT MARKS</div>
                <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{marks.length}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-500 font-semibold text-[11px]">ATTENDANCE RECORDS</div>
                <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{attendance.length}</div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-600">Export Complete State Backup:</span>
              <button
                onClick={exportFullBackupJson}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded border border-slate-300 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>
            </div>
          </div>

          {/* Reset Box */}
          <div className="bg-red-50/50 p-6 rounded-lg border border-red-200 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Reset to Sample Dataset</span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Restores the default academic database containing 24 realistic fictional students across Sections A & B, 6 Core Subjects, 12 attendance dates, and varied scores for performance analytics.
            </p>

            <button
              onClick={() => setResetConfirmOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-xs transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Sample Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-red-200 w-full max-w-sm p-5 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Restore Sample Academic Records?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              This will overwrite all active in-memory records with the initial 24 students and standard test data.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetSampleData();
                  setResetConfirmOpen(false);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded cursor-pointer"
              >
                Yes, Restore Sample Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
