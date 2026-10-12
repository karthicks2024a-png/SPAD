export interface Student {
  studentId: string;
  fullName: string;
  department: string;
  section: string;
  academicYear: string;
  email: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive';
}

export interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  department: string;
  maxMarks: number;
  passingMarks: number;
  credits: number;
}

export interface MarkRecord {
  assessmentId: string;
  studentId: string;
  subjectId: string;
  assessmentName: string;
  assessmentType: 'Internal Test' | 'Midterm' | 'Assignment' | 'Practical' | 'Final Examination';
  assessmentDate: string;
  marksObtained: number;
  maxMarks: number;
}

export interface AttendanceRecord {
  attendanceId: string;
  studentId: string;
  subjectId: string;
  attendanceDate: string;
  status: 'Present' | 'Absent' | 'Excused';
}

export interface AcademicAlert {
  alertId: string;
  studentId: string;
  studentName: string;
  reason: string;
  metricValue: number;
  metricLabel: string;
  severity: 'Critical' | 'Warning' | 'Informational';
  suggestedAction: string;
  triggerDate: string;
  reviewed: boolean;
}

export interface AppSettings {
  passingPercentage: number;
  attendanceWarningThreshold: number;
  academicSupportScoreThreshold: number;
  highPerformanceThreshold: number;
  defaultAcademicYear: string;
  includeExcusedInAttendance: boolean;
}

export type ModuleType =
  | 'Dashboard'
  | 'Students'
  | 'Subjects'
  | 'Marks'
  | 'Attendance'
  | 'Profile'
  | 'Analytics'
  | 'Alerts'
  | 'Reports'
  | 'Settings'
  | 'JavaSource';
