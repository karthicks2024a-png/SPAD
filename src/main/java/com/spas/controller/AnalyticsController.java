package com.spas.controller;

import com.spas.service.AnalyticsService;

import java.util.List;
import java.util.Map;

/**
 * Controller mediating statistical analyses, rankings, and cohort trends.
 */
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController() {
        this.analyticsService = new AnalyticsService();
    }

    public List<AnalyticsService.StudentRanking> getRankings() {
        return analyticsService.getRankings();
    }

    public List<AnalyticsService.SubjectAverage> getSubjectAverages() {
        return analyticsService.getSubjectAverages();
    }

    public List<AnalyticsService.StudentTrajectory> getStudentTrajectories() {
        return analyticsService.getStudentTrajectories();
    }

    public Map<String, Integer> getGradeDistribution() {
        return analyticsService.getGradeDistribution();
    }
}
