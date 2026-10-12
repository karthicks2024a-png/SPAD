import { Student, Subject, MarkRecord, AttendanceRecord, AppSettings } from '../types';

export const initialStudents: Student[] = [
  { studentId: 'STU-101', fullName: 'Aarav Sharma', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'aarav.sharma@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },
  { studentId: 'STU-102', fullName: 'Priya Patel', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'priya.patel@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },
  { studentId: 'STU-103', fullName: 'Rohan Verma', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'rohan.verma@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },
  { studentId: 'STU-104', fullName: 'Ananya Iyer', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'ananya.iyer@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },
  { studentId: 'STU-105', fullName: 'Devansh Nair', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'devansh.nair@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },
  { studentId: 'STU-106', fullName: 'Sneha Kulkarni', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'sneha.k@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },
  { studentId: 'STU-107', fullName: 'Kavya Menon', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'kavya.m@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },
  { studentId: 'STU-108', fullName: 'Arjun Reddy', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'arjun.r@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },
  { studentId: 'STU-109', fullName: 'Meera Joshi', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'meera.j@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },
  { studentId: 'STU-110', fullName: 'Aditya Sen', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'aditya.s@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },
  { studentId: 'STU-111', fullName: 'Ishaan Malhotra', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'ishaan.m@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },
  { studentId: 'STU-112', fullName: 'Diya Sengupta', department: 'Computer Science', section: 'A', academicYear: '2023-2024', email: 'diya.s@campus.edu', enrollmentDate: '2023-08-01', status: 'Active' },

  { studentId: 'STU-201', fullName: 'Vikram Rathore', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'vikram.r@campus.edu', enrollmentDate: '2023-08-02', status: 'Active' },
  { studentId: 'STU-202', fullName: 'Tanvi Bhatia', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'tanvi.b@campus.edu', enrollmentDate: '2023-08-02', status: 'Active' },
  { studentId: 'STU-203', fullName: 'Kabir Deshmukh', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'kabir.d@campus.edu', enrollmentDate: '2023-08-02', status: 'Active' },
  { studentId: 'STU-204', fullName: 'Riya Mukherjee', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'riya.m@campus.edu', enrollmentDate: '2023-08-02', status: 'Active' },
  { studentId: 'STU-205', fullName: 'Nikhil Chopra', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'nikhil.c@campus.edu', enrollmentDate: '2023-08-02', status: 'Active' },
  { studentId: 'STU-206', fullName: 'Siddharth Roy', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'siddharth.r@campus.edu', enrollmentDate: '2023-08-02', status: 'Active' },
  { studentId: 'STU-207', fullName: 'Anika Saxena', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'anika.s@campus.edu', enrollmentDate: '2023-08-02', status: 'Active' },
  { studentId: 'STU-208', fullName: 'Karan Singhania', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'karan.s@campus.edu', enrollmentDate: '2023-08-02', status: 'Active' },
  { studentId: 'STU-209', fullName: 'Pooja Hegde', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'pooja.h@campus.edu', enrollmentDate: '2023-08-02', status: 'Active' },
  { studentId: 'STU-210', fullName: 'Gaurav Bansal', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'gaurav.b@campus.edu', enrollmentDate: '2023-08-02', status: 'Active' },
  { studentId: 'STU-211', fullName: 'Rhea Pillai', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'rhea.p@campus.edu', enrollmentDate: '2023-08-02', status: 'Active' },
  { studentId: 'STU-212', fullName: 'Mohit Tiwari', department: 'Computer Science', section: 'B', academicYear: '2023-2024', email: 'mohit.t@campus.edu', enrollmentDate: '2023-08-02', status: 'Inactive' }
];

export const initialSubjects: Subject[] = [
  { subjectId: 'SUB-101', subjectName: 'Data Structures & Algorithms', subjectCode: 'CS201', department: 'Computer Science', maxMarks: 100, passingMarks: 40, credits: 4 },
  { subjectId: 'SUB-102', subjectName: 'Database Management Systems', subjectCode: 'CS202', department: 'Computer Science', maxMarks: 100, passingMarks: 40, credits: 4 },
  { subjectId: 'SUB-103', subjectName: 'Operating Systems', subjectCode: 'CS203', department: 'Computer Science', maxMarks: 100, passingMarks: 40, credits: 3 },
  { subjectId: 'SUB-104', subjectName: 'Computer Networks', subjectCode: 'CS204', department: 'Computer Science', maxMarks: 100, passingMarks: 40, credits: 3 },
  { subjectId: 'SUB-105', subjectName: 'Artificial Intelligence', subjectCode: 'CS205', department: 'Computer Science', maxMarks: 100, passingMarks: 40, credits: 4 },
  { subjectId: 'SUB-106', subjectName: 'Web Technologies & Cloud', subjectCode: 'CS206', department: 'Computer Science', maxMarks: 100, passingMarks: 40, credits: 3 }
];

export function generateInitialMarks(): MarkRecord[] {
  const marks: MarkRecord[] = [];
  let counter = 1;

  initialStudents.forEach((student) => {
    const sid = student.studentId;
    let baseScore = 65;
    let trendFactor = 0;

    if (sid === 'STU-102') baseScore = 92;
    else if (sid === 'STU-104') baseScore = 89;
    else if (sid === 'STU-204') baseScore = 91;
    else if (sid === 'STU-101') baseScore = 78;
    else if (sid === 'STU-107') baseScore = 82;
    else if (sid === 'STU-201') baseScore = 84;
    else if (sid === 'STU-103') { baseScore = 52; trendFactor = 16; } // Rohan improving
    else if (sid === 'STU-205') { baseScore = 55; trendFactor = 18; } // Nikhil improving
    else if (sid === 'STU-108') { baseScore = 72; trendFactor = -22; } // Arjun declining
    else if (sid === 'STU-207') { baseScore = 68; trendFactor = -24; } // Anika declining
    else if (sid === 'STU-105') baseScore = 34; // Devansh support needed
    else if (sid === 'STU-203') baseScore = 36; // Kabir support needed
    else if (sid === 'STU-208') baseScore = 38; // Karan support needed
    else if (sid === 'STU-212') baseScore = 45;

    // Test 1 (max 50)
    const t1 = Math.min(50, Math.max(12, Math.round(baseScore * 0.5)));
    marks.push({
      assessmentId: `MR-${counter++}`,
      studentId: sid,
      subjectId: 'SUB-101',
      assessmentName: 'Internal Test 1',
      assessmentType: 'Internal Test',
      assessmentDate: '2023-09-15',
      marksObtained: t1,
      maxMarks: 50
    });
    marks.push({
      assessmentId: `MR-${counter++}`,
      studentId: sid,
      subjectId: 'SUB-102',
      assessmentName: 'Internal Test 1',
      assessmentType: 'Internal Test',
      assessmentDate: '2023-09-18',
      marksObtained: Math.round(t1 * 0.95),
      maxMarks: 50
    });

    // Midterm (max 100)
    const mid = Math.min(100, Math.max(22, Math.round(baseScore + (trendFactor * 0.5))));
    marks.push({
      assessmentId: `MR-${counter++}`,
      studentId: sid,
      subjectId: 'SUB-101',
      assessmentName: 'Midterm Exam',
      assessmentType: 'Midterm',
      assessmentDate: '2023-10-20',
      marksObtained: mid,
      maxMarks: 100
    });
    marks.push({
      assessmentId: `MR-${counter++}`,
      studentId: sid,
      subjectId: 'SUB-102',
      assessmentName: 'Midterm Exam',
      assessmentType: 'Midterm',
      assessmentDate: '2023-10-24',
      marksObtained: Math.min(100, Math.round(mid * 1.02)),
      maxMarks: 100
    });
    marks.push({
      assessmentId: `MR-${counter++}`,
      studentId: sid,
      subjectId: 'SUB-103',
      assessmentName: 'Midterm Exam',
      assessmentType: 'Midterm',
      assessmentDate: '2023-10-28',
      marksObtained: Math.min(100, Math.round(mid * 0.92)),
      maxMarks: 100
    });

    // End-Semester (max 100)
    const end = Math.min(100, Math.max(20, Math.round(baseScore + trendFactor)));
    marks.push({
      assessmentId: `MR-${counter++}`,
      studentId: sid,
      subjectId: 'SUB-101',
      assessmentName: 'End-Semester Exam',
      assessmentType: 'Final Examination',
      assessmentDate: '2023-12-10',
      marksObtained: end,
      maxMarks: 100
    });
    marks.push({
      assessmentId: `MR-${counter++}`,
      studentId: sid,
      subjectId: 'SUB-102',
      assessmentName: 'End-Semester Exam',
      assessmentType: 'Final Examination',
      assessmentDate: '2023-12-14',
      marksObtained: Math.min(100, Math.round(end * 0.96)),
      maxMarks: 100
    });
    marks.push({
      assessmentId: `MR-${counter++}`,
      studentId: sid,
      subjectId: 'SUB-103',
      assessmentName: 'End-Semester Exam',
      assessmentType: 'Final Examination',
      assessmentDate: '2023-12-18',
      marksObtained: Math.min(100, Math.round(end * 1.04)),
      maxMarks: 100
    });
  });

  return marks;
}

export function generateInitialAttendance(): AttendanceRecord[] {
  const att: AttendanceRecord[] = [];
  let counter = 1;

  const dates = [
    '2023-09-04', '2023-09-11', '2023-09-18', '2023-09-25',
    '2023-10-02', '2023-10-09', '2023-10-16', '2023-10-23',
    '2023-10-30', '2023-11-06', '2023-11-13', '2023-11-20'
  ];

  initialStudents.forEach((student) => {
    const sid = student.studentId;
    dates.forEach((d, idx) => {
      let status: 'Present' | 'Absent' | 'Excused' = 'Present';

      if (sid === 'STU-105') {
        if (idx % 2 === 1) status = 'Absent'; // 50% attendance
      } else if (sid === 'STU-203') {
        if (idx === 2 || idx === 5 || idx === 8 || idx === 11) status = 'Absent'; // ~66% attendance
      } else if (sid === 'STU-106') {
        if (idx === 4 || idx === 5) status = 'Excused';
        else if (idx === 9) status = 'Absent';
      } else if (sid === 'STU-208') {
        if (idx === 3 || idx === 7 || idx === 10) status = 'Absent';
      } else {
        if (idx === 6 && (sid.charCodeAt(sid.length - 1) % 4 === 0)) {
          status = 'Absent';
        }
      }

      att.push({
        attendanceId: `ATT-${counter++}`,
        studentId: sid,
        subjectId: 'CS-CORE',
        attendanceDate: d,
        status
      });
    });
  });

  return att;
}

export const defaultSettings: AppSettings = {
  passingPercentage: 40.0,
  attendanceWarningThreshold: 75.0,
  academicSupportScoreThreshold: 40.0,
  highPerformanceThreshold: 80.0,
  defaultAcademicYear: '2023-2024',
  includeExcusedInAttendance: false
};
