package com.spas.util;

import com.spas.model.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Generates realistic fictional academic dataset:
 * - 24 Diverse students (CS-A and CS-B, Sections 1 and 2, 2023-2024)
 * - 6 Subjects (Algorithms, Databases, Operating Systems, Web Dev, AI Principles, Computer Networks)
 * - Multiple assessment types: "Internal Test 1", "Midterm Exam", "Assignment 1", "End-Semester Exam"
 * - Multi-day attendance records
 * - Diverse distributions: top achievers, consistent pass, improving, declining, and support alert cases.
 */
public final class SampleDataGenerator {
    private SampleDataGenerator() {}

    public static List<Student> generateStudents() {
        List<Student> list = new ArrayList<>();
        list.add(new Student("STU-101", "Aarav Sharma", "Computer Science", "A", "2023-2024", "aarav.sharma@campus.edu", LocalDate.of(2023, 8, 1), "Active"));
        list.add(new Student("STU-102", "Priya Patel", "Computer Science", "A", "2023-2024", "priya.patel@campus.edu", LocalDate.of(2023, 8, 1), "Active"));
        list.add(new Student("STU-103", "Rohan Verma", "Computer Science", "A", "2023-2024", "rohan.verma@campus.edu", LocalDate.of(2023, 8, 1), "Active"));
        list.add(new Student("STU-104", "Ananya Iyer", "Computer Science", "A", "2023-2024", "ananya.iyer@campus.edu", LocalDate.of(2023, 8, 1), "Active"));
        list.add(new Student("STU-105", "Devansh Nair", "Computer Science", "A", "2023-2024", "devansh.nair@campus.edu", LocalDate.of(2023, 8, 1), "Active"));
        list.add(new Student("STU-106", "Sneha Kulkarni", "Computer Science", "A", "2023-2024", "sneha.k@campus.edu", LocalDate.of(2023, 8, 1), "Active"));
        list.add(new Student("STU-107", "Kavya Menon", "Computer Science", "A", "2023-2024", "kavya.m@campus.edu", LocalDate.of(2023, 8, 1), "Active"));
        list.add(new Student("STU-108", "Arjun Reddy", "Computer Science", "A", "2023-2024", "arjun.r@campus.edu", LocalDate.of(2023, 8, 1), "Active"));
        list.add(new Student("STU-109", "Meera Joshi", "Computer Science", "A", "2023-2024", "meera.j@campus.edu", LocalDate.of(2023, 8, 1), "Active"));
        list.add(new Student("STU-110", "Aditya Sen", "Computer Science", "A", "2023-2024", "aditya.s@campus.edu", LocalDate.of(2023, 8, 1), "Active"));
        list.add(new Student("STU-111", "Ishaan Malhotra", "Computer Science", "A", "2023-2024", "ishaan.m@campus.edu", LocalDate.of(2023, 8, 1), "Active"));
        list.add(new Student("STU-112", "Diya Sengupta", "Computer Science", "A", "2023-2024", "diya.s@campus.edu", LocalDate.of(2023, 8, 1), "Active"));

        // Section B
        list.add(new Student("STU-201", "Vikram Rathore", "Computer Science", "B", "2023-2024", "vikram.r@campus.edu", LocalDate.of(2023, 8, 2), "Active"));
        list.add(new Student("STU-202", "Tanvi Bhatia", "Computer Science", "B", "2023-2024", "tanvi.b@campus.edu", LocalDate.of(2023, 8, 2), "Active"));
        list.add(new Student("STU-203", "Kabir Deshmukh", "Computer Science", "B", "2023-2024", "kabir.d@campus.edu", LocalDate.of(2023, 8, 2), "Active"));
        list.add(new Student("STU-204", "Riya Mukherjee", "Computer Science", "B", "2023-2024", "riya.m@campus.edu", LocalDate.of(2023, 8, 2), "Active"));
        list.add(new Student("STU-205", "Nikhil Chopra", "Computer Science", "B", "2023-2024", "nikhil.c@campus.edu", LocalDate.of(2023, 8, 2), "Active"));
        list.add(new Student("STU-206", "Siddharth Roy", "Computer Science", "B", "2023-2024", "siddharth.r@campus.edu", LocalDate.of(2023, 8, 2), "Active"));
        list.add(new Student("STU-207", "Anika Saxena", "Computer Science", "B", "2023-2024", "anika.s@campus.edu", LocalDate.of(2023, 8, 2), "Active"));
        list.add(new Student("STU-208", "Karan Singhania", "Computer Science", "B", "2023-2024", "karan.s@campus.edu", LocalDate.of(2023, 8, 2), "Active"));
        list.add(new Student("STU-209", "Pooja Hegde", "Computer Science", "B", "2023-2024", "pooja.h@campus.edu", LocalDate.of(2023, 8, 2), "Active"));
        list.add(new Student("STU-210", "Gaurav Bansal", "Computer Science", "B", "2023-2024", "gaurav.b@campus.edu", LocalDate.of(2023, 8, 2), "Active"));
        list.add(new Student("STU-211", "Rhea Pillai", "Computer Science", "B", "2023-2024", "rhea.p@campus.edu", LocalDate.of(2023, 8, 2), "Active"));
        list.add(new Student("STU-212", "Mohit Tiwari", "Computer Science", "B", "2023-2024", "mohit.t@campus.edu", LocalDate.of(2023, 8, 2), "Inactive"));
        return list;
    }

