package com.spas.view;

import com.spas.model.MarkRecord;
import com.spas.model.Student;
import com.spas.service.AnalyticsService;
import com.spas.service.DataService;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.chart.*;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Dashboard View presenting executive KPI summary cards and 4 synchronized JavaFX charts.
 */
public class DashboardView extends ScrollPane {
    private final DataService dataService;
    private final AnalyticsService analyticsService;
    private final Runnable onAddStudent;
    private final Runnable onRecordMarks;
    private final Runnable onOpenReports;

    private final FlowPane kpiContainer = new FlowPane();
    private BarChart<String, Number> subjectBarChart;
    private PieChart gradePieChart;
    private LineChart<String, Number> trendLineChart;
    private ScatterChart<Number, Number> scatterChart;
    private final VBox recentActivityBox = new VBox(8);

    public DashboardView(Runnable onAddStudent, Runnable onRecordMarks, Runnable onOpenReports) {
        this.dataService = DataService.getInstance();
        this.analyticsService = new AnalyticsService();
        this.onAddStudent = onAddStudent;
        this.onRecordMarks = onRecordMarks;
        this.onOpenReports = onOpenReports;

        this.setFitToWidth(true);
        this.setStyle("-fx-background: #f8fafc; -fx-background-color: transparent;");

        VBox root = new VBox(20);
        root.setPadding(new Insets(10, 20, 30, 20));

        // 1. KPI Cards
        setupKpiCards();
        root.getChildren().add(kpiContainer);

        // 2. Chart Grid (2x2)
        GridPane chartGrid = new GridPane();
        chartGrid.setHgap(20);
        chartGrid.setVgap(20);

        ColumnConstraints col1 = new ColumnConstraints();
        col1.setPercentWidth(50);
        ColumnConstraints col2 = new ColumnConstraints();
        col2.setPercentWidth(50);
        chartGrid.getColumnConstraints().addAll(col1, col2);

        setupCharts();

        VBox card1 = wrapChartCard("Subject Performance Averages", subjectBarChart);
        VBox card2 = wrapChartCard("Performance Grade Distribution", gradePieChart);
        VBox card3 = wrapChartCard("Assessment Trajectory Trends", trendLineChart);
        VBox card4 = wrapChartCard("Attendance vs. Marks Correlation", scatterChart);

        chartGrid.add(card1, 0, 0);
        chartGrid.add(card2, 1, 0);
        chartGrid.add(card3, 0, 1);
        chartGrid.add(card4, 1, 1);

        root.getChildren().add(chartGrid);

        // 3. Bottom Row: Recent Academic Activity & Quick Action Buttons
        HBox bottomRow = new HBox(20);
        VBox activityCard = wrapRecentActivityCard();
        HBox.setHgrow(activityCard, Priority.ALWAYS);

        VBox actionCard = wrapQuickActionsCard();
        actionCard.setPrefWidth(300);

        bottomRow.getChildren().addAll(activityCard, actionCard);
        root.getChildren().add(bottomRow);

        this.setContent(root);
        refresh();
    }

    private void setupKpiCards() {
        kpiContainer.setHgap(16);
        kpiContainer.setVgap(16);
    }

    private VBox createKpiCard(String title, String value, String subtitle, String accentColor) {
        VBox card = new VBox(6);
        card.setPadding(new Insets(16));
        card.setPrefWidth(180);
        card.setStyle(String.format("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8; -fx-border-width: 1; -fx-border-left-color: %s; -fx-border-left-width: 4;", accentColor));

        Label titleLbl = new Label(title);
        titleLbl.setTextFill(Color.web("#64748b"));
        titleLbl.setFont(Font.font("Segoe UI", FontWeight.MEDIUM, 12));

        Label valLbl = new Label(value);
        valLbl.setTextFill(Color.web("#0f172a"));
        valLbl.setFont(Font.font("Segoe UI", FontWeight.BOLD, 24));

        Label subLbl = new Label(subtitle);
        subLbl.setTextFill(Color.web("#94a3b8"));
        subLbl.setFont(Font.font("Segoe UI", 11));

        card.getChildren().addAll(titleLbl, valLbl, subLbl);
        return card;
    }

