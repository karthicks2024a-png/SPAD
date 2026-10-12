package com.spas.model;

import java.time.LocalDate;
import java.util.Objects;

/**
 * Model representing an Assessment / Mark Record.
 */
public class MarkRecord {
    private String assessmentId;
    private String studentId;
    private String subjectId;
    private String assessmentName; // e.g., "Internal Test 1", "Midterm", "Assignment 1", "Final Exam"
    private String assessmentType; // "Internal Test", "Assignment", "Practical", "Final Examination"
    private LocalDate assessmentDate;
    private double marksObtained;
    private double maxMarks;

    public MarkRecord() {
        this.assessmentDate = LocalDate.now();
        this.maxMarks = 100.0;
        this.marksObtained = 0.0;
    }

    public MarkRecord(String assessmentId, String studentId, String subjectId, String assessmentName,
                      String assessmentType, LocalDate assessmentDate, double marksObtained, double maxMarks) {
        this.assessmentId = assessmentId;
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.assessmentName = assessmentName;
        this.assessmentType = assessmentType;
        this.assessmentDate = assessmentDate != null ? assessmentDate : LocalDate.now();
        this.marksObtained = marksObtained;
        this.maxMarks = maxMarks > 0 ? maxMarks : 100.0;
    }

    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public String getAssessmentName() { return assessmentName; }
    public void setAssessmentName(String assessmentName) { this.assessmentName = assessmentName; }

    public String getAssessmentType() { return assessmentType; }
    public void setAssessmentType(String assessmentType) { this.assessmentType = assessmentType; }

    public LocalDate getAssessmentDate() { return assessmentDate; }
    public void setAssessmentDate(LocalDate assessmentDate) { this.assessmentDate = assessmentDate; }

    public double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(double marksObtained) { this.marksObtained = marksObtained; }

    public double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(double maxMarks) { this.maxMarks = maxMarks; }

    /**
     * Calculates the score percentage: (marksObtained / maxMarks) * 100.
     */
    public double getPercentage() {
        if (maxMarks <= 0) return 0.0;
        double pct = (marksObtained / maxMarks) * 100.0;
        return Math.round(pct * 100.0) / 100.0;
    }

    /**
     * Checks if the score is considered passing based on passing percentage.
     */
    public boolean isPass(double passingPercentage) {
        return getPercentage() >= passingPercentage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MarkRecord)) return false;
        MarkRecord that = (MarkRecord) o;
        return Objects.equals(assessmentId, that.assessmentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(assessmentId);
    }
}