    public static List<Subject> generateSubjects() {
        List<Subject> list = new ArrayList<>();
        list.add(new Subject("SUB-101", "Data Structures & Algorithms", "CS201", "Computer Science", 100.0, 40.0, 4));
        list.add(new Subject("SUB-102", "Database Management Systems", "CS202", "Computer Science", 100.0, 40.0, 4));
        list.add(new Subject("SUB-103", "Operating Systems", "CS203", "Computer Science", 100.0, 40.0, 3));
        list.add(new Subject("SUB-104", "Computer Networks", "CS204", "Computer Science", 100.0, 40.0, 3));
        list.add(new Subject("SUB-105", "Artificial Intelligence", "CS205", "Computer Science", 100.0, 40.0, 4));
        list.add(new Subject("SUB-106", "Web Technologies & Cloud", "CS206", "Computer Science", 100.0, 40.0, 3));
        return list;
    }

    public static List<MarkRecord> generateMarks(List<Student> students, List<Subject> subjects) {
        List<MarkRecord> list = new ArrayList<>();
        int counter = 1;

        // Base performance profile per student (0 to 100 scale)
        // High performers: STU-102 (Priya), STU-104 (Ananya), STU-204 (Riya)
        // Struggling / Support needed: STU-105 (Devansh), STU-203 (Kabir), STU-208 (Karan)
        // Improving: STU-103 (Rohan), STU-205 (Nikhil)
        // Declining: STU-108 (Arjun), STU-207 (Anika)
        for (Student student : students) {
            String sid = student.getStudentId();
            double baseScore;
            double trendFactor = 0; // positive for improving, negative for declining

            switch (sid) {
                case "STU-102": baseScore = 92; break; // Priya - Top
                case "STU-104": baseScore = 89; break; // Ananya - Top
                case "STU-204": baseScore = 91; break; // Riya - Top
                case "STU-101": baseScore = 78; break; // Aarav - Good
                case "STU-107": baseScore = 82; break; // Kavya - Good
                case "STU-201": baseScore = 84; break; // Vikram - Good
                case "STU-103": baseScore = 52; trendFactor = 16; break; // Rohan - Improving: 52 -> 68
                case "STU-205": baseScore = 55; trendFactor = 18; break; // Nikhil - Improving: 55 -> 73
                case "STU-108": baseScore = 72; trendFactor = -22; break; // Arjun - Declining: 72 -> 50
                case "STU-207": baseScore = 68; trendFactor = -24; break; // Anika - Declining: 68 -> 44
                case "STU-105": baseScore = 34; break; // Devansh - Support needed (low average)
                case "STU-203": baseScore = 36; break; // Kabir - Support needed (failing multiple)
                case "STU-208": baseScore = 38; break; // Karan - Support needed
                case "STU-212": baseScore = 45; break; // Mohit - Inactive / low
                default: baseScore = 65 + (Math.abs(sid.hashCode()) % 15); break;
            }

            // Create 3 assessment points across 3 key subjects for deep comparisons
            Subject s1 = subjects.get(0); // DSA
            Subject s2 = subjects.get(1); // DBMS
            Subject s3 = subjects.get(2); // OS

            // Assessment 1: Internal Test 1 (max 50)
            double t1Score = Math.min(50.0, Math.max(12.0, (baseScore * 0.50)));
            list.add(new MarkRecord("MR-" + (counter++), sid, s1.getSubjectId(), "Internal Test 1", "Internal Test", LocalDate.of(2023, 9, 15), Math.round(t1Score), 50.0));
            list.add(new MarkRecord("MR-" + (counter++), sid, s2.getSubjectId(), "Internal Test 1", "Internal Test", LocalDate.of(2023, 9, 18), Math.round(t1Score * 0.95), 50.0));

            // Assessment 2: Midterm Exam (max 100)
            double midScore = Math.min(100.0, Math.max(22.0, (baseScore + (trendFactor * 0.5))));
            list.add(new MarkRecord("MR-" + (counter++), sid, s1.getSubjectId(), "Midterm Exam", "Midterm", LocalDate.of(2023, 10, 20), Math.round(midScore), 100.0));
            list.add(new MarkRecord("MR-" + (counter++), sid, s2.getSubjectId(), "Midterm Exam", "Midterm", LocalDate.of(2023, 10, 24), Math.round(midScore * 1.02), 100.0));
            list.add(new MarkRecord("MR-" + (counter++), sid, s3.getSubjectId(), "Midterm Exam", "Midterm", LocalDate.of(2023, 10, 28), Math.round(midScore * 0.92), 100.0));

            // Assessment 3: End-Semester Exam (max 100)
            double endScore = Math.min(100.0, Math.max(20.0, (baseScore + trendFactor)));
            list.add(new MarkRecord("MR-" + (counter++), sid, s1.getSubjectId(), "End-Semester Exam", "Final Examination", LocalDate.of(2023, 12, 10), Math.round(endScore), 100.0));
            list.add(new MarkRecord("MR-" + (counter++), sid, s2.getSubjectId(), "End-Semester Exam", "Final Examination", LocalDate.of(2023, 12, 14), Math.round(endScore * 0.96), 100.0));
            list.add(new MarkRecord("MR-" + (counter++), sid, s3.getSubjectId(), "End-Semester Exam", "Final Examination", LocalDate.of(2023, 12, 18), Math.round(endScore * 1.04), 100.0));
        }

        return list;
    }

