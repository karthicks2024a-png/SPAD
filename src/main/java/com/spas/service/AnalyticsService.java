package com.spas.service;

import com.spas.model.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service providing analytical metrics, statistical aggregations, ranking, and trajectory logic.
 */
public class AnalyticsService {
    private final DataService dataService;

    public AnalyticsService() {
        this.dataService = DataService.getInstance();
    }

    public static class StudentRanking {
        private final int rank;
        private final Student student;
        private final double overallAverage;
        private final double attendancePercentage;

        public StudentRanking(int rank, Student student, double overallAverage, double attendancePercentage) {
            this.rank = rank;
            this.student = student;
            this.overallAverage = overallAverage;
            this.attendancePercentage = attendancePercentage;
        }

        public int getRank() { return rank; }
        public Student getStudent() { return student; }
        public double getOverallAverage() { return overallAverage; }
        public double getAttendancePercentage() { return attendancePercentage; }
    }

    public static class SubjectAverage {
        private final String subjectId;
        private final String subjectName;
        private final String subjectCode;
        private final double averagePercentage;
        private final int totalAssessments;

        public SubjectAverage(String subjectId, String subjectName, String subjectCode, double averagePercentage, int totalAssessments) {
            this.subjectId = subjectId;
            this.subjectName = subjectName;
            this.subjectCode = subjectCode;
            this.averagePercentage = averagePercentage;
            this.totalAssessments = totalAssessments;
        }

        public String getSubjectId() { return subjectId; }
        public String getSubjectName() { return subjectName; }
        public String getSubjectCode() { return subjectCode; }
        public double getAveragePercentage() { return averagePercentage; }
        public int getTotalAssessments() { return totalAssessments; }
    }

    public static class StudentTrajectory {
        private final Student student;
        private final double firstScore;
        private final double latestScore;
        private final double difference;
        private final String status; // "Improving", "Declining", "Stable"

        public StudentTrajectory(Student student, double firstScore, double latestScore, double difference, String status) {
            this.student = student;
            this.firstScore = firstScore;
            this.latestScore = latestScore;
            this.difference = difference;
            this.status = status;
        }

        public Student getStudent() { return student; }
        public double getFirstScore() { return firstScore; }
        public double getLatestScore() { return latestScore; }
        public double getDifference() { return difference; }
        public String getStatus() { return status; }
    }

    /**
     * Calculates the overall class average percentage across all active students.
     */
    public double getOverallClassAverage() {
        List<Student> active = dataService.getStudents().stream().filter(Student::isActive).collect(Collectors.toList());
        if (active.isEmpty()) return 0.0;
        double sum = 0.0;
        int count = 0;
        for (Student s : active) {
            double avg = dataService.calculateStudentOverallAverage(s.getStudentId());
            if (avg > 0) {
                sum += avg;
                count++;
            }
        }
        if (count == 0) return 0.0;
        return Math.round((sum / count) * 10.0) / 10.0;
    }

    /**
     * Calculates overall attendance average percentage.
     */
    public double getOverallAttendanceAverage() {
        List<Student> active = dataService.getStudents().stream().filter(Student::isActive).collect(Collectors.toList());
        if (active.isEmpty()) return 0.0;
        double sum = 0.0;
        for (Student s : active) {
            sum += dataService.calculateStudentAttendancePercentage(s.getStudentId());
        }
        return Math.round((sum / active.size()) * 10.0) / 10.0;
    }

    /**
     * Counts active students needing academic support.
     */
    public int getAcademicSupportCount() {
        double threshold = dataService.getSettings().getAcademicSupportScoreThreshold();
        return (int) dataService.getStudents().stream()
                .filter(Student::isActive)
                .filter(s -> dataService.calculateStudentOverallAverage(s.getStudentId()) > 0
                        && dataService.calculateStudentOverallAverage(s.getStudentId()) < threshold)
                .count();
    }

    /**
     * Counts active students with high performance.
     */
    public int getHighPerformanceCount() {
        double threshold = dataService.getSettings().getHighPerformanceThreshold();
        return (int) dataService.getStudents().stream()
                .filter(Student::isActive)
                .filter(s -> dataService.calculateStudentOverallAverage(s.getStudentId()) >= threshold)
                .count();
    }

