import React, { useState } from 'react';
import { Student, Subject, MarkRecord, AttendanceRecord, AppSettings } from '../types';
import { 
  BarChart3, TrendingUp, TrendingDown, Award, Users, 
  Filter, ArrowUpDown, ChevronRight, CheckCircle2 
} from 'lucide-react';

interface Props {
  students: Student[];
  subjects: Subject[];
  marks: MarkRecord[];
  attendance: AttendanceRecord[];
  settings: AppSettings;
  onOpenProfile: (student: Student) => void;
}

export const AnalyticsModule: React.FC<Props> = ({
  students,
  subjects,
  marks,
  attendance,
  settings,
  onOpenProfile,
}) => {
  const [sectionFilter, setSectionFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Filter students
  const activeStudents = students.filter(s => {
    if (s.status !== 'Active') return false;
    if (sectionFilter !== 'All' && s.section !== sectionFilter) return false;
    return true;
  });

  // Calculate normalized overall student averages
  const studentMetrics = activeStudents.map(s => {
    const studentMarks = marks.filter(m => {
      if (m.studentId !== s.studentId) return false;
      if (subjectFilter !== 'All' && m.subjectId !== subjectFilter) return false;
      return true;
    });

    const studentAtt = attendance.filter(a => a.studentId === s.studentId);
    const pCount = studentAtt.filter(a => a.status === 'Present').length;
    const countable = studentAtt.filter(a => a.status === 'Present' || a.status === 'Absent').length;
    const attRate = countable > 0 ? Math.round((pCount / countable) * 1000) / 10 : 100;

    let overallAvg = 0;
    if (studentMarks.length > 0) {
      const sum = studentMarks.reduce((acc, m) => acc + ((m.marksObtained / m.maxMarks) * 100), 0);
      overallAvg = Math.round((sum / studentMarks.length) * 10) / 10;
    }

    // Trajectory calculation (first exam score vs last exam score)
    const sortedChronological = [...studentMarks].sort(
      (a, b) => new Date(a.assessmentDate).getTime() - new Date(b.assessmentDate).getTime()
    );

    let firstScore = 0;
    let latestScore = 0;
    let trajectoryDelta = 0;
    let trajectoryType: 'Improving' | 'Declining' | 'Stable' = 'Stable';

    if (sortedChronological.length >= 2) {
      const first = sortedChronological[0];
      const latest = sortedChronological[sortedChronological.length - 1];
      firstScore = Math.round(((first.marksObtained / first.maxMarks) * 100) * 10) / 10;
      latestScore = Math.round(((latest.marksObtained / latest.maxMarks) * 100) * 10) / 10;
      trajectoryDelta = Math.round((latestScore - firstScore) * 10) / 10;

      if (trajectoryDelta >= 8) trajectoryType = 'Improving';
      else if (trajectoryDelta <= -8) trajectoryType = 'Declining';
    }

    return {
      student: s,
      overallAvg,
      attRate,
      examCount: studentMarks.length,
      firstScore,
      latestScore,
      trajectoryDelta,
      trajectoryType
    };
  });

  // Fair rankings with tie-handling (Rank 1, 1, 3...)
  const sortedForRanking = [...studentMetrics].sort((a, b) => b.overallAvg - a.overallAvg);
  const rankedList: (typeof studentMetrics[0] & { rank: number })[] = [];

  let currentRank = 1;
  sortedForRanking.forEach((item, index) => {
    if (index > 0) {
      const prev = sortedForRanking[index - 1];
      if (Math.abs(prev.overallAvg - item.overallAvg) > 0.05) {
        currentRank = index + 1;
      }
    }
    rankedList.push({ ...item, rank: currentRank });
  });

  // Subject averages
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

  const highestSubject = [...subjectAverages].sort((a, b) => b.avg - a.avg)[0];
  const lowestSubject = [...subjectAverages].sort((a, b) => a.avg - b.avg)[0];

  const improvingStudents = studentMetrics.filter(sm => sm.trajectoryType === 'Improving');
  const decliningStudents = studentMetrics.filter(sm => sm.trajectoryType === 'Declining');

  return (
    <div className="space-y-6">
      {/* Header & Cohort Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Institutional Performance Analytics</h2>
          <p className="text-xs text-slate-500">
            Fair tie-handled rankings, subject benchmarks, trajectory velocities, and longitudinal tracking
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Cohort:</span>
            <select
              value={sectionFilter}
              onChange={e => setSectionFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 font-medium"
            >
              <option value="All">Both Sections (A & B)</option>
              <option value="A">Section A Only</option>
              <option value="B">Section B Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Subject Scope:</span>
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 font-medium"
            >
              <option value="All">All Curriculum Subjects</option>
              {subjects.map(s => (
                <option key={s.subjectId} value={s.subjectId}>{s.subjectCode} - {s.subjectName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Highlights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 border-l-4 border-l-emerald-600 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">🏆 Top Subject Benchmark</div>
          <div className="text-lg font-bold text-slate-900 mt-1 truncate">
            {highestSubject ? highestSubject.subjectName : 'N/A'}
          </div>
          <div className="text-xs text-emerald-700 font-mono font-bold mt-0.5">
            {highestSubject?.avg}% Average ({highestSubject?.subjectCode})
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 border-l-4 border-l-rose-600 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">⚠️ Lowest Subject Average</div>
          <div className="text-lg font-bold text-slate-900 mt-1 truncate">
            {lowestSubject ? lowestSubject.subjectName : 'N/A'}
          </div>
          <div className="text-xs text-rose-700 font-mono font-bold mt-0.5">
            {lowestSubject?.avg}% Average ({lowestSubject?.subjectCode})
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 border-l-4 border-l-blue-600 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">📈 Improving Velocity</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            {improvingStudents.length} Students
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            &ge; +8.0% growth between exams
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 border-l-4 border-l-amber-500 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">📉 Declining Velocity</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {decliningStudents.length} Students
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            &le; -8.0% drop between exams
          </div>
        </div>
      </div>

      {/* Trajectory Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Improving */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Students with Significant Academic Growth (+8%+)</span>
            </h3>
            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Positive Trajectory
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {improvingStudents.length === 0 ? (
              <div className="py-6 text-center text-slate-400 italic text-xs">No students currently in this category.</div>
            ) : (
              improvingStudents.map(sm => (
                <div key={sm.student.studentId} className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                      +{Math.round(sm.trajectoryDelta)}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{sm.student.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{sm.student.studentId} • Sec {sm.student.section}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-700 font-mono">
                      {sm.firstScore}% &rarr; {sm.latestScore}% ({sm.trajectoryDelta > 0 ? `+${sm.trajectoryDelta}%` : `${sm.trajectoryDelta}%`})
                    </div>
                    <button
                      onClick={() => onOpenProfile(sm.student)}
                      className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                    >
                      View Profile &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Declining */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <span>Students with Score Drops Needing Review (-8%+)</span>
            </h3>
            <span className="text-xs font-mono font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              Pedagogical Review
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {decliningStudents.length === 0 ? (
              <div className="py-6 text-center text-slate-400 italic text-xs">No students currently in this category.</div>
            ) : (
              decliningStudents.map(sm => (
                <div key={sm.student.studentId} className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-[10px]">
                      {Math.round(sm.trajectoryDelta)}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{sm.student.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{sm.student.studentId} • Sec {sm.student.section}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-rose-700 font-mono">
                      {sm.firstScore}% &rarr; {sm.latestScore}% ({sm.trajectoryDelta}%)
                    </div>
                    <button
                      onClick={() => onOpenProfile(sm.student)}
                      className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                    >
                      View Profile &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Official Student Rankings Table with Fair Tie Handling */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Official Institutional Student Rankings
            </h3>
            <p className="text-[11px] text-slate-500">
              Rankings computed using normalized percentage mean across comparable assessments. Fair tie handling applied.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Showing {rankedList.length} Students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1e293b] text-slate-200 border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-3 font-semibold text-center w-16">Rank</th>
                <th className="py-2.5 px-3 font-semibold">Student ID</th>
                <th className="py-2.5 px-3 font-semibold">Student Name</th>
                <th className="py-2.5 px-3 font-semibold">Department & Sec</th>
                <th className="py-2.5 px-3 font-semibold">Overall Mean %</th>
                <th className="py-2.5 px-3 font-semibold">Attendance %</th>
                <th className="py-2.5 px-3 font-semibold">Trajectory</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedList.map(item => {
                const isTop3 = item.rank <= 3;
                const isUnderSupport = item.overallAvg < settings.academicSupportScoreThreshold;

                return (
                  <tr key={item.student.studentId} className="hover:bg-blue-50/40 transition">
                    <td className="py-2.5 px-3 text-center font-mono font-bold">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        item.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300 font-extrabold' :
                        item.rank === 2 ? 'bg-slate-200 text-slate-800 border border-slate-300' :
                        item.rank === 3 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'text-slate-600'
                      }`}>
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                      {item.student.studentId}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {item.student.fullName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {item.student.department} (Sec {item.student.section})
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold">
                      <span className={isUnderSupport ? 'text-rose-600' : isTop3 ? 'text-emerald-700' : 'text-slate-800'}>
                        {item.overallAvg}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {item.attRate}%
                    </td>
                    <td className="py-2.5 px-3 font-semibold">
                      {item.trajectoryType === 'Improving' && (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" /> +{item.trajectoryDelta}%
                        </span>
                      )}
                      {item.trajectoryType === 'Declining' && (
                        <span className="text-rose-700 flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5" /> {item.trajectoryDelta}%
                        </span>
                      )}
                      {item.trajectoryType === 'Stable' && (
                        <span className="text-slate-400">Stable</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onOpenProfile(item.student)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 rounded transition cursor-pointer"
                      >
                        Profile &rarr;
                      </button>
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
