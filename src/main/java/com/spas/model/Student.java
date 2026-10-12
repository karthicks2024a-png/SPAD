package com.spas.model;

import java.time.LocalDate;
import java.util.Objects;

/**
 * Model representing a Student entity.
 */
public class Student {
    private String studentId;
    private String fullName;
    private String department; // Class or Department (e.g., "Computer Science", "CSE-A")
    private String section;    // Section (e.g., "A", "B", "1")
    private String academicYear; // e.g., "2023-2024"
    private String email;
    private LocalDate enrollmentDate;
    private String status;      // "Active" or "Inactive"

    public Student() {
        this.status = "Active";
        this.enrollmentDate = LocalDate.now();
    }

    public Student(String studentId, String fullName, String department, String section, 
                   String academicYear, String email, LocalDate enrollmentDate, String status) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.department = department;
        this.section = section;
        this.academicYear = academicYear;
        this.email = email;
        this.enrollmentDate = enrollmentDate != null ? enrollmentDate : LocalDate.now();
        this.status = (status != null && !status.isBlank()) ? status : "Active";
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDate getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(LocalDate enrollmentDate) { this.enrollmentDate = enrollmentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isActive() {
        return "Active".equalsIgnoreCase(status);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Student)) return false;
        Student student = (Student) o;
        return Objects.equals(studentId, student.studentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId);
    }

    @Override
    public String toString() {
        return fullName + " (" + studentId + ")";
    }
}
