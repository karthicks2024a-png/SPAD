import React, { useState } from 'react';
import { Student, MarkRecord, AttendanceRecord, AppSettings, AcademicAlert } from '../types';
import { 
  AlertTriangle, ShieldCheck, CheckCircle2, Clock, 
  ChevronRight, Filter, Sparkles, BookOpen 
} from 'lucide-react';

interface Props {
  students: Student[];
  marks: MarkRecord[];
  attendance: AttendanceRecord[];
  settings: AppSettings;
  onOpenProfile: (student: Student) => void;
}

export const AlertsModule: React.FC<Props> = ({
  students,
  marks,
  attendance,
  settings,
  onOpenProfile,
}) => {
  const [severityFilter, setSeverityFilter] = useState('All');
  const [showReviewed, setShowReviewed] = useState(false);
  const [reviewedAlertIds, setReviewedAlertIds] = useState<Record<string, boolean>>({});

  // Compute alerts dynamically from actual data and settings
  const generatedAlerts: AcademicAlert[] = [];
  let alertCounter = 1;

  students.filter(s => s.status === 'Active').forEach(s => {
    const studentMarks = marks.filter(m => m.studentId === s.studentId);
    let avg = 0;
    if (studentMarks.length > 0) {
      const sum = studentMarks.reduce((acc, m) => acc + ((m.marksObtained / m.maxMarks) * 100), 0);
      avg = Math.round((sum / studentMarks.length) * 10) / 10;
    }

    const studentAtt = attendance.filter(a => a.studentId === s.studentId);
    const pCount = studentAtt.filter(a => a.status === 'Present').length;
    const countable = studentAtt.filter(a => a.status === 'Present' || a.status === 'Absent').length;
    const attRate = countable > 0 ? Math.round((pCount / countable) * 1000) / 10 : 100;

    // Rule 1: Score < academicSupportScoreThreshold -> Critical
    if (avg > 0 && avg < settings.academicSupportScoreThreshold) {
      const id = `ALT-${alertCounter++}`;
      generatedAlerts.push({
        alertId: id,
        studentId: s.studentId,
        studentName: s.fullName,
        reason: `Overall academic average is below the institutional supportive benchmark (${settings.academicSupportScoreThreshold}%)`,
        metricValue: avg,
        metricLabel: `Average: ${avg}%`,
        severity: 'Critical',
        suggestedAction: 'Arrange one-on-one conceptual diagnostic and recommend supplementary peer tutorials.',
        triggerDate: '2023-11-20',
        reviewed: !!reviewedAlertIds[id]
      });
    }

    // Rule 2: Attendance < attendanceWarningThreshold -> Warning
    if (attRate < settings.attendanceWarningThreshold) {
      const id = `ALT-${alertCounter++}`;
      generatedAlerts.push({
        alertId: id,
        studentId: s.studentId,
        studentName: s.fullName,
        reason: `Attendance rate has fallen below the institutional warning threshold (${settings.attendanceWarningThreshold}%)`,
        metricValue: attRate,
        metricLabel: `Attendance: ${attRate}%`,
        severity: 'Warning',
        suggestedAction: 'Schedule an academic advising conference to identify absence causes and catch up on missed laboratory sessions.',
        triggerDate: '2023-11-20',
        reviewed: !!reviewedAlertIds[id]
      });
    }

    // Rule 3: Multiple failed assessments
    const failCount = studentMarks.filter(m => ((m.marksObtained / m.maxMarks) * 100) < settings.passingPercentage).length;
    if (failCount >= 2 && avg >= settings.academicSupportScoreThreshold) {
      const id = `ALT-${alertCounter++}`;
      generatedAlerts.push({
        alertId: id,
        studentId: s.studentId,
        studentName: s.fullName,
        reason: `Failed ${failCount} individual assessment tasks despite passing overall benchmark`,
        metricValue: failCount,
        metricLabel: `${failCount} failing exams`,
        severity: 'Warning',
        suggestedAction: 'Target review for specific syllabus modules in which failure occurred; offer reassessment practice.',
        triggerDate: '2023-11-20',
        reviewed: !!reviewedAlertIds[id]
      });
    }
  });

  const toggleReview = (id: string) => {
    setReviewedAlertIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredAlerts = generatedAlerts.filter(a => {
    const isReviewed = !!reviewedAlertIds[a.alertId];
    if (!showReviewed && isReviewed) return false;
    if (severityFilter !== 'All' && a.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Academic Support & Intervention Alerts</h2>
          <p className="text-xs text-slate-500">
            Automated pedagogical indicators to facilitate timely supportive mentoring and student recovery
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded font-mono">
            Pending Actions: <strong className="text-rose-600">{generatedAlerts.filter(a => !reviewedAlertIds[a.alertId]).length}</strong>
          </span>
        </div>
      </div>

      {/* Pedagogical Principle Disclaimer Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-blue-900">Pedagogical Ethics & Supportive Framing</h4>
          <p className="text-blue-800 mt-0.5 leading-relaxed">
            These automated alerts are diagnostic triggers intended exclusively for supportive faculty review, syllabus re-clarification, and constructive advising. They do not represent fixed limits on student capability.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Severity:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 font-medium"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical Only</option>
              <option value="Warning">Warning Only</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={showReviewed}
              onChange={e => setShowReviewed(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Show Reviewed / Actioned Alerts</span>
          </label>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Showing <strong>{filteredAlerts.length}</strong> Alerts
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border border-slate-200 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No Pending Alerts Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              All active students currently meet academic thresholds or existing alerts have been marked as reviewed.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const student = students.find(s => s.studentId === alert.studentId);
            const isReviewed = !!reviewedAlertIds[alert.alertId];

            return (
              <div
                key={alert.alertId}
                className={`bg-white p-4 rounded-lg border shadow-xs transition ${
                  isReviewed 
                    ? 'border-slate-200 opacity-60 bg-slate-50/50' 
                    : alert.severity === 'Critical' 
                      ? 'border-rose-200 border-l-4 border-l-rose-600' 
                      : 'border-amber-200 border-l-4 border-l-amber-500'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {alert.severity === 'Critical' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                          Critical Alert
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                          Warning Alert
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{alert.studentName}</span>
                        <span className="text-xs font-mono text-blue-600 font-semibold">({alert.studentId})</span>
                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {alert.metricLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 font-medium">{alert.reason}</p>
                      
                      <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/80 flex items-start gap-2">
                        <span className="font-bold text-slate-800 shrink-0">💡 Suggested Follow-Up:</span>
                        <span>{alert.suggestedAction}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {student && (
                      <button
                        onClick={() => onOpenProfile(student)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded transition cursor-pointer"
                      >
                        Academic Profile &rarr;
                      </button>
                    )}
                    <button
                      onClick={() => toggleReview(alert.alertId)}
                      className={`px-3 py-1.5 text-xs font-bold rounded transition cursor-pointer flex items-center gap-1.5 ${
                        isReviewed
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isReviewed ? 'Unmark Reviewed' : 'Mark Reviewed'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
