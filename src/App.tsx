/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Student, Subject, MarkRecord, AttendanceRecord, AppSettings, ModuleType 
} from './types';
import { 
  initialStudents, initialSubjects, generateInitialMarks, 
  generateInitialAttendance, defaultSettings 
} from './data/initialData';
import { DesktopWindowFrame } from './components/DesktopWindowFrame';
import { DashboardModule } from './components/DashboardModule';
import { StudentModule } from './components/StudentModule';
import { SubjectModule } from './components/SubjectModule';
import { MarksModule } from './components/MarksModule';
import { AttendanceModule } from './components/AttendanceModule';
import { StudentProfileModule } from './components/StudentProfileModule';
import { AnalyticsModule } from './components/AnalyticsModule';
import { AlertsModule } from './components/AlertsModule';
import { ReportsModule } from './components/ReportsModule';
import { SettingsModule } from './components/SettingsModule';
import { JavaProjectExplorerModal } from './components/JavaProjectExplorerModal';

import { 
  LayoutDashboard, Users, BookOpen, FileSpreadsheet, Calendar, 
  UserCheck, BarChart3, AlertTriangle, FileText, Settings, 
  Code, Sparkles, ExternalLink, RefreshCw, Layers
} from 'lucide-react';

export default function App() {
  // Application Data State
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [marks, setMarks] = useState<MarkRecord[]>(generateInitialMarks);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(generateInitialAttendance);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // UI State
  const [activeModule, setActiveModule] = useState<ModuleType>('Dashboard');
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student>(initialStudents[0]);
  const [isJavaModalOpen, setIsJavaModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddMarkModalOpen, setIsAddMarkModalOpen] = useState(false);

  // Student CRUD
  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
  };
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.studentId === updatedStudent.studentId ? updatedStudent : s));
  };
  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.studentId !== studentId));
    setMarks(prev => prev.filter(m => m.studentId !== studentId));
    setAttendance(prev => prev.filter(a => a.studentId !== studentId));
  };

  // Subject CRUD
  const handleAddSubject = (newSubject: Subject) => {
    setSubjects(prev => [...prev, newSubject]);
  };
  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubjects(prev => prev.map(s => s.subjectId === updatedSubject.subjectId ? updatedSubject : s));
  };
  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.subjectId !== subjectId));
  };

  // Marks CRUD
  const handleAddMark = (newMark: MarkRecord) => {
    setMarks(prev => [newMark, ...prev]);
  };
  const handleUpdateMark = (updatedMark: MarkRecord) => {
    setMarks(prev => prev.map(m => m.assessmentId === updatedMark.assessmentId ? updatedMark : m));
  };
  const handleDeleteMark = (assessmentId: string) => {
    setMarks(prev => prev.filter(m => m.assessmentId !== assessmentId));
  };
  const handleBulkMarks = (records: MarkRecord[]) => {
    setMarks(prev => [...records, ...prev]);
  };

  // Attendance
  const handleSaveDailyAttendance = (records: AttendanceRecord[]) => {
    setAttendance(prev => {
      // replace existing for that date and student, append rest
      const date = records[0]?.attendanceDate;
      const filtered = prev.filter(a => !(a.attendanceDate === date && records.some(r => r.studentId === a.studentId)));
      return [...filtered, ...records];
    });
  };

  // Reset sample data
  const handleResetSampleData = () => {
    setStudents(initialStudents);
    setSubjects(initialSubjects);
    setMarks(generateInitialMarks());
    setAttendance(generateInitialAttendance());
    setSettings(defaultSettings);
    setSelectedStudentForProfile(initialStudents[0]);
  };

  // Calculate live alert count
  const activeAlertCount = students.filter(s => {
    if (s.status !== 'Active') return false;
    const sMarks = marks.filter(m => m.studentId === s.studentId);
    let avg = 0;
    if (sMarks.length > 0) {
      const sum = sMarks.reduce((acc, m) => acc + ((m.marksObtained / m.maxMarks) * 100), 0);
      avg = sum / sMarks.length;
    }
    const sAtt = attendance.filter(a => a.studentId === s.studentId);
    const p = sAtt.filter(a => a.status === 'Present').length;
    const c = sAtt.filter(a => a.status === 'Present' || a.status === 'Absent').length;
    const attRate = c > 0 ? (p / c) * 100 : 100;
    return (avg > 0 && avg < settings.academicSupportScoreThreshold) || attRate < settings.attendanceWarningThreshold;
  }).length;

  const navItems = [
    { id: 'Dashboard' as ModuleType, label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'Students' as ModuleType, label: 'Student Management', icon: Users, badge: students.length },
    { id: 'Subjects' as ModuleType, label: 'Subject Configuration', icon: BookOpen },
    { id: 'Marks' as ModuleType, label: 'Assessments & Marks', icon: FileSpreadsheet },
    { id: 'Attendance' as ModuleType, label: 'Attendance Tracker', icon: Calendar },
    { id: 'Profile' as ModuleType, label: 'Academic Profile', icon: UserCheck },
    { id: 'Analytics' as ModuleType, label: 'Performance Analytics', icon: BarChart3 },
    { id: 'Alerts' as ModuleType, label: 'Support Alerts', icon: AlertTriangle, badge: activeAlertCount, badgeColor: 'bg-rose-500' },
    { id: 'Reports' as ModuleType, label: 'Report Center & Export', icon: FileText },
    { id: 'Settings' as ModuleType, label: 'Settings & Data Store', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col font-sans select-none antialiased">
      {/* 1. Desktop Window Frame Chrome */}
      <DesktopWindowFrame
        activeModule={activeModule}
        onNavigate={setActiveModule}
        onOpenSourceModal={() => setIsJavaModalOpen(true)}
        onResetSampleData={handleResetSampleData}
        totalStudents={students.length}
        totalAlerts={activeAlertCount}
      />

      {/* 2. Main Window Application Shell (Sidebar + Center Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigational Sidebar (Navy Blue JavaFX theme) */}
        <aside className="w-64 bg-[#1e293b] text-slate-300 flex flex-col border-r border-slate-700/80 shrink-0">
          {/* Sidebar Header Brand */}
          <div className="p-4 border-b border-slate-700/60 bg-[#162032]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                📊
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-wide">SPAS DESKTOP</div>
                <div className="text-[10px] text-slate-400 font-mono">JavaFX 21 Analytics Shell</div>
              </div>
            </div>
          </div>

          {/* Module Nav Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
              Academic Modules
            </div>

            {navItems.slice(0, 8).map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white font-mono ${
                      item.badgeColor || 'bg-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 pb-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 border-t border-slate-700/60">
                System & Tools
              </div>
            </div>

            {navItems.slice(8).map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}

            {/* Source Code Explorer Button */}
            <div className="pt-3">
              <button
                onClick={() => setIsJavaModalOpen(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-semibold text-xs text-blue-300 bg-blue-900/30 border border-blue-700/50 hover:bg-blue-900/50 transition cursor-pointer"
              >
                <Code className="w-4 h-4 text-blue-400" />
                <span>Java Source & Maven (.zip)</span>
              </button>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 bg-[#111827] border-t border-slate-700/60 text-[11px] text-slate-400 space-y-1 font-mono">
            <div className="flex items-center justify-between">
              <span>Memory Engine:</span>
              <span className="text-emerald-400 font-bold">Synchronized</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span>Active Students:</span>
              <span className="text-slate-200">{students.length}</span>
            </div>
          </div>
        </aside>

        {/* Central Content Area */}
        <main className="flex-1 bg-[#f8fafc] overflow-y-auto p-6 flex flex-col">
          <div className="flex-1 max-w-7xl w-full mx-auto">
            {activeModule === 'Dashboard' && (
              <DashboardModule
                students={students}
                subjects={subjects}
                marks={marks}
                attendance={attendance}
                settings={settings}
                onNavigate={setActiveModule}
                onOpenProfile={s => {
                  setSelectedStudentForProfile(s);
                  setActiveModule('Profile');
                }}
                onAddStudent={() => {
                  setIsAddStudentModalOpen(true);
                  setActiveModule('Students');
                }}
                onRecordMarks={() => {
                  setIsAddMarkModalOpen(true);
                  setActiveModule('Marks');
                }}
              />
            )}

            {activeModule === 'Students' && (
              <StudentModule
                students={students}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onOpenProfile={s => {
                  setSelectedStudentForProfile(s);
                  setActiveModule('Profile');
                }}
                isAddModalOpen={isAddStudentModalOpen}
                setIsAddModalOpen={setIsAddStudentModalOpen}
              />
            )}

            {activeModule === 'Subjects' && (
              <SubjectModule
                subjects={subjects}
                marks={marks}
                onAddSubject={handleAddSubject}
                onUpdateSubject={handleUpdateSubject}
                onDeleteSubject={handleDeleteSubject}
              />
            )}

            {activeModule === 'Marks' && (
              <MarksModule
                students={students}
                subjects={subjects}
                marks={marks}
                settings={settings}
                onAddMark={handleAddMark}
                onUpdateMark={handleUpdateMark}
                onDeleteMark={handleDeleteMark}
                onBulkSave={handleBulkMarks}
                isAddModalOpen={isAddMarkModalOpen}
                setIsAddModalOpen={setIsAddMarkModalOpen}
              />
            )}

            {activeModule === 'Attendance' && (
              <AttendanceModule
                students={students}
                attendance={attendance}
                settings={settings}
                onSaveDailyAttendance={handleSaveDailyAttendance}
              />
            )}

            {activeModule === 'Profile' && (
              <StudentProfileModule
                student={selectedStudentForProfile}
                allStudents={students}
                subjects={subjects}
                marks={marks}
                attendance={attendance}
                settings={settings}
                onSelectStudent={setSelectedStudentForProfile}
              />
            )}

            {activeModule === 'Analytics' && (
              <AnalyticsModule
                students={students}
                subjects={subjects}
                marks={marks}
                attendance={attendance}
                settings={settings}
                onOpenProfile={s => {
                  setSelectedStudentForProfile(s);
                  setActiveModule('Profile');
                }}
              />
            )}

            {activeModule === 'Alerts' && (
              <AlertsModule
                students={students}
                marks={marks}
                attendance={attendance}
                settings={settings}
                onOpenProfile={s => {
                  setSelectedStudentForProfile(s);
                  setActiveModule('Profile');
                }}
              />
            )}

            {activeModule === 'Reports' && (
              <ReportsModule
                students={students}
                subjects={subjects}
                marks={marks}
                attendance={attendance}
                settings={settings}
              />
            )}

            {activeModule === 'Settings' && (
              <SettingsModule
                settings={settings}
                onUpdateSettings={setSettings}
                onResetSampleData={handleResetSampleData}
                students={students}
                subjects={subjects}
                marks={marks}
                attendance={attendance}
              />
            )}
          </div>
        </main>
      </div>

      {/* 3. Bottom Status Bar (Desktop Modena Style) */}
      <footer className="bg-[#0f172a] text-slate-400 px-4 py-1.5 text-xs border-t border-slate-800 flex items-center justify-between font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready • Local In-Memory Store Active</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Module: <strong>{activeModule}</strong></span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>Enrolled Students: <strong className="text-slate-200">{students.length}</strong></span>
          <span>Subjects: <strong className="text-slate-200">{subjects.length}</strong></span>
          <span>Evaluations: <strong className="text-slate-200">{marks.length}</strong></span>
          <span>Academic Year: <strong className="text-blue-400">{settings.defaultAcademicYear}</strong></span>
        </div>
      </footer>

      {/* 4. Java Project Explorer & Maven ZIP Modal */}
      <JavaProjectExplorerModal
        isOpen={isJavaModalOpen}
        onClose={() => setIsJavaModalOpen(false)}
      />
    </div>
  );
}
