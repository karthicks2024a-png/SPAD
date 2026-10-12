package com.spas.controller;

import com.spas.model.AttendanceRecord;
import com.spas.service.AttendanceService;
import javafx.collections.ObservableList;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller mediating daily class attendance register entries.
 */
public class AttendanceController {
    private final AttendanceService attendanceService;

    public AttendanceController() {
        this.attendanceService = new AttendanceService();
    }

    public ObservableList<AttendanceRecord> getAttendance() {
        return attendanceService.getAllAttendance();
    }

    public void markAttendance(String studentId, String subjectOrClass, LocalDate date, String status) {
        attendanceService.markOrUpdateAttendance(studentId, subjectOrClass, date, status);
    }

    public void saveBulk(List<AttendanceRecord> records) {
        attendanceService.saveBulkAttendance(records);
    }

    public boolean deleteAttendance(String attendanceId) {
        return attendanceService.deleteAttendance(attendanceId);
    }
}
