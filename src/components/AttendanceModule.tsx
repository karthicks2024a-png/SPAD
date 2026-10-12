import React, { useState } from 'react';
import { Student, AttendanceRecord, AppSettings } from '../types';
import { 
  Calendar, Check, X, Clock, CheckCircle2, XCircle, 
  AlertTriangle, Save, Filter, RefreshCw 
} from 'lucide-react';

interface Props {
  students: Student[];
  attendance: AttendanceRecord[];
  settings: AppSettings;
  onSaveDailyAttendance: (records: AttendanceRecord[]) => void;
}

export const AttendanceModule: React.FC<Props> = ({
  students,
  attendance,
  settings,
  onSaveDailyAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sectionFilter, setSectionFilter] = useState('All');
  const [currentStatuses, setCurrentStatuses] = useState<Record<string, 'Present' | 'Absent' | 'Excused'>>({});
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Initialize or fetch status for students on the selected date
  React.useEffect(() => {
    const map: Record<string, 'Present' | 'Absent' | 'Excused'> = {};
    students.forEach(s => {
      const match = attendance.find(a => a.studentId === s.studentId && a.attendanceDate === selectedDate);
      map[s.studentId] = match ? match.status : 'Present';
    });
    setCurrentStatuses(map);
  }, [selectedDate, students, attendance]);

  const activeStudents = students.filter(s => s.status === 'Active');
  const filteredStudents = activeStudents.filter(s => {
    if (sectionFilter === 'All') return true;
    return s.section.toLowerCase() === sectionFilter.toLowerCase();
  });

  const setStatusForStudent = (studentId: string, status: 'Present' | 'Absent' | 'Excused') => {
    setCurrentStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: 'Present' | 'Absent') => {
    const updated = { ...currentStatuses };
    filteredStudents.forEach(s => {
      updated[s.studentId] = status;
    });
    setCurrentStatuses(updated);
  };

  const handleSave = () => {
    const batch: AttendanceRecord[] = [];
    filteredStudents.forEach((s, idx) => {
      const status = currentStatuses[s.studentId] || 'Present';
      batch.push({
        attendanceId: `ATT-${Date.now()}-${idx + 1}`,
        studentId: s.studentId,
        subjectId: 'CS-CORE',
        attendanceDate: selectedDate,
        status
      });
    });

    onSaveDailyAttendance(batch);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Compute stats for current register view
  const presentCount = filteredStudents.filter(s => (currentStatuses[s.studentId] || 'Present') === 'Present').length;
  const absentCount = filteredStudents.filter(s => (currentStatuses[s.studentId] || 'Present') === 'Absent').length;
  const excusedCount = filteredStudents.filter(s => (currentStatuses[s.studentId] || 'Present') === 'Excused').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daily Attendance Register & Tracker</h2>
          <p className="text-xs text-slate-500">
            Track daily class attendance, calculate cumulative attendance percentage, and flag students at risk
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSavedNotice && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded animate-pulse">
              ✓ Saved Successfully!
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Register</span>
          </button>
        </div>
      </div>

      {/* Date & Section Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded font-mono font-medium text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Section:</span>
            <select
              value={sectionFilter}
              onChange={e => setSectionFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 font-medium"
            >
              <option value="All">All Sections (A & B)</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => markAll('Present')}
            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded font-semibold transition cursor-pointer"
          >
            ✓ Mark All Present
          </button>
          <button
            onClick={() => markAll('Absent')}
            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded font-semibold transition cursor-pointer"
          >
            ✕ Mark All Absent
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-4 gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            {filteredStudents.length}
          </span>
          <div>
            <div className="font-semibold text-slate-700">Roster Total</div>
            <div className="text-[11px] text-slate-400">Class Cohort</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            {presentCount}
          </span>
          <div>
            <div className="font-semibold text-emerald-800">Present (P)</div>
            <div className="text-[11px] text-emerald-600">{Math.round((presentCount / (filteredStudents.length || 1)) * 100)}% Today</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            {absentCount}
          </span>
          <div>
            <div className="font-semibold text-rose-800">Absent (A)</div>
            <div className="text-[11px] text-rose-600">{absentCount} Unexcused</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            {excusedCount}
          </span>
          <div>
            <div className="font-semibold text-amber-800">Excused (E)</div>
            <div className="text-[11px] text-amber-600">Neutral Policy</div>
          </div>
        </div>
      </div>

      {/* TableView */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1e293b] text-slate-200 border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Student ID</th>
                <th className="py-2.5 px-3 font-semibold">Student Name</th>
                <th className="py-2.5 px-3 font-semibold">Section</th>
                <th className="py-2.5 px-3 font-semibold">Cumulative Attendance</th>
                <th className="py-2.5 px-3 font-semibold text-center">Session Status on {selectedDate}</th>
                <th className="py-2.5 px-3 font-semibold text-right">Attendance Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(s => {
                const currentStatus = currentStatuses[s.studentId] || 'Present';
                
                // Cumulative calculation
                const records = attendance.filter(a => a.studentId === s.studentId);
                const pCount = records.filter(a => a.status === 'Present').length;
                const countable = records.filter(a => a.status === 'Present' || a.status === 'Absent').length;
                const cumRate = countable > 0 ? Math.round((pCount / countable) * 1000) / 10 : 100;
                
                const isUnderThreshold = cumRate < settings.attendanceWarningThreshold;

                return (
                  <tr 
                    key={s.studentId} 
                    className={`transition ${isUnderThreshold ? 'bg-rose-50/60 hover:bg-rose-100/70' : 'hover:bg-blue-50/50'}`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                      {s.studentId}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {s.fullName}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-600">
                      Section {s.section}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold">
                      <span className={isUnderThreshold ? 'text-rose-600' : 'text-slate-800'}>
                        {cumRate}% ({pCount}/{countable} sessions)
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setStatusForStudent(s.studentId, 'Present')}
                          className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusForStudent(s.studentId, 'Absent')}
                          className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusForStudent(s.studentId, 'Excused')}
                          className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                            currentStatus === 'Excused'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title="Medical or sanctioned absence (excluded from count)"
                        >
                          Excused
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isUnderThreshold ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Below {settings.attendanceWarningThreshold}%</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Satisfactory</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
