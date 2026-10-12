package com.spas.controller;

import com.spas.service.ReportService;

/**
 * Controller mediating report compilation and file serialization.
 */
public class ReportsController {
    private final ReportService reportService;

    public ReportsController() {
        this.reportService = new ReportService();
    }

    public String getStudentReport(String studentId) {
        return reportService.generateStudentTextReport(studentId);
    }

    public String getClassReport() {
        return reportService.generateClassPerformanceReport();
    }

    public String exportClassCsv() {
        return reportService.exportClassPerformanceCsv();
    }

    public String exportSupportCsv() {
        return reportService.exportAcademicSupportCsv();
    }
}
