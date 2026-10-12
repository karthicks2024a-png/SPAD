import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { 
  Search, Plus, Filter, Edit2, Trash2, User, ArrowUpDown, 
  ExternalLink, Mail, CheckCircle, AlertCircle, X, Download
} from 'lucide-react';

interface Props {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onOpenProfile: (student: Student) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const StudentModule: React.FC<Props> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onOpenProfile,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof Student>('studentId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Edit State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<Student | null>(null);

  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formDept, setFormDept] = useState('Computer Science');
  const [formSec, setFormSec] = useState('A');
  const [formYear, setFormYear] = useState('2023-2024');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setFormId(`STU-${students.length + 101}`);
    setFormName('');
    setFormDept('Computer Science');
    setFormSec('A');
    setFormYear('2023-2024');
    setFormEmail('');
    setFormStatus('Active');
    setFormError(null);
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormId(student.studentId);
    setFormName(student.fullName);
    setFormDept(student.department);
    setFormSec(student.section);
    setFormYear(student.academicYear);
    setFormEmail(student.email);
    setFormStatus(student.status);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim()) { setFormError('Student ID is required.'); return; }
    if (!formName.trim()) { setFormError('Full name is required.'); return; }
    if (formEmail && !/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formEmail.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!editingStudent) {
      if (students.some(s => s.studentId.toLowerCase() === formId.trim().toLowerCase())) {
        setFormError(`Student ID "${formId}" already exists. IDs must be unique.`);
        return;
      }

      onAddStudent({
        studentId: formId.trim(),
        fullName: formName.trim(),
        department: formDept.trim(),
        section: formSec.trim(),
        academicYear: formYear.trim(),
        email: formEmail.trim(),
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: formStatus
      });
    } else {
      onUpdateStudent({
        ...editingStudent,
        fullName: formName.trim(),
        department: formDept.trim(),
        section: formSec.trim(),
        academicYear: formYear.trim(),
        email: formEmail.trim(),
        status: formStatus
      });
    }

    setIsAddModalOpen(false);
  };

  // Filter & Sort
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchQuery = !searchQuery.trim() || 
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSec = sectionFilter === 'All' || s.section.toLowerCase() === sectionFilter.toLowerCase();
      const matchStatus = statusFilter === 'All' || s.status.toLowerCase() === statusFilter.toLowerCase();

      return matchQuery && matchSec && matchStatus;
    }).sort((a, b) => {
      const valA = (a[sortField] || '').toString();
      const valB = (b[sortField] || '').toString();
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [students, searchQuery, sectionFilter, statusFilter, sortField, sortOrder]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Directory & Information System</h2>
          <p className="text-xs text-slate-500">Manage student profiles, department rosters, sections, and enrollment status</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Student</span>
        </button>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student ID, full name, or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Section:</span>
          <select
            value={sectionFilter}
            onChange={e => setSectionFilter(e.target.value)}
            className="border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:outline-none"
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="text-slate-500 ml-auto font-mono text-[11px]">
          Showing <strong>{filteredStudents.length}</strong> of {students.length} students
        </div>
      </div>

      {/* 3. TableView Emulation */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1e293b] text-slate-200 border-b border-slate-700">
              <tr>
                <th onClick={() => handleSort('studentId')} className="py-2.5 px-3 font-semibold cursor-pointer hover:text-blue-400 transition">
                  <div className="flex items-center gap-1">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('fullName')} className="py-2.5 px-3 font-semibold cursor-pointer hover:text-blue-400 transition">
                  <div className="flex items-center gap-1">
                    <span>Full Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('department')} className="py-2.5 px-3 font-semibold cursor-pointer hover:text-blue-400 transition">
                  <div className="flex items-center gap-1">
                    <span>Department / Class</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('section')} className="py-2.5 px-3 font-semibold cursor-pointer hover:text-blue-400 transition">
                  <div className="flex items-center gap-1">
                    <span>Section</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-semibold">Academic Year</th>
                <th className="py-2.5 px-3 font-semibold">Email</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                    No student records match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(s => (
                  <tr key={s.studentId} className="hover:bg-blue-50/50 transition group">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                      {s.studentId}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {s.fullName.slice(0, 1)}
                        </span>
                        <span>{s.fullName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {s.department}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">
                      Section {s.section}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">
                      {s.academicYear}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono truncate max-w-[160px]">
                      {s.email || '—'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        s.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {s.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : null}
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenProfile(s)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition cursor-pointer"
                          title="View 360° Academic Profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Edit Student Information"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmStudent(s)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition cursor-pointer"
                          title="Delete Student Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0f172a] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>{editingStudent ? 'Edit Student Record' : 'Enroll New Student'}</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-5 space-y-3.5 text-xs">
              {formError && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student ID *</label>
                  <input
                    type="text"
                    value={formId}
                    onChange={e => setFormId(e.target.value)}
                    disabled={!!editingStudent}
                    placeholder="e.g. STU-115"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono disabled:bg-slate-100 text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Maya Krishnan"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department/Class *</label>
                  <input
                    type="text"
                    value={formDept}
                    onChange={e => setFormDept(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Section *</label>
                  <input
                    type="text"
                    value={formSec}
                    onChange={e => setFormSec(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={e => setFormYear(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
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
                  {editingStudent ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Dialog */}
      {deleteConfirmStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-red-200 w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-sm font-bold text-slate-900">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete student <strong>{deleteConfirmStudent.fullName}</strong> ({deleteConfirmStudent.studentId})? 
              All recorded assessment scores and attendance history for this student will also be removed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmStudent(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(deleteConfirmStudent.studentId);
                  setDeleteConfirmStudent(null);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
