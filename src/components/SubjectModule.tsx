import React, { useState } from 'react';
import { Subject, MarkRecord } from '../types';
import { BookOpen, Plus, Edit2, Trash2, Search, AlertCircle, X, CheckCircle } from 'lucide-react';

interface Props {
  subjects: Subject[];
  marks: MarkRecord[];
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export const SubjectModule: React.FC<Props> = ({
  subjects,
  marks,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Form
  const [formId, setFormId] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formDept, setFormDept] = useState('Computer Science');
  const [formMax, setFormMax] = useState('100');
  const [formPass, setFormPass] = useState('40');
  const [formCredits, setFormCredits] = useState('3');
  const [formError, setFormError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingSubject(null);
    setFormId(`SUB-${subjects.length + 101}`);
    setFormCode('CS');
    setFormName('');
    setFormDept('Computer Science');
    setFormMax('100');
    setFormPass('40');
    setFormCredits('3');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setFormId(sub.subjectId);
    setFormCode(sub.subjectCode);
    setFormName(sub.subjectName);
    setFormDept(sub.department);
    setFormMax(String(sub.maxMarks));
    setFormPass(String(sub.passingMarks));
    setFormCredits(String(sub.credits));
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const maxM = parseFloat(formMax);
    const passM = parseFloat(formPass);
    const cr = parseInt(formCredits, 10);

    if (!formId.trim() || !formCode.trim() || !formName.trim()) {
      setFormError('All fields marked * are required.');
      return;
    }
    if (isNaN(maxM) || maxM <= 0) {
      setFormError('Maximum marks must be greater than 0.');
      return;
    }
    if (isNaN(passM) || passM < 0 || passM > maxM) {
      setFormError('Passing marks must be between 0 and maximum marks.');
      return;
    }
    if (isNaN(cr) || cr < 1) {
      setFormError('Credits must be at least 1.');
      return;
    }

    if (!editingSubject) {
      if (subjects.some(s => s.subjectId.toLowerCase() === formId.trim().toLowerCase())) {
        setFormError(`Subject ID "${formId}" already exists.`);
        return;
      }
      if (subjects.some(s => s.subjectCode.toLowerCase() === formCode.trim().toLowerCase())) {
        setFormError(`Subject code "${formCode}" already exists.`);
        return;
      }
      onAddSubject({
        subjectId: formId.trim(),
        subjectCode: formCode.trim(),
        subjectName: formName.trim(),
        department: formDept.trim(),
        maxMarks: maxM,
        passingMarks: passM,
        credits: cr
      });
    } else {
      onUpdateSubject({
        ...editingSubject,
        subjectCode: formCode.trim(),
        subjectName: formName.trim(),
        department: formDept.trim(),
        maxMarks: maxM,
        passingMarks: passM,
        credits: cr
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (sub: Subject) => {
    // Referential integrity check!
    const hasAssociatedMarks = marks.some(m => m.subjectId === sub.subjectId);
    if (hasAssociatedMarks) {
      setDeleteError(`Cannot delete "${sub.subjectName}" (${sub.subjectCode}): There are existing assessment marks recorded for this subject.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete subject "${sub.subjectName}"?`)) {
      onDeleteSubject(sub.subjectId);
    }
  };

  const filtered = subjects.filter(s => 
    !searchQuery.trim() ||
    s.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Curriculum & Subject Configuration</h2>
          <p className="text-xs text-slate-500">Configure academic subjects, course credits, and grading cutoffs</p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Subject</span>
        </button>
      </div>

      {deleteError && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{deleteError}</span>
          </div>
          <button onClick={() => setDeleteError(null)} className="text-red-500 hover:text-red-700 cursor-pointer font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code or subject name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
          />
        </div>
        <div className="text-slate-500 ml-auto font-mono text-[11px]">
          Total Subjects: <strong>{subjects.length}</strong>
        </div>
      </div>

      {/* TableView */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1e293b] text-slate-200 border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Subject ID</th>
                <th className="py-2.5 px-3 font-semibold">Code</th>
                <th className="py-2.5 px-3 font-semibold">Subject Name</th>
                <th className="py-2.5 px-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold">Credits</th>
                <th className="py-2.5 px-3 font-semibold">Max Marks</th>
                <th className="py-2.5 px-3 font-semibold">Passing Marks</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => {
                const subMarksCount = marks.filter(m => m.subjectId === s.subjectId).length;
                return (
                  <tr key={s.subjectId} className="hover:bg-blue-50/50 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                      {s.subjectId}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {s.subjectCode}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {s.subjectName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {s.department}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 font-semibold">
                      {s.credits}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {s.maxMarks}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">
                      {s.passingMarks} ({Math.round((s.passingMarks / s.maxMarks) * 100)}%)
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Edit Configuration"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition cursor-pointer"
                          title={subMarksCount > 0 ? `${subMarksCount} Marks Tied to this Subject` : 'Delete Subject'}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0f172a] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>{editingSubject ? 'Edit Subject Configuration' : 'Add New Subject'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
              {formError && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subject ID *</label>
                  <input
                    type="text"
                    value={formId}
                    onChange={e => setFormId(e.target.value)}
                    disabled={!!editingSubject}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono disabled:bg-slate-100 text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Course Code *</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    placeholder="e.g. CS205"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-slate-800 uppercase"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Credits *</label>
                  <input
                    type="number"
                    value={formCredits}
                    onChange={e => setFormCredits(e.target.value)}
                    min="1"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
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
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pass Marks *</label>
                  <input
                    type="number"
                    value={formPass}
                    onChange={e => setFormPass(e.target.value)}
                    min="0"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
