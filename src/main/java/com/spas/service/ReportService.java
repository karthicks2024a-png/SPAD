package com.spas.service;

import com.spas.model.*;
import com.spas.util.CsvUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service generating formatted academic reports in plain text and standard CSV.
 */
public class ReportService {
    private final DataService dataService;
    private final AnalyticsService analyticsService;

    public ReportService() {
        this.dataService = DataService.getInstance();
        this.analyticsService = new AnalyticsService();
    }

    private String getTimestampHeader() {
        return "Generated: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    /**
     * Report 1: Individual Student Report
     */
    public String generateStudentTextReport(String studentId) {
        Student student = dataService.getStudents().stream()
                .filter(s -> s.getStudentId().equalsIgnoreCase(studentId))
                .findFirst().orElse(null);
        if (student == null) return "Student not found: " + studentId;

        double avg = dataService.calculateStudentOverallAverage(studentId);
        double att = dataService.calculateStudentAttendancePercentage(studentId);

        StringBuilder sb = new StringBuilder();
        sb.append("=================================================================\n");
        sb.append("       STUDENT PERFORMANCE ANALYTICS SYSTEM - INDIVIDUAL REPORT\n");
        sb.append("=================================================================\n");
        sb.append(getTimestampHeader()).append("\n\n");
        sb.append(String.format("Student ID   : %s\n", student.getStudentId()));
        sb.append(String.format("Name         : %s\n", student.getFullName()));
        sb.append(String.format("Class/Dept   : %s (Section %s)\n", student.getDepartment(), student.getSection()));
        sb.append(String.format("Academic Year: %s\n", student.getAcademicYear()));
        sb.append(String.format("Overall Avg  : %.2f%%\n", avg));
        sb.append(String.format("Attendance   : %.2f%%\n\n", att));

        sb.append("-----------------------------------------------------------------\n");
        sb.append(String.format("%-12s | %-22s | %-16s | %-8s | %-8s\n", "Date", "Subject", "Assessment", "Score", "Result"));
        sb.append("-----------------------------------------------------------------\n");

        List<MarkRecord> records = dataService.getMarks().stream()
                .filter(m -> m.getStudentId().equalsIgnoreCase(studentId))
                .collect(Collectors.toList());

        for (MarkRecord m : records) {
            Subject sub = dataService.getSubjects().stream()
                    .filter(s -> s.getSubjectId().equalsIgnoreCase(m.getSubjectId()))
                    .findFirst().orElse(null);
            String subName = sub != null ? sub.getSubjectName() : m.getSubjectId();
            if (subName.length() > 22) subName = subName.substring(0, 19) + "...";
            String res = m.getPercentage() >= dataService.getSettings().getPassingPercentage() ? "PASS" : "FAIL";
            sb.append(String.format("%-12s | %-22s | %-16s | %5.1f/%-3.0f | %-8s\n",
                    m.getAssessmentDate(), subName, m.getAssessmentName(), m.getMarksObtained(), m.getMaxMarks(), res));
        }

        sb.append("=================================================================\n");
        return sb.toString();
    }

    /**
     * Report 2: Class Performance Report
     */
    public String generateClassPerformanceReport() {
        StringBuilder sb = new StringBuilder();
        sb.append("=================================================================\n");
        sb.append("        STUDENT PERFORMANCE ANALYTICS SYSTEM - CLASS REPORT\n");
        sb.append("=================================================================\n");
        sb.append(getTimestampHeader()).append("\n");
        sb.append(String.format("Total Students     : %d\n", dataService.getStudents().size()));
        sb.append(String.format("Class Average      : %.1f%%\n", analyticsService.getOverallClassAverage()));
        sb.append(String.format("Average Attendance : %.1f%%\n", analyticsService.getOverallAttendanceAverage()));
        sb.append(String.format("Academic Support   : %d students\n\n", analyticsService.getAcademicSupportCount()));

        sb.append("-----------------------------------------------------------------\n");
        sb.append(String.format("%-4s | %-10s | %-22s | %-8s | %-8s | %-8s\n", "Rank", "ID", "Full Name", "Class", "Avg %", "Att %"));
        sb.append("-----------------------------------------------------------------\n");

        List<AnalyticsService.StudentRanking> rankings = analyticsService.getRankings();
        for (AnalyticsService.StudentRanking r : rankings) {
            String name = r.getStudent().getFullName();
            if (name.length() > 22) name = name.substring(0, 19) + "...";
            sb.append(String.format("%-4d | %-10s | %-22s | %-8s | %6.1f%% | %6.1f%%\n",
                    r.getRank(), r.getStudent().getStudentId(), name, r.getStudent().getSection(), r.getOverallAverage(), r.getAttendancePercentage()));
        }
        sb.append("=================================================================\n");
        return sb.toString();
    }

    /**
     * CSV Exporter for Class Performance
     */
    public String exportClassPerformanceCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append(CsvUtils.toCsvLine("Rank", "Student ID", "Full Name", "Department", "Section", "Overall Average %", "Attendance %")).append("\n");
        for (AnalyticsService.StudentRanking r : analyticsService.getRankings()) {
            sb.append(CsvUtils.toCsvLine(
                    r.getRank(),
                    r.getStudent().getStudentId(),
                    r.getStudent().getFullName(),
                    r.getStudent().getDepartment(),
                    r.getStudent().getSection(),
                    String.format("%.2f", r.getOverallAverage()),
                    String.format("%.2f", r.getAttendancePercentage())
            )).append("\n");
        }
        return sb.toString();
    }

    /**
     * CSV Exporter for Academic Alerts
     */
    public String exportAcademicSupportCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append(CsvUtils.toCsvLine("Alert ID", "Student ID", "Student Name", "Severity", "Trigger Reason", "Metric Value", "Action Suggested", "Reviewed")).append("\n");
        for (AcademicAlert a : dataService.getAlerts()) {
            sb.append(CsvUtils.toCsvLine(
                    a.getAlertId(),
                    a.getStudentId(),
                    a.getStudentName(),
                    a.getSeverity(),
                    a.getReason(),
                    a.getMetricLabel(),
                    a.getSuggestedAction(),
                    a.isReviewed() ? "Yes" : "No"
            )).append("\n");
        }
        return sb.toString();
    }
}
