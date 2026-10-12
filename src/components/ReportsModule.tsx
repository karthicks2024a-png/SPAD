import React, { useState } from 'react';
import { Student, Subject, MarkRecord, AttendanceRecord, AppSettings } from '../types';
import { 
  FileText, Download, Printer, Filter, Check, 
  Copy, FileSpreadsheet, Calendar, Sparkles 
} from 'lucide-react';

interface Props {
  students: Student[];
  subjects: Subject[];
  marks: MarkRecord[];
  attendance: AttendanceRecord[];
  settings: AppSettings;
}

export const ReportsModule: React.FC<Props> = ({
  students,
  subjects,
  marks,
  attendance,
  settings,
}) => {
  const [reportType, setReportType] = useState<
    'class' | 'student' | 'subject' | 'attendance' | 'assessments' | 'support'
  >('class');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.studentId || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.subjectId || '');
  const [isCopied, setIsCopied] = useState(false);

  const activeStudents = students.filter(s => s.status === 'Active');

  // Generate Report Content
  const timestamp = new Date().toLocaleString();

  let previewText = '';
  let csvContent = '';
  let filenameBase = 'SPAS_Report';

  if (reportType === 'class') {
    filenameBase = 'SPAS_Class_Performance_Report';
    const ranked = activeStudents.map(s => {
      const sMarks = marks.filter(m => m.studentId === s.studentId);
      const avg = sMarks.length > 0
        ? Math.round((sMarks.reduce((acc, m) => acc + ((m.marksObtained / m.maxMarks) * 100), 0) / sMarks.length) * 10) / 10
        : 0;
      const sAtt = attendance.filter(a => a.studentId === s.studentId);
      const p = sAtt.filter(a => a.status === 'Present').length;
      const c = sAtt.filter(a => a.status === 'Present' || a.status === 'Absent').length;
      const attRate = c > 0 ? Math.round((p / c) * 1000) / 10 : 100;
      return { student: s, avg, attRate };
    }).sort((a, b) => b.avg - a.avg);

    previewText = `========================================================================================
             STUDENT PERFORMANCE ANALYTICS SYSTEM (SPAS) - CLASS REPORT
========================================================================================
Report Type : Cohort Performance Summary
Generated At: ${timestamp}
Academic Yr : ${settings.defaultAcademicYear}
Total Roster: ${activeStudents.length} Active Students

----------------------------------------------------------------------------------------
RANK | ID         | FULL NAME              | SECTION | OVERALL AVG % | ATTENDANCE %
----------------------------------------------------------------------------------------
${ranked.map((r, i) => 
  `${String(i + 1).padEnd(4)} | ${r.student.studentId.padEnd(10)} | ${r.student.fullName.padEnd(22)} | Sec ${r.student.section.padEnd(4)} | ${String(r.avg + '%').padStart(13)} | ${String(r.attRate + '%').padStart(12)}`
).join('\n')}
========================================================================================
END OF REPORT`;

    csvContent = `Rank,Student ID,Full Name,Department,Section,Overall Average %,Attendance %\n` +
      ranked.map((r, i) => 
        `"${i + 1}","${r.student.studentId}","${r.student.fullName}","${r.student.department}","${r.student.section}","${r.avg}","${r.attRate}"`
      ).join('\n');

  } else if (reportType === 'student') {
    const s = students.find(stu => stu.studentId === selectedStudentId) || students[0];
    filenameBase = `SPAS_${s.studentId}_Individual_Report`;
    const sMarks = marks.filter(m => m.studentId === s.studentId);
    const avg = sMarks.length > 0
      ? Math.round((sMarks.reduce((acc, m) => acc + ((m.marksObtained / m.maxMarks) * 100), 0) / sMarks.length) * 10) / 10
      : 0;

    previewText = `========================================================================================
             STUDENT PERFORMANCE ANALYTICS SYSTEM (SPAS) - STUDENT PROFILE
========================================================================================
Generated At: ${timestamp}
Student ID  : ${s.studentId}
Student Name: ${s.fullName}
Department  : ${s.department} (Section ${s.section})
Term        : ${s.academicYear}
Overall Avg : ${avg}%
Status      : ${s.status}

----------------------------------------------------------------------------------------
DATE       | SUBJECT CODE | ASSESSMENT NAME    | SCORE        | PERCENTAGE | RESULT
----------------------------------------------------------------------------------------
${sMarks.map(m => {
  const sub = subjects.find(sub => sub.subjectId === m.subjectId);
  const pct = Math.round(((m.marksObtained / m.maxMarks) * 100) * 10) / 10;
  return `${m.assessmentDate} | ${(sub?.subjectCode || m.subjectId).padEnd(12)} | ${m.assessmentName.padEnd(18)} | ${String(m.marksObtained + '/' + m.maxMarks).padEnd(12)} | ${String(pct + '%').padEnd(10)} | ${pct >= settings.passingPercentage ? 'PASS' : 'FAIL'}`;
}).join('\n')}
========================================================================================`;

    csvContent = `Student ID,Full Name,Assessment Date,Subject Code,Assessment Name,Marks Obtained,Max Marks,Percentage,Result\n` +
      sMarks.map(m => {
        const sub = subjects.find(sub => sub.subjectId === m.subjectId);
        const pct = Math.round(((m.marksObtained / m.maxMarks) * 100) * 10) / 10;
        return `"${s.studentId}","${s.fullName}","${m.assessmentDate}","${sub?.subjectCode || ''}","${m.assessmentName}","${m.marksObtained}","${m.maxMarks}","${pct}","${pct >= settings.passingPercentage ? 'PASS' : 'FAIL'}"`;
      }).join('\n');

  } else if (reportType === 'subject') {
    const sub = subjects.find(sb => sb.subjectId === selectedSubjectId) || subjects[0];
    filenameBase = `SPAS_${sub.subjectCode}_Performance_Report`;
    const subMarks = marks.filter(m => m.subjectId === sub.subjectId);
    const subAvg = subMarks.length > 0
      ? Math.round((subMarks.reduce((acc, m) => acc + ((m.marksObtained / m.maxMarks) * 100), 0) / subMarks.length) * 10) / 10
      : 0;

    previewText = `========================================================================================
             STUDENT PERFORMANCE ANALYTICS SYSTEM (SPAS) - SUBJECT REPORT
========================================================================================
Course Code : ${sub.subjectCode} - ${sub.subjectName}
Credits     : ${sub.credits} | Max Marks: ${sub.maxMarks} | Pass Marks: ${sub.passingMarks}
Subject Avg : ${subAvg}% Across ${subMarks.length} Total Assessments
Generated At: ${timestamp}

----------------------------------------------------------------------------------------
STUDENT ID | STUDENT NAME          | ASSESSMENT         | SCORE        | PERCENTAGE
----------------------------------------------------------------------------------------
${subMarks.map(m => {
  const stu = students.find(s => s.studentId === m.studentId);
  const pct = Math.round(((m.marksObtained / m.maxMarks) * 100) * 10) / 10;
  return `${m.studentId.padEnd(10)} | ${(stu?.fullName || '').padEnd(21)} | ${m.assessmentName.padEnd(18)} | ${String(m.marksObtained + '/' + m.maxMarks).padEnd(12)} | ${pct}%`;
}).join('\n')}
========================================================================================`;

    csvContent = `Subject Code,Subject Name,Student ID,Student Name,Assessment Name,Marks,Max Marks,Percentage\n` +
      subMarks.map(m => {
        const stu = students.find(s => s.studentId === m.studentId);
        const pct = Math.round(((m.marksObtained / m.maxMarks) * 100) * 10) / 10;
        return `"${sub.subjectCode}","${sub.subjectName}","${m.studentId}","${stu?.fullName || ''}","${m.assessmentName}","${m.marksObtained}","${m.maxMarks}","${pct}"`;
      }).join('\n');

  } else if (reportType === 'attendance') {
    filenameBase = 'SPAS_Attendance_Ledger_Report';
    const rows = activeStudents.map(s => {
      const records = attendance.filter(a => a.studentId === s.studentId);
      const p = records.filter(a => a.status === 'Present').length;
      const ab = records.filter(a => a.status === 'Absent').length;
      const ex = records.filter(a => a.status === 'Excused').length;
      const c = p + ab;
      const rate = c > 0 ? Math.round((p / c) * 1000) / 10 : 100;
      return { s, p, ab, ex, rate };
    });

    previewText = `========================================================================================
             STUDENT PERFORMANCE ANALYTICS SYSTEM (SPAS) - ATTENDANCE LEDGER
========================================================================================
Generated At: ${timestamp}
Warning Threshold: ${settings.attendanceWarningThreshold}% (Excused Absences Excluded)

----------------------------------------------------------------------------------------
STUDENT ID | FULL NAME              | SEC | PRESENT | ABSENT | EXCUSED | ATTENDANCE %
----------------------------------------------------------------------------------------
${rows.map(r => 
  `${r.s.studentId.padEnd(10)} | ${r.s.fullName.padEnd(22)} | ${r.s.section.padEnd(3)} | ${String(r.p).padStart(7)} | ${String(r.ab).padStart(6)} | ${String(r.ex).padStart(7)} | ${String(r.rate + '%').padStart(12)}`
).join('\n')}
========================================================================================`;

    csvContent = `Student ID,Full Name,Section,Present,Absent,Excused,Attendance Rate %\n` +
      rows.map(r => `"${r.s.studentId}","${r.s.fullName}","${r.s.section}","${r.p}","${r.ab}","${r.ex}","${r.rate}"`).join('\n');

  } else if (reportType === 'support') {
    filenameBase = 'SPAS_Academic_Support_Intervention_Report';
    const supportCases: string[] = [];
    const csvRows: string[] = [];

    activeStudents.forEach(s => {
      const sMarks = marks.filter(m => m.studentId === s.studentId);
      const avg = sMarks.length > 0
        ? Math.round((sMarks.reduce((acc, m) => acc + ((m.marksObtained / m.maxMarks) * 100), 0) / sMarks.length) * 10) / 10
        : 0;

      const sAtt = attendance.filter(a => a.studentId === s.studentId);
      const p = sAtt.filter(a => a.status === 'Present').length;
      const c = sAtt.filter(a => a.status === 'Present' || a.status === 'Absent').length;
      const attRate = c > 0 ? Math.round((p / c) * 1000) / 10 : 100;

      if (avg > 0 && avg < settings.academicSupportScoreThreshold) {
        supportCases.push(`${s.studentId.padEnd(10)} | ${s.fullName.padEnd(20)} | Score < ${settings.academicSupportScoreThreshold}% | Avg: ${avg}% | Critical`);
        csvRows.push(`"${s.studentId}","${s.fullName}","Low Overall Score","${avg}%","Critical"`);
      }
      if (attRate < settings.attendanceWarningThreshold) {
        supportCases.push(`${s.studentId.padEnd(10)} | ${s.fullName.padEnd(20)} | Att < ${settings.attendanceWarningThreshold}%   | Att: ${attRate}% | Warning`);
        csvRows.push(`"${s.studentId}","${s.fullName}","Low Attendance","${attRate}%","Warning"`);
      }
    });

    previewText = `========================================================================================
             STUDENT PERFORMANCE ANALYTICS SYSTEM (SPAS) - SUPPORT AUDIT
========================================================================================
Generated At: ${timestamp}
Support Cutoff: ${settings.academicSupportScoreThreshold}% Score | ${settings.attendanceWarningThreshold}% Attendance

----------------------------------------------------------------------------------------
STUDENT ID | FULL NAME            | REASON FOR ALERT         | METRIC       | SEVERITY
----------------------------------------------------------------------------------------
${supportCases.join('\n')}
========================================================================================`;

    csvContent = `Student ID,Full Name,Reason,Metric,Severity\n` + csvRows.join('\n');
  } else {
    // Assessments report
    filenameBase = 'SPAS_Assessment_Master_Results';
    previewText = `========================================================================================
             STUDENT PERFORMANCE ANALYTICS SYSTEM (SPAS) - MASTER RESULTS
========================================================================================
Total Exam Records: ${marks.length}
Generated At      : ${timestamp}
----------------------------------------------------------------------------------------
EXAM ID   | STUDENT ID | SUBJECT  | EXAM NAME          | SCORE   | PCT   | PASS/FAIL
----------------------------------------------------------------------------------------
${marks.slice(0, 40).map(m => {
  const pct = Math.round(((m.marksObtained / m.maxMarks) * 100) * 10) / 10;
  return `${m.assessmentId.padEnd(9)} | ${m.studentId.padEnd(10)} | ${m.subjectId.padEnd(8)} | ${m.assessmentName.padEnd(18)} | ${String(m.marksObtained + '/' + m.maxMarks).padEnd(7)} | ${String(pct + '%').padEnd(5)} | ${pct >= settings.passingPercentage ? 'PASS' : 'FAIL'}`;
}).join('\n')}
========================================================================================`;

    csvContent = `Assessment ID,Student ID,Subject ID,Assessment Name,Type,Date,Score,Max Marks,Percentage,Result\n` +
      marks.map(m => {
        const pct = Math.round(((m.marksObtained / m.maxMarks) * 100) * 10) / 10;
        return `"${m.assessmentId}","${m.studentId}","${m.subjectId}","${m.assessmentName}","${m.assessmentType}","${m.assessmentDate}","${m.marksObtained}","${m.maxMarks}","${pct}","${pct >= settings.passingPercentage ? 'PASS' : 'FAIL'}"`;
      }).join('\n');
  }

  const downloadFile = (content: string, type: 'csv' | 'txt') => {
    const mime = type === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filenameBase}.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(previewText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Institutional Report Center & Exporter</h2>
          <p className="text-xs text-slate-500">
            Generate audit-ready reports, export RFC-4180 standard CSV sheets, or download formatted plain text summaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300 transition cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
          </button>
          <button
            onClick={() => downloadFile(previewText, 'txt')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .TXT</span>
          </button>
          <button
            onClick={() => downloadFile(csvContent, 'csv')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector & Scope */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-800">Select Report Type:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'class', label: 'Class Performance Summary' },
              { id: 'student', label: 'Individual Student Report' },
              { id: 'subject', label: 'Subject Performance Report' },
              { id: 'attendance', label: 'Attendance Ledger Report' },
              { id: 'assessments', label: 'Assessment Master Results' },
              { id: 'support', label: 'Academic Support & Alert Audit' },
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setReportType(r.id as any)}
                className={`px-3 py-1.5 rounded font-semibold transition cursor-pointer ${
                  reportType === r.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-selectors */}
        {reportType === 'student' && (
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-700">Choose Student:</span>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-white font-medium"
            >
              {students.map(s => (
                <option key={s.studentId} value={s.studentId}>{s.fullName} ({s.studentId})</option>
              ))}
            </select>
          </div>
        )}

        {reportType === 'subject' && (
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-700">Choose Subject:</span>
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-white font-medium"
            >
              {subjects.map(s => (
                <option key={s.subjectId} value={s.subjectId}>{s.subjectCode} - {s.subjectName}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Monospaced Report Preview Display */}
      <div className="bg-[#0f172a] text-slate-200 rounded-lg p-5 border border-slate-800 shadow-inner overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
          <span>SPAS REPORT GENERATOR OUTPUT STREAM • UTF-8</span>
          <span>{filenameBase}.txt</span>
        </div>
        <pre className="text-xs font-mono whitespace-pre overflow-x-auto leading-relaxed text-slate-200 select-all max-h-[500px]">
          {previewText}
        </pre>
      </div>
    </div>
  );
};
