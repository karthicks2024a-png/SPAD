import React, { useState } from 'react';
import { Student, Subject, MarkRecord, AppSettings } from '../types';
import { 
  FileSpreadsheet, Plus, Zap, Search, Filter, Trash2, Edit2, 
  CheckCircle, XCircle, X, AlertCircle 
} from 'lucide-react';

interface Props {
  students: Student[];
  subjects: Subject[];
  marks: MarkRecord[];
  settings: AppSettings;
  onAddMark: (mark: MarkRecord) => void;
  onUpdateMark: (mark: MarkRecord) => void;
  onDeleteMark: (assessmentId: string) => void;
  onBulkSave: (records: MarkRecord[]) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const MarksModule: React.FC<Props> = ({
  students,
  subjects,
  marks,
  settings,
  onAddMark,
  onUpdateMark,
  onDeleteMark,
  onBulkSave,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingMark, setEditingMark] = useState<MarkRecord | null>(null);

  // Single Form State
  const [formId, setFormId] = useState('');
  const [formStudentId, setFormStudentId] = useState('');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formName, setFormName] = useState('Midterm Exam');
  const [formType, setFormType] = useState<MarkRecord['assessmentType']>('Midterm');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formScore, setFormScore] = useState('75');
  const [formMax, setFormMax] = useState('100');
  const [formError, setFormError] = useState<string | null>(null);

  // Bulk State
  const [bulkSubjectId, setBulkSubjectId] = useState(subjects[0]?.subjectId || '');
  const [bulkExamName, setBulkExamName] = useState('Unit Test 2');
  const [bulkExamType, setBulkExamType] = useState<MarkRecord['assessmentType']>('Internal Test');
  const [bulkMaxMarks, setBulkMaxMarks] = useState('100');
  const [bulkScores, setBulkScores] = useState<Record<string, string>>({});

  const openAdd = () => {
    setEditingMark(null);
    setFormId(`MR-${marks.length + 101}`);
    setFormStudentId(students[0]?.studentId || '');
    setFormSubjectId(subjects[0]?.subjectId || '');
    setFormName('Midterm Exam');
    setFormType('Midterm');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormScore('75');
    setFormMax('100');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEdit = (m: MarkRecord) => {
    setEditingMark(m);
    setFormId(m.assessmentId);
    setFormStudentId(m.studentId);
    setFormSubjectId(m.subjectId);
    setFormName(m.assessmentName);
    setFormType(m.assessmentType);
    setFormDate(m.assessmentDate);
    setFormScore(String(m.marksObtained));
    setFormMax(String(m.maxMarks));
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleSaveMark = (e: React.FormEvent) => {
    e.preventDefault();
    const score = parseFloat(formScore);
    const maxM = parseFloat(formMax);

    if (isNaN(score) || isNaN(maxM) || maxM <= 0) {
      setFormError('Please enter valid numeric scores.');
      return;
    }
    if (score < 0 || score > maxM) {
      setFormError(`Marks obtained must be between 0 and maximum marks (${maxM}).`);
      return;
    }

    if (!editingMark) {
      // Duplicate prevention
      const exists = marks.some(m => 
        m.studentId === formStudentId && 
        m.subjectId === formSubjectId && 
        m.assessmentName.toLowerCase() === formName.trim().toLowerCase()
      );
      if (exists) {
        setFormError('A grade record already exists for this student, subject, and assessment name.');
        return;
      }

      onAddMark({
        assessmentId: formId.trim(),
        studentId: formStudentId,
        subjectId: formSubjectId,
        assessmentName: formName.trim(),
        assessmentType: formType,
        assessmentDate: formDate,
        marksObtained: score,
        maxMarks: maxM
      });
    } else {
      onUpdateMark({
        ...editingMark,
        assessmentName: formName.trim(),
        assessmentType: formType,
        assessmentDate: formDate,
        marksObtained: score,
        maxMarks: maxM
      });
    }

    setIsAddModalOpen(false);
  };

  // Open Bulk Modal with default scores populated
  const openBulkModal = () => {
    const initialScores: Record<string, string> = {};
    students.forEach(s => {
      initialScores[s.studentId] = '75';
    });
    setBulkScores(initialScores);
    setIsBulkModalOpen(true);
  };

  const handleSaveBulk = () => {
    const maxM = parseFloat(bulkMaxMarks) || 100;
    const records: MarkRecord[] = [];
    const dateStr = new Date().toISOString().split('T')[0];

    students.forEach((s, idx) => {
      const score = parseFloat(bulkScores[s.studentId] || '70');
      records.push({
        assessmentId: `MR-B${Date.now()}-${idx + 1}`,
        studentId: s.studentId,
        subjectId: bulkSubjectId,
        assessmentName: bulkExamName.trim(),
        assessmentType: bulkExamType,
        assessmentDate: dateStr,
        marksObtained: Math.min(maxM, Math.max(0, score)),
        maxMarks: maxM
      });
    });

    onBulkSave(records);
    setIsBulkModalOpen(false);
  };

  const filtered = marks.filter(m => {
    const student = students.find(s => s.studentId === m.studentId);
    const matchQ = !searchQuery.trim() ||
      m.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student && student.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.assessmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchSub = subjectFilter === 'All' || m.subjectId === subjectFilter;
    const matchType = typeFilter === 'All' || m.assessmentType === typeFilter;

    return matchQ && matchSub && matchType;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Assessment & Marks Management</h2>
          <p className="text-xs text-slate-500">Record scores, continuous evaluations, bulk grade rosters, and automatic pass/fail tagging</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openBulkModal}
            className="flex items-center gap-2 px-3 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-md shadow-sm transition cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>⚡ Bulk Marks Entry</span>
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Mark</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name, ID, or exam..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Subject:</span>
          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:outline-none"
          >
            <option value="All">All Subjects</option>
            {subjects.map(s => (
              <option key={s.subjectId} value={s.subjectId}>{s.subjectCode} - {s.subjectName}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Exam Type:</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Internal Test">Internal Test</option>
            <option value="Midterm">Midterm</option>
            <option value="Assignment">Assignment</option>
            <option value="Final Examination">Final Examination</option>
          </select>
        </div>

        <div className="text-slate-500 ml-auto font-mono text-[11px]">
          Total Records: <strong>{filtered.length}</strong>
        </div>
      </div>

      {/* TableView */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1e293b] text-slate-200 border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Record ID</th>
                <th className="py-2.5 px-3 font-semibold">Student</th>
                <th className="py-2.5 px-3 font-semibold">Subject</th>
                <th className="py-2.5 px-3 font-semibold">Assessment</th>
                <th className="py-2.5 px-3 font-semibold">Type</th>
                <th className="py-2.5 px-3 font-semibold">Date</th>
                <th className="py-2.5 px-3 font-semibold">Score</th>
                <th className="py-2.5 px-3 font-semibold">Percentage</th>
                <th className="py-2.5 px-3 font-semibold">Result</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(m => {
                const student = students.find(s => s.studentId === m.studentId);
                const subject = subjects.find(s => s.subjectId === m.subjectId);
                const pct = Math.round(((m.marksObtained / m.maxMarks) * 100) * 10) / 10;
                const isPass = pct >= settings.passingPercentage;

                return (
                  <tr key={m.assessmentId} className="hover:bg-blue-50/50 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-500">
                      {m.assessmentId}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      <div>{student ? student.fullName : m.studentId}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{m.studentId}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-mono font-semibold">
                      {subject ? subject.subjectCode : m.subjectId}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">
                      {m.assessmentName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {m.assessmentType}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">
                      {m.assessmentDate}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {m.marksObtained} / {m.maxMarks}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold">
                      <span className={pct >= 75 ? 'text-blue-600' : pct >= 40 ? 'text-slate-800' : 'text-red-600'}>
                        {pct}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isPass ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {isPass ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(m)}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Edit Marks"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete mark record ${m.assessmentId}?`)) {
                              onDeleteMark(m.assessmentId);
                            }
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Single Mark Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0f172a] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                <span>{editingMark ? 'Edit Assessment Mark' : 'Record Assessment Mark'}</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMark} className="p-5 space-y-3.5 text-xs">
              {formError && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student *</label>
                  <select
                    value={formStudentId}
                    onChange={e => setFormStudentId(e.target.value)}
                    disabled={!!editingMark}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 bg-white disabled:bg-slate-100"
                    required
                  >
                    {students.map(s => (
                      <option key={s.studentId} value={s.studentId}>{s.fullName} ({s.studentId})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subject *</label>
                  <select
                    value={formSubjectId}
                    onChange={e => setFormSubjectId(e.target.value)}
                    disabled={!!editingMark}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 bg-white disabled:bg-slate-100"
                    required
                  >
                    {subjects.map(s => (
                      <option key={s.subjectId} value={s.subjectId}>{s.subjectCode} - {s.subjectName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assessment Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Midterm Exam"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assessment Type *</label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 bg-white"
                  >
                    <option value="Internal Test">Internal Test</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Practical">Practical</option>
                    <option value="Final Examination">Final Examination</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Score Obtained *</label>
                  <input
                    type="number"
                    value={formScore}
                    onChange={e => setFormScore(e.target.value)}
                    step="0.5"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Marks *</label>
                  <input
                    type="number"
                    value={formMax}
                    onChange={e => setFormMax(e.target.value)}
                    min="1"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer"
                >
                  Save Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Marks Entry Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="bg-[#0f172a] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Bulk Marks Entry - Class Grading Roster</span>
              </h3>
              <button onClick={() => setIsBulkModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Subject</label>
                <select
                  value={bulkSubjectId}
                  onChange={e => setBulkSubjectId(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-800"
                >
                  {subjects.map(s => (
                    <option key={s.subjectId} value={s.subjectId}>{s.subjectCode} - {s.subjectName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assessment Name</label>
                <input
                  type="text"
                  value={bulkExamName}
                  onChange={e => setBulkExamName(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type</label>
                <select
                  value={bulkExamType}
                  onChange={e => setBulkExamType(e.target.value as any)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-800"
                >
                  <option value="Internal Test">Internal Test</option>
                  <option value="Midterm">Midterm</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Final Examination">Final Examination</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Max Marks</label>
                <input
                  type="number"
                  value={bulkMaxMarks}
                  onChange={e => setBulkMaxMarks(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Student ID</th>
                    <th className="py-2 px-3 font-semibold">Student Name</th>
                    <th className="py-2 px-3 font-semibold">Section</th>
                    <th className="py-2 px-3 font-semibold text-right">Marks Obtained (/{bulkMaxMarks})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(s => (
                    <tr key={s.studentId} className="hover:bg-blue-50/40">
                      <td className="py-2 px-3 font-mono font-bold text-blue-600">{s.studentId}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{s.fullName}</td>
                      <td className="py-2 px-3 text-slate-500">Sec {s.section}</td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={bulkMaxMarks}
                          value={bulkScores[s.studentId] || '0'}
                          onChange={e => setBulkScores({ ...bulkScores, [s.studentId]: e.target.value })}
                          className="w-24 px-2 py-1 border border-slate-300 rounded text-right font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">
                Grading {students.length} students at once
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBulk}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer"
                >
                  Save All Marks ({students.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
