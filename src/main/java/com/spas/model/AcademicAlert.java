package com.spas.model;

import java.time.LocalDate;
import java.util.Objects;

/**
 * Model representing an automated Academic Support Alert.
 * Severity: "Critical", "Warning", "Informational"
 */
public class AcademicAlert {
    private String alertId;
    private String studentId;
    private String studentName;
    private String reason;
    private double metricValue; // Marks average or attendance %
    private String metricLabel; // e.g. "Average: 36.4%" or "Attendance: 68.0%"
    private String severity;    // "Critical", "Warning", "Informational"
    private String suggestedAction;
    private LocalDate triggerDate;
    private boolean reviewed;

    public AcademicAlert() {
        this.triggerDate = LocalDate.now();
        this.reviewed = false;
        this.severity = "Warning";
    }

    public AcademicAlert(String alertId, String studentId, String studentName, String reason,
                         double metricValue, String metricLabel, String severity,
                         String suggestedAction, LocalDate triggerDate, boolean reviewed) {
        this.alertId = alertId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.reason = reason;
        this.metricValue = metricValue;
        this.metricLabel = metricLabel;
        this.severity = severity != null ? severity : "Warning";
        this.suggestedAction = suggestedAction;
        this.triggerDate = triggerDate != null ? triggerDate : LocalDate.now();
        this.reviewed = reviewed;
    }

    public String getAlertId() { return alertId; }
    public void setAlertId(String alertId) { this.alertId = alertId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public double getMetricValue() { return metricValue; }
    public void setMetricValue(double metricValue) { this.metricValue = metricValue; }

    public String getMetricLabel() { return metricLabel; }
    public void setMetricLabel(String metricLabel) { this.metricLabel = metricLabel; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getSuggestedAction() { return suggestedAction; }
    public void setSuggestedAction(String suggestedAction) { this.suggestedAction = suggestedAction; }

    public LocalDate getTriggerDate() { return triggerDate; }
    public void setTriggerDate(LocalDate triggerDate) { this.triggerDate = triggerDate; }

    public boolean isReviewed() { return reviewed; }
    public void setReviewed(boolean reviewed) { this.reviewed = reviewed; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AcademicAlert)) return false;
        AcademicAlert that = (AcademicAlert) o;
        return Objects.equals(alertId, that.alertId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(alertId);
    }
}