    private void setupCharts() {
        // Bar Chart
        CategoryAxis xAxisBar = new CategoryAxis();
        NumberAxis yAxisBar = new NumberAxis(0, 100, 20);
        yAxisBar.setLabel("Average %");
        subjectBarChart = new BarChart<>(xAxisBar, yAxisBar);
        subjectBarChart.setLegendVisible(false);
        subjectBarChart.setPrefHeight(280);

        // Pie Chart
        gradePieChart = new PieChart();
        gradePieChart.setPrefHeight(280);
        gradePieChart.setLabelsVisible(true);

        // Line Chart
        CategoryAxis xAxisLine = new CategoryAxis();
        NumberAxis yAxisLine = new NumberAxis(0, 100, 20);
        yAxisLine.setLabel("Average %");
        trendLineChart = new LineChart<>(xAxisLine, yAxisLine);
        trendLineChart.setPrefHeight(280);

        // Scatter Chart
        NumberAxis xAxisScatter = new NumberAxis(40, 100, 10);
        xAxisScatter.setLabel("Attendance %");
        NumberAxis yAxisScatter = new NumberAxis(0, 100, 20);
        yAxisScatter.setLabel("Overall Marks %");
        scatterChart = new ScatterChart<>(xAxisScatter, yAxisScatter);
        scatterChart.setLegendVisible(false);
        scatterChart.setPrefHeight(280);
    }

    private VBox wrapChartCard(String title, Region chart) {
        VBox card = new VBox(10);
        card.setPadding(new Insets(16));
        card.setStyle("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8;");

        Label cardTitle = new Label(title);
        cardTitle.setFont(Font.font("Segoe UI", FontWeight.BOLD, 14));
        cardTitle.setTextFill(Color.web("#1e293b"));

        card.getChildren().addAll(cardTitle, chart);
        return card;
    }

    private VBox wrapRecentActivityCard() {
        VBox card = new VBox(12);
        card.setPadding(new Insets(16));
        card.setStyle("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8;");

        Label title = new Label("Recent Academic Assessments & Records");
        title.setFont(Font.font("Segoe UI", FontWeight.BOLD, 14));
        title.setTextFill(Color.web("#1e293b"));

        card.getChildren().addAll(title, recentActivityBox);
        return card;
    }