    /**
     * Calculates subject-wise averages.
     */
    public List<SubjectAverage> getSubjectAverages() {
        List<SubjectAverage> list = new ArrayList<>();
        for (Subject sub : dataService.getSubjects()) {
            List<MarkRecord> subMarks = dataService.getMarks().stream()
                    .filter(m -> m.getSubjectId().equalsIgnoreCase(sub.getSubjectId()))
                    .collect(Collectors.toList());
            if (subMarks.isEmpty()) {
                list.add(new SubjectAverage(sub.getSubjectId(), sub.getSubjectName(), sub.getSubjectCode(), 0.0, 0));
            } else {
                double sum = subMarks.stream().mapToDouble(MarkRecord::getPercentage).sum();
                double avg = Math.round((sum / subMarks.size()) * 10.0) / 10.0;
                list.add(new SubjectAverage(sub.getSubjectId(), sub.getSubjectName(), sub.getSubjectCode(), avg, subMarks.size()));
            }
        }
        return list;
    }

    /**
     * Calculates Grade Distribution across all active students:
     * A: >= 85%
     * B: 70% - 84.9%
     * C: 55% - 69.9%
     * D: 40% - 54.9%
     * F: < 40%
     */
    public Map<String, Integer> getGradeDistribution() {
        Map<String, Integer> dist = new LinkedHashMap<>();
        dist.put("Grade A (85%+)", 0);
        dist.put("Grade B (70-84%)", 0);
        dist.put("Grade C (55-69%)", 0);
        dist.put("Grade D (40-54%)", 0);
        dist.put("Grade F (<40%)", 0);

        for (Student s : dataService.getStudents()) {
            if (!s.isActive()) continue;
            double avg = dataService.calculateStudentOverallAverage(s.getStudentId());
            if (avg <= 0) continue;
            if (avg >= 85.0) dist.put("Grade A (85%+)", dist.get("Grade A (85%+)") + 1);
            else if (avg >= 70.0) dist.put("Grade B (70-84%)", dist.get("Grade B (70-84%)") + 1);
            else if (avg >= 55.0) dist.put("Grade C (55-69%)", dist.get("Grade C (55-69%)") + 1);
            else if (avg >= 40.0) dist.put("Grade D (40-54%)", dist.get("Grade D (40-54%)") + 1);
            else dist.put("Grade F (<40%)", dist.get("Grade F (<40%)") + 1);
        }
        return dist;
    }

    /**
     * Fair ranking calculation with tie handling (Rank 1, 1, 3...).
     */
    public List<StudentRanking> getRankings() {
        List<Student> active = dataService.getStudents().stream()
                .filter(Student::isActive)
                .collect(Collectors.toList());

        // Sort descending by overall average
        active.sort((s1, s2) -> Double.compare(
                dataService.calculateStudentOverallAverage(s2.getStudentId()),
                dataService.calculateStudentOverallAverage(s1.getStudentId())
        ));

        List<StudentRanking> rankings = new ArrayList<>();
        int currentRank = 1;
        for (int i = 0; i < active.size(); i++) {
            Student s = active.get(i);
            double avg = dataService.calculateStudentOverallAverage(s.getStudentId());
            double att = dataService.calculateStudentAttendancePercentage(s.getStudentId());

            if (i > 0) {
                double prevAvg = dataService.calculateStudentOverallAverage(active.get(i - 1).getStudentId());
                if (Math.abs(prevAvg - avg) > 0.001) {
                    currentRank = i + 1;
                }
            }
            rankings.add(new StudentRanking(currentRank, s, avg, att));
        }
        return rankings;
    }

    /**
     * Trajectory detection for improving and declining students between earliest and latest exams.
     */
    public List<StudentTrajectory> getStudentTrajectories() {
        List<StudentTrajectory> list = new ArrayList<>();
        for (Student s : dataService.getStudents()) {
            if (!s.isActive()) continue;
            List<MarkRecord> recs = dataService.getMarks().stream()
                    .filter(m -> m.getStudentId().equalsIgnoreCase(s.getStudentId()))
                    .sorted(Comparator.comparing(MarkRecord::getAssessmentDate))
                    .collect(Collectors.toList());
            if (recs.size() < 2) continue;

            double first = recs.get(0).getPercentage();
            double latest = recs.get(recs.size() - 1).getPercentage();
            double diff = Math.round((latest - first) * 10.0) / 10.0;
            String status = "Stable";
            if (diff >= 8.0) status = "Improving";
            else if (diff <= -8.0) status = "Declining";

            list.add(new StudentTrajectory(s, first, latest, diff, status));
        }
        return list;
    }
}
