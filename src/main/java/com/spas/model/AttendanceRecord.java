package com.spas.model;

import java.time.LocalDate;
import java.util.Objects;

/**
 * Model representing an Attendance Record.
 * Status options: "Present", "Absent", "Excused"
 */
public class AttendanceRecord {
    private String attendanceId;
    private String studentId;
    private String subjectId; // Or class identifier
    private LocalDate attendanceDate;
    private String status; // "Present", "Absent", "Excused"

    public AttendanceRecord() {
        this.attendanceDate = LocalDate.now();
        this.status = "Present";
    }

    public AttendanceRecord(String attendanceId, String studentId, String subjectId, 
                            LocalDate attendanceDate, String status) {
        this.attendanceId = attendanceId;
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.attendanceDate = attendanceDate != null ? attendanceDate : LocalDate.now();
        this.status = (status != null && !status.isBlank()) ? status : "Present";
    }

    public String getAttendanceId() { return attendanceId; }
    public void setAttendanceId(String attendanceId) { this.attendanceId = attendanceId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isPresent() { return "Present".equalsIgnoreCase(status); }
    public boolean isAbsent() { return "Absent".equalsIgnoreCase(status); }
    public boolean isExcused() { return "Excused".equalsIgnoreCase(status); }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AttendanceRecord)) return false;
        AttendanceRecord that = (AttendanceRecord) o;
        return Objects.equals(attendanceId, that.attendanceId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(attendanceId);
    }
}
