package com.spas.service;

import com.spas.model.*;
import com.spas.util.SampleDataGenerator;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

import java.util.ArrayList;
import java.util.List;

/**
 * Singleton In-memory Data Service holding observable collections.
 */
public class DataService {
    private static DataService instance;

    private final ObservableList<Student> students = FXCollections.observableArrayList();
    private final ObservableList<Subject> subjects = FXCollections.observableArrayList();
    private final ObservableList<MarkRecord> marks = FXCollections.observableArrayList();
    private final ObservableList<AttendanceRecord> attendance = FXCollections.observableArrayList();
    private final ObservableList<AcademicAlert> alerts = FXCollections.observableArrayList();
    private AppSettings settings = new AppSettings();

    private DataService() {
        loadSampleData();
    }

    public static synchronized DataService getInstance() {
        if (instance == null) {
            instance = new DataService();
        }
        return instance;
    }

    public void loadSampleData() {
        students.clear();
        subjects.clear();
        marks.clear();
        attendance.clear();
        alerts.clear();

        List<Student> sampleStudents = SampleDataGenerator.generateStudents();
        List<Subject> sampleSubjects = SampleDataGenerator.generateSubjects();
        List<MarkRecord> sampleMarks = SampleDataGenerator.generateMarks(sampleStudents, sampleSubjects);
        List<AttendanceRecord> sampleAtt = SampleDataGenerator.generateAttendance(sampleStudents);

        students.addAll(sampleStudents);
        subjects.addAll(sampleSubjects);
        marks.addAll(sampleMarks);
        attendance.addAll(sampleAtt);

        refreshAlerts();
    }

    public void refreshAlerts() {
        alerts.clear();
        // Evaluate alerts using transparent rule engine:
        // Rule 1: Overall Average < academicSupportScoreThreshold (default 40%) -> Critical
        // Rule 2: Attendance < attendanceWarningThreshold (default 75%) -> Warning
        // Rule 3: Failing marks in multiple assessments -> Warning
        // Rule 4: Declining performance drop > 15% -> Informational
        double minScore = settings.getAcademicSupportScoreThreshold();
        double minAtt = settings.getAttendanceWarningThreshold();
        int alertIdCounter = 1;

        for (Student s : students) {
            if (!s.isActive()) continue;
            String sid = s.getStudentId();

            // Calculate student average percentage
            double avg = calculateStudentOverallAverage(sid);
            double attPct = calculateStudentAttendancePercentage(sid);

            if (avg > 0 && avg < minScore) {
                alerts.add(new AcademicAlert(
                        "ALT-" + (alertIdCounter++), sid, s.getFullName(),
                        "Overall academic average is below the supportive threshold (" + minScore + "%)",
                        avg, String.format("Average: %.1f%%", avg),
                        "Critical",
                        "Arrange one-on-one remedial sessions and syllabus diagnostic review.",
                        null, false
                ));
            }

            if (attPct < minAtt) {
                alerts.add(new AcademicAlert(
                        "ALT-" + (alertIdCounter++), sid, s.getFullName(),
                        "Attendance rate is below the institutional warning threshold (" + minAtt + "%)",
                        attPct, String.format("Attendance: %.1f%%", attPct),
                        "Warning",
                        "Schedule an academic advisory check-in to identify absence causes.",
                        null, false
                ));
            }

            // Check for multiple failed assessments
            long failCount = marks.stream()
                    .filter(m -> m.getStudentId().equals(sid))
                    .filter(m -> m.getPercentage() < settings.getPassingPercentage())
                    .count();
            if (failCount >= 2 && avg >= minScore) {
                alerts.add(new AcademicAlert(
                        "ALT-" + (alertIdCounter++), sid, s.getFullName(),
                        "Failed " + failCount + " individual assessment tasks",
                        failCount, failCount + " failing exams",
                        "Warning",
                        "Focus on targeted topic reassessment and homework problem sets.",
                        null, false
                ));
            }
        }
    }

    public double calculateStudentOverallAverage(String studentId) {
        List<MarkRecord> studentMarks = new ArrayList<>();
        for (MarkRecord m : marks) {
            if (m.getStudentId().equals(studentId)) {
                studentMarks.add(m);
            }
        }
        if (studentMarks.isEmpty()) return 0.0;
        double sum = 0.0;
        for (MarkRecord m : studentMarks) {
            sum += m.getPercentage();
        }
        return Math.round((sum / studentMarks.size()) * 100.0) / 100.0;
    }

    public double calculateStudentAttendancePercentage(String studentId) {
        int presentCount = 0;
        int countableCount = 0;
        for (AttendanceRecord a : attendance) {
            if (a.getStudentId().equals(studentId)) {
                if (a.isPresent()) {
                    presentCount++;
                    countableCount++;
                } else if (a.isAbsent()) {
                    countableCount++;
                } else if (a.isExcused() && settings.isIncludeExcusedInAttendance()) {
                    // if settings include excused as countable
                    countableCount++;
                }
            }
        }
        if (countableCount == 0) return 100.0;
        double pct = ((double) presentCount / countableCount) * 100.0;
        return Math.round(pct * 100.0) / 100.0;
    }

    public ObservableList<Student> getStudents() { return students; }
    public ObservableList<Subject> getSubjects() { return subjects; }
    public ObservableList<MarkRecord> getMarks() { return marks; }
    public ObservableList<AttendanceRecord> getAttendance() { return attendance; }
    public ObservableList<AcademicAlert> getAlerts() { return alerts; }
    public AppSettings getSettings() { return settings; }
    public void setSettings(AppSettings settings) {
        this.settings = settings;
        refreshAlerts();
    }
}
