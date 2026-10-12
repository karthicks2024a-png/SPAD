package com.spas.model;

/**
 * Global application settings and threshold configurations.
 */
public class AppSettings {
    private double passingPercentage;         // Default 40.0%
    private double attendanceWarningThreshold; // Default 75.0%
    private double academicSupportScoreThreshold; // Default 40.0%
    private double highPerformanceThreshold;   // Default 80.0%
    private String defaultAcademicYear;        // e.g. "2023-2024"
    private boolean includeExcusedInAttendance; // Default false (excused are neutral)

    public AppSettings() {
        this.passingPercentage = 40.0;
        this.attendanceWarningThreshold = 75.0;
        this.academicSupportScoreThreshold = 40.0;
        this.highPerformanceThreshold = 80.0;
        this.defaultAcademicYear = "2023-2024";
        this.includeExcusedInAttendance = false;
    }

    public double getPassingPercentage() { return passingPercentage; }
    public void setPassingPercentage(double passingPercentage) { this.passingPercentage = passingPercentage; }

    public double getAttendanceWarningThreshold() { return attendanceWarningThreshold; }
    public void setAttendanceWarningThreshold(double attendanceWarningThreshold) { 
        this.attendanceWarningThreshold = attendanceWarningThreshold; 
    }

    public double getAcademicSupportScoreThreshold() { return academicSupportScoreThreshold; }
    public void setAcademicSupportScoreThreshold(double academicSupportScoreThreshold) { 
        this.academicSupportScoreThreshold = academicSupportScoreThreshold; 
    }

    public double getHighPerformanceThreshold() { return highPerformanceThreshold; }
    public void setHighPerformanceThreshold(double highPerformanceThreshold) { 
        this.highPerformanceThreshold = highPerformanceThreshold; 
    }

    public String getDefaultAcademicYear() { return defaultAcademicYear; }
    public void setDefaultAcademicYear(String defaultAcademicYear) { this.defaultAcademicYear = defaultAcademicYear; }

    public boolean isIncludeExcusedInAttendance() { return includeExcusedInAttendance; }
    public void setIncludeExcusedInAttendance(boolean includeExcusedInAttendance) { 
        this.includeExcusedInAttendance = includeExcusedInAttendance; 
    }
}
