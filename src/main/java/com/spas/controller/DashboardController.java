package com.spas.controller;

import com.spas.service.AnalyticsService;
import com.spas.service.DataService;

import java.util.Map;

/**
 * Controller mediating dashboard statistics and chart aggregations.
 */
public class DashboardController {
    private final DataService dataService;
    private final AnalyticsService analyticsService;

    public DashboardController() {
        this.dataService = DataService.getInstance();
        this.analyticsService = new AnalyticsService();
    }

    public double getOverallClassAverage() {
        return analyticsService.getOverallClassAverage();
    }

    public double getOverallAttendanceAverage() {
        return analyticsService.getOverallAttendanceAverage();
    }

    public int getAcademicSupportCount() {
        return analyticsService.getAcademicSupportCount();
    }

    public int getHighPerformanceCount() {
        return analyticsService.getHighPerformanceCount();
    }

    public Map<String, Integer> getGradeDistribution() {
        return analyticsService.getGradeDistribution();
    }
}
