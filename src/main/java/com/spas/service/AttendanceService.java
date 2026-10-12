package com.spas.service;

import com.spas.model.AttendanceRecord;
import com.spas.model.Student;
import javafx.collections.ObservableList;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service handling Attendance operations, class register marking, and attendance metrics.
 */
public class AttendanceService {
    private final DataService dataService;

    public AttendanceService() {
        this.dataService = DataService.getInstance();
    }

    public ObservableList<AttendanceRecord> getAllAttendance() {
        return dataService.getAttendance();
    }

    public void markOrUpdateAttendance(String studentId, String subjectOrClass, LocalDate date, String status) {
        Optional<AttendanceRecord> existing = dataService.getAttendance().stream()
                .filter(a -> a.getStudentId().equalsIgnoreCase(studentId)
                        && a.getAttendanceDate().equals(date)
                        && a.getSubjectId().equalsIgnoreCase(subjectOrClass))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setStatus(status);
        } else {
            String newId = "ATT-" + (dataService.getAttendance().size() + 1);
            dataService.getAttendance().add(new AttendanceRecord(newId, studentId, subjectOrClass, date, status));
        }
        dataService.refreshAlerts();
    }

    public void saveBulkAttendance(List<AttendanceRecord> records) {
        for (AttendanceRecord rec : records) {
            markOrUpdateAttendance(rec.getStudentId(), rec.getSubjectId(), rec.getAttendanceDate(), rec.getStatus());
        }
    }

    public boolean deleteAttendance(String attendanceId) {
        boolean removed = dataService.getAttendance().removeIf(a -> a.getAttendanceId().equalsIgnoreCase(attendanceId));
        if (removed) {
            dataService.refreshAlerts();
        }
        return removed;
    }
}