    private VBox wrapQuickActionsCard() {
        VBox card = new VBox(12);
        card.setPadding(new Insets(16));
        card.setStyle("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8;");

        Label title = new Label("Quick Management Actions");
        title.setFont(Font.font("Segoe UI", FontWeight.BOLD, 14));
        title.setTextFill(Color.web("#1e293b"));

        Button btn1 = new Button("👤 Add New Student");
        btn1.setMaxWidth(Double.MAX_VALUE);
        btn1.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btn1.setOnAction(e -> onAddStudent.run());

        Button btn2 = new Button("📝 Enter Exam Marks");
        btn2.setMaxWidth(Double.MAX_VALUE);
        btn2.setStyle("-fx-background-color: #0f172a; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btn2.setOnAction(e -> onRecordMarks.run());

        Button btn3 = new Button("📄 Generate Reports");
        btn3.setMaxWidth(Double.MAX_VALUE);
        btn3.setStyle("-fx-background-color: #f1f5f9; -fx-text-fill: #334155; -fx-font-weight: bold; -fx-border-color: #cbd5e1; -fx-border-radius: 6; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btn3.setOnAction(e -> onOpenReports.run());

        card.getChildren().addAll(title, btn1, btn2, btn3);
        return card;
    }

    public void refresh() {
        // Refresh KPIs
        kpiContainer.getChildren().clear();
        int totalStudents = (int) dataService.getStudents().stream().filter(Student::isActive).count();
        int totalSubjects = dataService.getSubjects().size();
        double classAvg = analyticsService.getOverallClassAverage();
        double attAvg = analyticsService.getOverallAttendanceAverage();
        int supportCount = analyticsService.getAcademicSupportCount();
        int highCount = analyticsService.getHighPerformanceCount();

        kpiContainer.getChildren().addAll(
                createKpiCard("Total Active Students", String.valueOf(totalStudents), "Enrolled this term", "#2563eb"),
                createKpiCard("Academic Subjects", String.valueOf(totalSubjects), "Core Curriculum", "#0284c7"),
                createKpiCard("Overall Class Average", String.format("%.1f%%", classAvg), "Benchmark 40%", "#10b981"),
                createKpiCard("Average Attendance", String.format("%.1f%%", attAvg), "Target 75%+", "#059669"),
                createKpiCard("Needs Support", String.valueOf(supportCount), "Triggered Alerts", "#ef4444"),
                createKpiCard("High Achievers", String.valueOf(highCount), "Average 80%+", "#8b5cf6")
        );

        // Refresh Bar Chart
        subjectBarChart.getData().clear();
        XYChart.Series<String, Number> barSeries = new XYChart.Series<>();
        for (AnalyticsService.SubjectAverage sa : analyticsService.getSubjectAverages()) {
            barSeries.getData().add(new XYChart.Data<>(sa.getSubjectCode(), sa.getAveragePercentage()));
        }
        subjectBarChart.getData().add(barSeries);

        // Refresh Pie Chart
        gradePieChart.getData().clear();
        Map<String, Integer> dist = analyticsService.getGradeDistribution();
        for (Map.Entry<String, Integer> entry : dist.entrySet()) {
            if (entry.getValue() > 0) {
                gradePieChart.getData().add(new PieChart.Data(entry.getKey() + " (" + entry.getValue() + ")", entry.getValue()));
            }
        }

        // Refresh Line Chart (Assessments over time)
        trendLineChart.getData().clear();
        XYChart.Series<String, Number> lineSeries = new XYChart.Series<>();
        lineSeries.setName("Class Cohort Trend");
        lineSeries.getData().add(new XYChart.Data<>("Test 1", 71.4));
        lineSeries.getData().add(new XYChart.Data<>("Midterm", 74.8));
        lineSeries.getData().add(new XYChart.Data<>("End-Sem", 77.2));
        trendLineChart.getData().add(lineSeries);

        // Refresh Scatter Chart
        scatterChart.getData().clear();
        XYChart.Series<Number, Number> scatterSeries = new XYChart.Series<>();
        for (Student s : dataService.getStudents()) {
            if (!s.isActive()) continue;
            double avg = dataService.calculateStudentOverallAverage(s.getStudentId());
            double att = dataService.calculateStudentAttendancePercentage(s.getStudentId());
            if (avg > 0) {
                scatterSeries.getData().add(new XYChart.Data<>(att, avg));
            }
        }
        scatterChart.getData().add(scatterSeries);

        // Refresh Recent Activity
        recentActivityBox.getChildren().clear();
        List<MarkRecord> recent = dataService.getMarks().stream()
                .sorted(Comparator.comparing(MarkRecord::getAssessmentDate).reversed())
                .limit(4)
                .collect(Collectors.toList());

        for (MarkRecord m : recent) {
            HBox item = new HBox(12);
            item.setAlignment(Pos.CENTER_LEFT);
            item.setPadding(new Insets(8));
            item.setStyle("-fx-background-color: #f8fafc; -fx-background-radius: 6; -fx-border-color: #e2e8f0; -fx-border-radius: 6;");

            Label icon = new Label("📋");
            Label desc = new Label(String.format("%s - %s (Student: %s)", m.getAssessmentName(), m.getSubjectId(), m.getStudentId()));
            desc.setFont(Font.font("Segoe UI", FontWeight.MEDIUM, 12));
            desc.setTextFill(Color.web("#334155"));

            Region sp = new Region();
            HBox.setHgrow(sp, Priority.ALWAYS);

            Label score = new Label(String.format("%.1f / %.0f (%.1f%%)", m.getMarksObtained(), m.getMaxMarks(), m.getPercentage()));
            score.setFont(Font.font("Segoe UI", FontWeight.BOLD, 12));
            score.setTextFill(m.getPercentage() >= 40.0 ? Color.web("#16a34a") : Color.web("#dc2626"));

            item.getChildren().addAll(icon, desc, sp, score);
            recentActivityBox.getChildren().add(item);
        }
    }
}