    public static List<AttendanceRecord> generateAttendance(List<Student> students) {
        List<AttendanceRecord> list = new ArrayList<>();
        int counter = 1;

        LocalDate[] dates = new LocalDate[] {
            LocalDate.of(2023, 9, 4),
            LocalDate.of(2023, 9, 11),
            LocalDate.of(2023, 9, 18),
            LocalDate.of(2023, 9, 25),
            LocalDate.of(2023, 10, 2),
            LocalDate.of(2023, 10, 9),
            LocalDate.of(2023, 10, 16),
            LocalDate.of(2023, 10, 23),
            LocalDate.of(2023, 10, 30),
            LocalDate.of(2023, 11, 6),
            LocalDate.of(2023, 11, 13),
            LocalDate.of(2023, 11, 20)
        };

        for (Student s : students) {
            String sid = s.getStudentId();
            // Determine attendance attendance profile:
            // STU-105 (Devansh): low attendance (e.g. 55%) -> at risk
            // STU-203 (Kabir): low attendance (e.g. 66%) -> at risk
            // STU-106 (Sneha): excused medical leave
            // others: 80% to 100%
            for (int i = 0; i < dates.length; i++) {
                String status = "Present";
                if ("STU-105".equals(sid)) {
                    if (i % 2 == 1) status = "Absent"; // 50% absent
                } else if ("STU-203".equals(sid)) {
                    if (i == 2 || i == 5 || i == 8 || i == 11) status = "Absent"; // ~66% present
                } else if ("STU-106".equals(sid)) {
                    if (i == 4 || i == 5) status = "Excused";
                    else if (i == 9) status = "Absent";
                } else if ("STU-208".equals(sid)) {
                    if (i == 3 || i == 7 || i == 10) status = "Absent";
                } else {
                    // Normal students miss 0-1 session
                    if (i == 6 && (sid.hashCode() % 4 == 0)) {
                        status = "Absent";
                    }
                }

                list.add(new AttendanceRecord("ATT-" + (counter++), sid, "CS-CORE", dates[i], status));
            }
        }

        return list;
    }
}
