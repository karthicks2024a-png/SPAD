import React, { useState } from 'react';
import { Student, Subject, MarkRecord, AttendanceRecord, AppSettings } from '../types';
import { 
  User, Award, TrendingUp, AlertTriangle, CheckCircle2, 
  FileText, Download, Calendar, Mail, BookOpen, Clock, ChevronRight
} from 'lucide-react';

interface Props {
  student: Student;
  allStudents: Student[];
  subjects: Subject[];
  marks: MarkRecord[];
  attendance: AttendanceRecord[];
  settings: AppSettings;
  onSelectStudent: (student: Student) => void;
}

export const StudentProfileModule: React.FC<Props> = ({
  student,
  allStudents,
  subjects,
  marks,
  attendance,
  settings,
  onSelectStudent,
}) => {
  const [reportPreviewOpen, setReportPreviewOpen] = useState(false);

  // Student assessments
  const studentMarks = marks
    .filter(m => m.studentId === student.studentId)
    .sort((a, b) => new Date(a.assessmentDate).getTime() - new Date(b.assessmentDate).getTime());

  // Attendance
  const studentAttendance = attendance.filter(a => a.studentId === student.studentId);
  const presentCount = studentAttendance.filter(a => a.status === 'Present').length;
  const countableCount = studentAttendance.filter(a => a.status === 'Present' || a.status === 'Absent').length;
  const attendanceRate = countableCount > 0 ? Math.round((presentCount / countableCount) * 1000) / 10 : 100;

  // Overall Average
  const overallAvg = studentMarks.length > 0
    ? Math.round((studentMarks.reduce((acc, m) => acc + ((m.marksObtained / m.maxMarks) * 100), 0) / studentMarks.length) * 10) / 10
    : 0;

  // Subject breakdown
  const subjectBreakdown = subjects.map(sub => {
    const subMarks = studentMarks.filter(m => m.subjectId === sub.subjectId);
    if (subMarks.length === 0) return { subject: sub, avg: 0, count: 0 };
    const sum = subMarks.reduce((acc, m) => acc + ((m.marksObtained / m.maxMarks) * 100), 0);
    return {
      subject: sub,
      avg: Math.round((sum / subMarks.length) * 10) / 10,
      count: subMarks.length
    };
  }).filter(sb => sb.count > 0);

  const bestSubject = [...subjectBreakdown].sort((a, b) => b.avg - a.avg)[0];
  const weakSubject = [...subjectBreakdown].sort((a, b) => a.avg - b.avg)[0];

  const needsSupport = overallAvg < settings.academicSupportScoreThreshold || attendanceRate < settings.attendanceWarningThreshold;

  // Generate plain text report
  const generateReportText = () => {
    return `=================================================================
       STUDENT PERFORMANCE ANALYTICS SYSTEM - INDIVIDUAL REPORT
=================================================================
Generated: ${new Date().toLocaleString()}

Student ID   : ${student.studentId}
Full Name    : ${student.fullName}
Department   : ${student.department} (Section ${student.section})
Academic Year: ${student.academicYear}
Email        : ${student.email || 'N/A'}
Overall Avg  : ${overallAvg}%
Attendance   : ${attendanceRate}% (${presentCount}/${countableCount} sessions)
Standing     : ${needsSupport ? 'ACADEMIC SUPPORT RECOMMENDED' : 'GOOD ACADEMIC STANDING'}

-----------------------------------------------------------------
ASSESSMENT HISTORY:
-----------------------------------------------------------------
${studentMarks.map(m => {
  const sub = subjects.find(s => s.subjectId === m.subjectId);
  const pct = Math.round(((m.marksObtained / m.maxMarks) * 100) * 10) / 10;
  return `${m.assessmentDate} | ${(sub?.subjectCode || m.subjectId).padEnd(8)} | ${m.assessmentName.padEnd(18)} | ${m.marksObtained}/${m.maxMarks} (${pct}%) | ${pct >= settings.passingPercentage ? 'PASS' : 'FAIL'}`;
}).join('\n')}
=================================================================`;
  };

  const handleDownloadTxt = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SPAS_${student.studentId}_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700">Select Student Profile:</label>
          <select
            value={student.studentId}
            onChange={e => {
              const found = allStudents.find(s => s.studentId === e.target.value);
              if (found) onSelectStudent(found);
            }}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-xs font-semibold bg-white text-slate-800"
          >
            {allStudents.map(s => (
              <option key={s.studentId} value={s.studentId}>
                {s.fullName} ({s.studentId}) - Section {s.section}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportPreviewOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded border border-slate-300 transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Preview Report</span>
          </button>
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Report (.txt)</span>
          </button>
        </div>
      </div>

      {/* 2. Demographics Card */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold font-mono">
            {student.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">{student.fullName}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {student.studentId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
              <span>{student.department} • Section {student.section}</span>
              <span>•</span>
              <span>Term {student.academicYear}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Mail className="w-3 h-3 text-slate-400" />
                {student.email || 'No email registered'}
              </span>
            </p>
          </div>
        </div>

        {/* Big Metrics */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-right min-w-[110px]">
            <div className="text-[11px] text-slate-500 font-semibold">OVERALL SCORE</div>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">{overallAvg}%</div>
            <div className="text-[10px] text-slate-400 font-medium">Class Avg Benchmark</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-right min-w-[110px]">
            <div className="text-[11px] text-slate-500 font-semibold">ATTENDANCE</div>
            <div className="text-2xl font-bold text-emerald-600 font-mono mt-0.5">{attendanceRate}%</div>
            <div className="text-[10px] text-slate-400 font-medium">{presentCount}/{countableCount} sessions</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-right min-w-[130px]">
            <div className="text-[11px] text-slate-500 font-semibold">STATUS</div>
            <div className={`text-sm font-bold mt-1.5 flex items-center justify-end gap-1 ${
              needsSupport ? 'text-rose-600' : 'text-emerald-700'
            }`}>
              {needsSupport ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{needsSupport ? 'Support Alert' : 'Good Standing'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Strengths, Weaknesses & Chronological Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Insights */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Subject Strengths & Focus Areas</span>
          </h3>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
              🌟 Strongest Subject
            </div>
            {bestSubject ? (
              <div className="mt-1">
                <div className="text-sm font-bold text-slate-900">{bestSubject.subject.subjectName}</div>
                <div className="text-xs text-emerald-700 font-mono font-bold mt-0.5">
                  {bestSubject.avg}% Average Score ({bestSubject.subject.subjectCode})
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic mt-1">No exam records</div>
            )}
          </div>

          <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
            <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">
              🎯 Priority Focus Area
            </div>
            {weakSubject ? (
              <div className="mt-1">
                <div className="text-sm font-bold text-slate-900">{weakSubject.subject.subjectName}</div>
                <div className="text-xs text-rose-700 font-mono font-bold mt-0.5">
                  {weakSubject.avg}% Average Score ({weakSubject.subject.subjectCode})
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic mt-1">No exam records</div>
            )}
          </div>

          {/* Support Recommendation */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-800">Pedagogical Recommendation: </span>
            {needsSupport
              ? 'Schedule a collaborative advising appointment to review challenging core syllabus units and explore practice problem sessions.'
              : 'Consistent strong trajectory. Encourage independent project work and mentoring opportunities with peers.'}
          </div>
        </div>

        {/* Chronological Score Progression LineChart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Score Progression Trend (LineChart)</span>
              </h3>
              <p className="text-xs text-slate-500">Exam-by-exam percentage trajectory across all subjects</p>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
              {studentMarks.length} Assessment Milestones
            </span>
          </div>

          <div className="h-56 flex flex-col justify-between pt-4 pb-2 border-b border-l border-slate-200 relative px-4">
            {studentMarks.length > 0 ? (
              <svg viewBox="0 0 300 130" className="w-full h-full overflow-visible">
                {/* Horizontal guide lines */}
                <line x1="0" y1="26" x2="300" y2="26" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="65" x2="300" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="104" x2="300" y2="104" stroke="#f1f5f9" strokeWidth="1" />

                {/* Path line */}
                {(() => {
                  const points = studentMarks.map((m, idx) => {
                    const x = 20 + (idx * ((300 - 40) / Math.max(1, studentMarks.length - 1)));
                    const pct = (m.marksObtained / m.maxMarks) * 100;
                    const y = 120 - (pct / 100) * 105;
                    return { x, y, m, pct };
                  });

                  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');

                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={polylineStr}
                      />
                      {points.map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">
                            {Math.round(p.pct)}%
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 italic text-xs">
                No assessments recorded for this student yet.
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
            <span>Chronological order</span>
            <span>Shows student growth and exam performance velocity</span>
          </div>
        </div>
      </div>

      {/* 4. Complete Assessment History Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Detailed Assessment History & Exam Ledger
          </h4>
          <span className="text-[11px] font-mono text-slate-500">
            {studentMarks.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Date</th>
                <th className="py-2.5 px-3 font-semibold">Subject</th>
                <th className="py-2.5 px-3 font-semibold">Assessment</th>
                <th className="py-2.5 px-3 font-semibold">Type</th>
                <th className="py-2.5 px-3 font-semibold">Marks Obtained</th>
                <th className="py-2.5 px-3 font-semibold">Percentage</th>
                <th className="py-2.5 px-3 font-semibold text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentMarks.map(m => {
                const sub = subjects.find(s => s.subjectId === m.subjectId);
                const pct = Math.round(((m.marksObtained / m.maxMarks) * 100) * 10) / 10;
                const isPass = pct >= settings.passingPercentage;

                return (
                  <tr key={m.assessmentId} className="hover:bg-blue-50/40">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{m.assessmentDate}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {sub ? sub.subjectName : m.subjectId}
                      <span className="ml-1.5 text-slate-400 font-mono text-[10px]">({sub ? sub.subjectCode : ''})</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-semibold">{m.assessmentName}</td>
                    <td className="py-2.5 px-3 text-slate-500">{m.assessmentType}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{m.marksObtained} / {m.maxMarks}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{pct}%</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isPass ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview Modal */}
      {reportPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0f172a] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Official Student Academic Report Preview</span>
              </h3>
              <button onClick={() => setReportPreviewOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-900 text-slate-200">
              <pre className="text-xs font-mono whitespace-pre-wrap overflow-y-auto max-h-96 leading-relaxed">
                {generateReportText()}
              </pre>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setReportPreviewOpen(false)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={handleDownloadTxt}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer"
              >
                Download Text File (.txt)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
