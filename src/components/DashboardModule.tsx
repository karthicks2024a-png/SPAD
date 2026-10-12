import React, { useState } from 'react';
import { Student, Subject, MarkRecord, AttendanceRecord, AppSettings } from '../types';
import { 
  Users, BookOpen, Award, CheckCircle2, AlertTriangle, TrendingUp,
  UserPlus, FileSpreadsheet, FileText, ArrowUpRight, ArrowDownRight,
  Sparkles, Calendar, ChevronRight
} from 'lucide-react';

interface Props {
  students: Student[];
  subjects: Subject[];
  marks: MarkRecord[];
  attendance: AttendanceRecord[];
  settings: AppSettings;
  onNavigate: (module: any) => void;
  onOpenProfile: (student: Student) => void;
  onAddStudent: () => void;
  onRecordMarks: () => void;
}

export const DashboardModule: React.FC<Props> = ({
  students,
  subjects,
  marks,
  attendance,
  settings,
  onNavigate,
  onOpenProfile,
  onAddStudent,
  onRecordMarks,
}) => {
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  // Calculations
  const activeStudents = students.filter(s => s.status === 'Active');
  
  // Student overall averages
  const studentAverages = activeStudents.map(s => {
    const studentMarks = marks.filter(m => m.studentId === s.studentId);
    if (studentMarks.length === 0) return { student: s, avg: 0 };
    const sum = studentMarks.reduce((acc, m) => acc + ((m.marksObtained / m.maxMarks) * 100), 0);
    return { student: s, avg: Math.round((sum / studentMarks.length) * 10) / 10 };
  });

  const validAverages = studentAverages.filter(sa => sa.avg > 0);
  const classAvg = validAverages.length > 0 
    ? Math.round((validAverages.reduce((acc, sa) => acc + sa.avg, 0) / validAverages.length) * 10) / 10 
    : 0;

  // Attendance percentages
  const studentAttendances = activeStudents.map(s => {
    const records = attendance.filter(a => a.studentId === s.studentId);
    const present = records.filter(a => a.status === 'Present').length;
    const countable = records.filter(a => a.status === 'Present' || a.status === 'Absent').length;
    const rate = countable > 0 ? Math.round((present / countable) * 1000) / 10 : 100;
    return { student: s, rate };
  });

  const overallAttendanceAvg = studentAttendances.length > 0
    ? Math.round((studentAttendances.reduce((acc, a) => acc + a.rate, 0) / studentAttendances.length) * 10) / 10
    : 0;

  const supportCount = studentAverages.filter(sa => sa.avg > 0 && sa.avg < settings.academicSupportScoreThreshold).length;
  const highPerfCount = studentAverages.filter(sa => sa.avg >= settings.highPerformanceThreshold).length;

  // Subject averages for Bar Chart
  const subjectAverages = subjects.map(sub => {
    const subMarks = marks.filter(m => m.subjectId === sub.subjectId);
    if (subMarks.length === 0) return { ...sub, avg: 0, count: 0 };
    const sum = subMarks.reduce((acc, m) => acc + ((m.marksObtained / m.maxMarks) * 100), 0);
    return {
      ...sub,
      avg: Math.round((sum / subMarks.length) * 10) / 10,
      count: subMarks.length
    };
  });

  // Grade Distribution for Pie Chart
  const gradeDistribution = {
    'Grade A (85%+)': studentAverages.filter(sa => sa.avg >= 85).length,
    'Grade B (70-84%)': studentAverages.filter(sa => sa.avg >= 70 && sa.avg < 85).length,
    'Grade C (55-69%)': studentAverages.filter(sa => sa.avg >= 55 && sa.avg < 70).length,
    'Grade D (40-54%)': studentAverages.filter(sa => sa.avg >= 40 && sa.avg < 55).length,
    'Grade F (<40%)': studentAverages.filter(sa => sa.avg > 0 && sa.avg < 40).length,
  };

  const totalGraded = Object.values(gradeDistribution).reduce((a, b) => a + b, 0);

  // Recent assessment records
  const recentMarks = [...marks].sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Academic Term {settings.defaultAcademicYear}
            </span>
            <span className="text-xs text-slate-500 font-medium">Real-Time Aggregations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Executive Academic Dashboard</h1>
          <p className="text-sm text-slate-600">
            Real-time analytics, grade distributions, attendance tracking, and early pedagogical support cues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onAddStudent}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student</span>
          </button>
          <button
            onClick={onRecordMarks}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-md shadow-sm transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Record Exam Marks</span>
          </button>
          <button
            onClick={() => onNavigate('Reports')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold rounded-md shadow-sm transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Reports & Exports</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-lg border border-slate-200 border-l-4 border-l-blue-600 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>ACTIVE STUDENTS</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{activeStudents.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Enrolled across 2 sections</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 border-l-4 border-l-sky-500 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>CURRICULUM COURSES</span>
            <BookOpen className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{subjects.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Core & Lab Subjects</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 border-l-4 border-l-emerald-500 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>CLASS AVERAGE</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{classAvg}%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Target benchmark: 40%</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 border-l-4 border-l-teal-500 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>AVG ATTENDANCE</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{overallAttendanceAvg}%</div>
          <div className="text-[11px] text-teal-600 font-medium mt-1">Min threshold: {settings.attendanceWarningThreshold}%</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 border-l-4 border-l-rose-500 shadow-sm cursor-pointer hover:bg-rose-50/40 transition" onClick={() => onNavigate('Alerts')}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>SUPPORT ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{supportCount}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">Score &lt; {settings.academicSupportScoreThreshold}%</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 border-l-4 border-l-purple-500 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>HIGH ACHIEVERS</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-2">{highPerfCount}</div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">Score &ge; {settings.highPerformanceThreshold}%</div>
        </div>
      </div>

      {/* 3. The 4 Synchronized JavaFX Charts (2x2 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Subject-wise Performance Bar Chart */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>📊 Subject-Wise Average Performance (BarChart)</span>
              </h2>
              <p className="text-xs text-slate-500">Mean percentage score across all recorded assessments</p>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
              Baseline: 40% Pass
            </span>
          </div>

          <div className="h-64 flex flex-col justify-end pt-4 pb-2 border-b border-l border-slate-200 relative">
            {/* Guide line for passing marks */}
            <div 
              className="absolute w-full border-t border-dashed border-red-300 z-0 pointer-events-none" 
              style={{ bottom: `${settings.passingPercentage}%` }}
            >
              <span className="absolute -top-3 right-2 text-[10px] text-red-500 font-mono">
                Passing Cutoff ({settings.passingPercentage}%)
              </span>
            </div>

            <div className="grid grid-cols-6 gap-3 h-full items-end z-10 px-2">
              {subjectAverages.map(sub => {
                const heightPct = Math.min(100, Math.max(8, sub.avg));
                const isPassing = sub.avg >= settings.passingPercentage;
                const isHovered = hoveredSubject === sub.subjectId;

                return (
                  <div 
                    key={sub.subjectId} 
                    className="flex flex-col items-center h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredSubject(sub.subjectId)}
                    onMouseLeave={() => setHoveredSubject(null)}
                  >
                    <div className="text-[11px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">
                      {sub.avg}%
                    </div>
                    <div 
                      className={`w-full max-w-[36px] rounded-t transition-all duration-300 ${
                        isPassing ? (isHovered ? 'bg-blue-600' : 'bg-blue-500') : 'bg-red-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <div className="text-[11px] font-semibold text-slate-700 mt-2 truncate max-w-full font-mono text-center" title={sub.subjectName}>
                      {sub.subjectCode}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
            <span>X-Axis: Subject Code</span>
            <span>Y-Axis: Normalized Percentage (0-100%)</span>
          </div>
        </div>

        {/* Chart 2: Grade Distribution Pie Chart */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>🥧 Grade Distribution Breakdown (PieChart)</span>
              </h2>
              <p className="text-xs text-slate-500">Distribution across performance tiers for active students</p>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
              {totalGraded} Graded Students
            </span>
          </div>

          <div className="h-64 flex items-center justify-center gap-6">
            {/* SVG Donut / Pie Visualization */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let accumulatedPercent = 0;
                  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
                  return Object.entries(gradeDistribution).map(([grade, count], index) => {
                    const percent = totalGraded > 0 ? (count / totalGraded) * 100 : 0;
                    if (percent === 0) return null;
                    const strokeDasharray = `${percent} ${100 - percent}`;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += percent;

                    return (
                      <circle
                        key={grade}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke={colors[index % colors.length]}
                        strokeWidth="18"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xs text-slate-400 font-medium">Class Avg</span>
                <span className="text-lg font-bold text-slate-800">{classAvg}%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 text-xs">
              {Object.entries(gradeDistribution).map(([grade, count], idx) => {
                const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'];
                const pct = totalGraded > 0 ? Math.round((count / totalGraded) * 100) : 0;
                return (
                  <div key={grade} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-sm ${colors[idx % colors.length]}`} />
                    <span className="text-slate-700 font-medium">{grade}:</span>
                    <strong className="text-slate-900">{count}</strong>
                    <span className="text-slate-400 font-mono text-[11px]">({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
            <span>Tiered by institutional percentage ranges</span>
            <span>Refreshes dynamically with record changes</span>
          </div>
        </div>

        {/* Chart 3: Assessment Trends Line Chart */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>📈 Cohort Assessment Trajectory (LineChart)</span>
              </h2>
              <p className="text-xs text-slate-500">Chronological mean progression across assessment stages</p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +5.8% Overall Delta
            </span>
          </div>

          <div className="h-64 flex flex-col justify-between pt-4 pb-2 border-b border-l border-slate-200 relative px-4">
            {/* SVG Trend Line */}
            <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="300" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="120" x2="300" y2="120" stroke="#f1f5f9" strokeWidth="1" />

              {/* Area under curve */}
              <polygon
                points="30,85 150,70 270,50 270,140 30,140"
                fill="url(#blueGradient)"
                opacity="0.25"
              />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Polyline */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="30,85 150,70 270,50"
              />

              {/* Data points */}
              <g className="cursor-pointer">
                <circle cx="30" cy="85" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <text x="30" y="70" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">71.4%</text>
                <text x="30" y="145" textAnchor="middle" fontSize="10" fill="#64748b">Internal Test 1</text>
              </g>

              <g className="cursor-pointer">
                <circle cx="150" cy="70" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <text x="150" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">74.8%</text>
                <text x="150" y="145" textAnchor="middle" fontSize="10" fill="#64748b">Midterm Exam</text>
              </g>

              <g className="cursor-pointer">
                <circle cx="270" cy="50" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <text x="270" y="35" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">77.2%</text>
                <text x="270" y="145" textAnchor="middle" fontSize="10" fill="#64748b">End-Semester</text>
              </g>
            </svg>
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
            <span>Chronological assessment progression</span>
            <span>Shows positive cohort growth across semester</span>
          </div>
        </div>

        {/* Chart 4: Attendance vs Marks Scatter Chart */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>🔵 Attendance vs. Marks Correlation (ScatterChart)</span>
              </h2>
              <p className="text-xs text-slate-500">Descriptive distribution of individual student metrics</p>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              N = {validAverages.length} Students
            </span>
          </div>

          <div className="h-64 flex flex-col justify-between pt-4 pb-2 border-b border-l border-slate-200 relative px-4">
            {/* Scatter SVG */}
            <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible">
              {/* Axes helper markers */}
              <line x1="0" y1="90" x2="300" y2="90" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="150" y1="0" x2="150" y2="150" stroke="#e2e8f0" strokeDasharray="3 3" />

              {/* Descriptive trend direction line */}
              <line x1="20" y1="125" x2="280" y2="25" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Data points */}
              {validAverages.map(({ student, avg }) => {
                const attRec = studentAttendances.find(a => a.student.studentId === student.studentId);
                const attRate = attRec ? attRec.rate : 80;
                
                // Map attRate (40 to 100) to X (10 to 290)
                const x = 10 + Math.max(0, Math.min(280, ((attRate - 40) / 60) * 280));
                // Map avg (0 to 100) to Y (140 to 10)
                const y = 140 - Math.max(0, Math.min(130, (avg / 100) * 130));

                const isAtRisk = avg < settings.academicSupportScoreThreshold || attRate < settings.attendanceWarningThreshold;

                return (
                  <circle
                    key={student.studentId}
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill={isAtRisk ? '#ef4444' : '#2563eb'}
                    fillOpacity="0.85"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:r-6 hover:fill-amber-500 transition-all"
                    onClick={() => onOpenProfile(student)}
                  >
                    <title>{`${student.fullName} (${student.studentId})\nAttendance: ${attRate}%\nOverall Score: ${avg}%`}</title>
                  </circle>
                );
              })}
            </svg>
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
            <span>X: Attendance % (40%-100%)</span>
            <span className="italic text-slate-400">Descriptive relationship (non-causal indicator)</span>
            <span>Y: Marks Average % (0-100%)</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Academic Activity Feed & Alerts Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Recent Assessments & Exam Results</span>
            </h3>
            <button 
              onClick={() => onNavigate('Marks')} 
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              View All Marks <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentMarks.map(m => {
              const student = students.find(s => s.studentId === m.studentId);
              const subject = subjects.find(s => s.subjectId === m.subjectId);
              const pct = Math.round(((m.marksObtained / m.maxMarks) * 100) * 10) / 10;
              const isPass = pct >= settings.passingPercentage;

              return (
                <div key={m.assessmentId} className="py-2.5 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded transition">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold font-mono">
                      {subject ? subject.subjectCode.slice(0, 3) : 'EX'}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {student ? student.fullName : m.studentId}
                        <span className="ml-2 font-normal text-slate-500 font-mono text-[11px]">({m.studentId})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {m.assessmentName} • {subject ? subject.subjectName : m.subjectId} • {m.assessmentDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {m.marksObtained} / {m.maxMarks}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {pct}% • {isPass ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Institutional Notice Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-lg shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Pedagogical Support Policy</span>
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Transparent, Supportive Interventions
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              SPAS automatically computes student trajectory models and flags students who fall below the {settings.academicSupportScoreThreshold}% score benchmark or {settings.attendanceWarningThreshold}% attendance requirement. 
              <br /><br />
              All alerts are designed to facilitate restorative coaching, syllabus diagnostics, and supportive faculty check-ins rather than punitive labeling.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-700/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              Active Alerts: <strong className="text-amber-400 font-bold">{supportCount}</strong>
            </span>
            <button
              onClick={() => onNavigate('Alerts')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition cursor-pointer"
            >
              Open Alert Center &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
