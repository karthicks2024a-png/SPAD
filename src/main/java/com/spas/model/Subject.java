package com.spas.model;

import java.util.Objects;

/**
 * Model representing an academic Subject entity.
 */
public class Subject {
    private String subjectId;
    private String subjectName;
    private String subjectCode;
    private String department;
    private double maxMarks;
    private double passingMarks;
    private int credits;

    public Subject() {
        this.maxMarks = 100.0;
        this.passingMarks = 40.0;
        this.credits = 3;
    }

    public Subject(String subjectId, String subjectName, String subjectCode, String department, 
                   double maxMarks, double passingMarks, int credits) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.department = department;
        this.maxMarks = maxMarks;
        this.passingMarks = passingMarks;
        this.credits = credits;
    }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(double maxMarks) { this.maxMarks = maxMarks; }

    public double getPassingMarks() { return passingMarks; }
    public void setPassingMarks(double passingMarks) { this.passingMarks = passingMarks; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Subject)) return false;
        Subject subject = (Subject) o;
        return Objects.equals(subjectId, subject.subjectId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(subjectId);
    }

    @Override
    public String toString() {
        return subjectName + " (" + subjectCode + ")";
    }
}
