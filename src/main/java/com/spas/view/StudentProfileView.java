package com.spas.view;

import com.spas.model.MarkRecord;
import com.spas.model.Student;
import com.spas.model.Subject;
import com.spas.service.DataService;
import com.spas.service.ReportService;
import com.spas.util.AlertUtils;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.chart.CategoryAxis;
import javafx.scene.chart.LineChart;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.FileChooser;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Detailed 360-degree Student Academic Profile View.
 */
public class StudentProfileView extends ScrollPane {
    private final DataService dataService;
    private final ReportService reportService;
    private final ComboBox<Student> studentSelector = new ComboBox<>();
    private final VBox profileContent = new VBox(20);

    private final Label nameLabel = new Label();
    private final Label idClassLabel = new Label();
    private final Label avgLabel = new Label();
    private final Label attLabel = new Label();
    private final Label bestSubjectLabel = new Label();
    private final Label weakSubjectLabel = new Label();
    private final Label alertBadgeLabel = new Label();

    private LineChart<String, Number> trendChart;
    private final TableView<MarkRecord> historyTable = new TableView<>();

    public StudentProfileView() {
        this.dataService = DataService.getInstance();
        this.reportService = new ReportService();

        this.setFitToWidth(true);
        this.setStyle("-fx-background: #f8fafc; -fx-background-color: transparent;");

        VBox root = new VBox(16);
        root.setPadding(new Insets(10, 20, 30, 20));

        // Selector Bar
        HBox topBar = new HBox(12);
        topBar.setAlignment(Pos.CENTER_LEFT);

        Label lbl = new Label("Select Student:");
        lbl.setFont(Font.font("Segoe UI", FontWeight.BOLD, 13));

        studentSelector.setItems(dataService.getStudents());
        studentSelector.setPrefWidth(280);
        studentSelector.setOnAction(e -> loadProfile(studentSelector.getValue()));

        Region sp = new Region();
        HBox.setHgrow(sp, Priority.ALWAYS);

        Button btnExportText = new Button("📄 Export Text Report");
        btnExportText.setStyle("-fx-background-color: #0f172a; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btnExportText.setOnAction(e -> exportCurrentStudentReport());

        topBar.getChildren().addAll(lbl, studentSelector, sp, btnExportText);
        root.getChildren().addAll(topBar, profileContent);

        setupProfileContent();
        this.setContent(root);

        if (!dataService.getStudents().isEmpty()) {
            studentSelector.setValue(dataService.getStudents().get(0));
            loadProfile(dataService.getStudents().get(0));
        }
    }

    public void selectStudent(Student student) {
        studentSelector.setValue(student);
        loadProfile(student);
    }

    private void setupProfileContent() {
        // Demographics Header Card
        HBox headerCard = new HBox(24);
        headerCard.setAlignment(Pos.CENTER_LEFT);
        headerCard.setPadding(new Insets(20));
        headerCard.setStyle("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8;");

        VBox infoBox = new VBox(4);
        nameLabel.setFont(Font.font("Segoe UI", FontWeight.BOLD, 22));
        nameLabel.setTextFill(Color.web("#0f172a"));

        idClassLabel.setFont(Font.font("Segoe UI", 13));
        idClassLabel.setTextFill(Color.web("#64748b"));

        infoBox.getChildren().addAll(nameLabel, idClassLabel);

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        // Metric blocks
        HBox metricsBox = new HBox(16);
        metricsBox.getChildren().addAll(
                createMiniKpi("Overall Average", avgLabel, "#2563eb"),
                createMiniKpi("Attendance Rate", attLabel, "#10b981"),
                createMiniKpi("Support Status", alertBadgeLabel, "#ef4444")
        );

        headerCard.getChildren().addAll(infoBox, spacer, metricsBox);

        // Middle Row: Strengths/Weaknesses and Trend Chart
        GridPane midGrid = new GridPane();
        midGrid.setHgap(20);
        midGrid.setVgap(20);

        ColumnConstraints c1 = new ColumnConstraints(); c1.setPercentWidth(40);
        ColumnConstraints c2 = new ColumnConstraints(); c2.setPercentWidth(60);
        midGrid.getColumnConstraints().addAll(c1, c2);

        VBox insightCard = new VBox(14);
        insightCard.setPadding(new Insets(16));
        insightCard.setStyle("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8;");

        Label insightTitle = new Label("Subject Strengths & Focus Areas");
        insightTitle.setFont(Font.font("Segoe UI", FontWeight.BOLD, 14));
        insightTitle.setTextFill(Color.web("#1e293b"));

        VBox bestBox = new VBox(4);
        Label bLbl = new Label("🌟 Strongest Subject:");
        bLbl.setFont(Font.font("Segoe UI", FontWeight.SEMI_BOLD, 12));
        bLbl.setTextFill(Color.web("#16a34a"));
        bestSubjectLabel.setFont(Font.font("Segoe UI", FontWeight.BOLD, 14));
        bestSubjectLabel.setTextFill(Color.web("#0f172a"));
        bestBox.getChildren().addAll(bLbl, bestSubjectLabel);

        VBox weakBox = new VBox(4);
        Label wLbl = new Label("🎯 Focus & Improvement Needed:");
        wLbl.setFont(Font.font("Segoe UI", FontWeight.SEMI_BOLD, 12));
        wLbl.setTextFill(Color.web("#dc2626"));
        weakSubjectLabel.setFont(Font.font("Segoe UI", FontWeight.BOLD, 14));
        weakSubjectLabel.setTextFill(Color.web("#0f172a"));
        weakBox.getChildren().addAll(wLbl, weakSubjectLabel);

        insightCard.getChildren().addAll(insightTitle, bestBox, new Separator(), weakBox);

        // Trend Chart
        CategoryAxis xAxis = new CategoryAxis();
        NumberAxis yAxis = new NumberAxis(0, 100, 20);
        yAxis.setLabel("Score %");
        trendChart = new LineChart<>(xAxis, yAxis);
        trendChart.setPrefHeight(240);
        trendChart.setLegendVisible(false);

        VBox chartCard = new VBox(10);
        chartCard.setPadding(new Insets(16));
        chartCard.setStyle("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8;");
        Label chartTitle = new Label("Chronological Performance Trend");
        chartTitle.setFont(Font.font("Segoe UI", FontWeight.BOLD, 14));
        chartTitle.setTextFill(Color.web("#1e293b"));
        chartCard.getChildren().addAll(chartTitle, trendChart);

        midGrid.add(insightCard, 0, 0);
        midGrid.add(chartCard, 1, 0);

        // Assessment History Table
        VBox tableCard = new VBox(10);
        tableCard.setPadding(new Insets(16));
        tableCard.setStyle("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8;");
        Label histTitle = new Label("Complete Assessment & Examination Record");
        histTitle.setFont(Font.font("Segoe UI", FontWeight.BOLD, 14));
        histTitle.setTextFill(Color.web("#1e293b"));

        setupHistoryTable();
        tableCard.getChildren().addAll(histTitle, historyTable);

        profileContent.getChildren().addAll(headerCard, midGrid, tableCard);
    }

    private VBox createMiniKpi(String label, Label valLabel, String color) {
        VBox box = new VBox(2);
        box.setAlignment(Pos.CENTER_RIGHT);
        Label l = new Label(label);
        l.setFont(Font.font("Segoe UI", 11));
        l.setTextFill(Color.web("#64748b"));

        valLabel.setFont(Font.font("Segoe UI", FontWeight.BOLD, 18));
        valLabel.setTextFill(Color.web(color));
        box.getChildren().addAll(l, valLabel);
        return box;
    }

    private void setupHistoryTable() {
        historyTable.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        historyTable.setPrefHeight(220);

        TableColumn<MarkRecord, String> cDate = new TableColumn<>("Date");
        cDate.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getAssessmentDate().toString()));

        TableColumn<MarkRecord, String> cSub = new TableColumn<>("Subject");
        cSub.setCellValueFactory(d -> {
            Subject s = dataService.getSubjects().stream().filter(sub -> sub.getSubjectId().equalsIgnoreCase(d.getValue().getSubjectId())).findFirst().orElse(null);
            return new SimpleStringProperty(s != null ? s.getSubjectName() : d.getValue().getSubjectId());
        });

        TableColumn<MarkRecord, String> cName = new TableColumn<>("Assessment Name");
        cName.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getAssessmentName()));

        TableColumn<MarkRecord, String> cScore = new TableColumn<>("Marks");
        cScore.setCellValueFactory(d -> new SimpleStringProperty(String.format("%.1f / %.0f", d.getValue().getMarksObtained(), d.getValue().getMaxMarks())));

        TableColumn<MarkRecord, String> cPct = new TableColumn<>("Percentage");
        cPct.setCellValueFactory(d -> new SimpleStringProperty(String.format("%.1f%%", d.getValue().getPercentage())));

        TableColumn<MarkRecord, String> cRes = new TableColumn<>("Result");
        cRes.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getPercentage() >= dataService.getSettings().getPassingPercentage() ? "PASS" : "FAIL"));

        historyTable.getColumns().addAll(cDate, cSub, cName, cScore, cPct, cRes);
    }

    private void loadProfile(Student s) {
        if (s == null) return;
        nameLabel.setText(s.getFullName());
        idClassLabel.setText(String.format("Student ID: %s • Class/Dept: %s (Sec %s) • Year: %s",
                s.getStudentId(), s.getDepartment(), s.getSection(), s.getAcademicYear()));

        double avg = dataService.calculateStudentOverallAverage(s.getStudentId());
        double att = dataService.calculateStudentAttendancePercentage(s.getStudentId());
        avgLabel.setText(String.format("%.1f%%", avg));
        attLabel.setText(String.format("%.1f%%", att));

        if (avg < dataService.getSettings().getAcademicSupportScoreThreshold() || att < dataService.getSettings().getAttendanceWarningThreshold()) {
            alertBadgeLabel.setText("SUPPORT ACTIVE");
            alertBadgeLabel.setTextFill(Color.web("#ef4444"));
        } else {
            alertBadgeLabel.setText("GOOD STANDING");
            alertBadgeLabel.setTextFill(Color.web("#10b981"));
        }

        // Assessment History
        List<MarkRecord> records = dataService.getMarks().stream()
                .filter(m -> m.getStudentId().equalsIgnoreCase(s.getStudentId()))
                .sorted(Comparator.comparing(MarkRecord::getAssessmentDate))
                .collect(Collectors.toList());
        historyTable.setItems(FXCollections.observableArrayList(records));

        // Trend Chart
        trendChart.getData().clear();
        XYChart.Series<String, Number> series = new XYChart.Series<>();
        series.setName("Score %");
        for (MarkRecord m : records) {
            series.getData().add(new XYChart.Data<>(m.getAssessmentName(), m.getPercentage()));
        }
        trendChart.getData().add(series);

        // Subject breakdown: Find strongest and weakest
        Map<String, List<Double>> subScores = new HashMap<>();
        for (MarkRecord m : records) {
            subScores.computeIfAbsent(m.getSubjectId(), k -> new ArrayList<>()).add(m.getPercentage());
        }

        String bestSub = "N/A";
        double maxSubAvg = -1;
        String weakSub = "N/A";
        double minSubAvg = 999;

        for (Map.Entry<String, List<Double>> entry : subScores.entrySet()) {
            double mean = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0);
            Subject subj = dataService.getSubjects().stream().filter(sub -> sub.getSubjectId().equalsIgnoreCase(entry.getKey())).findFirst().orElse(null);
            String label = subj != null ? subj.getSubjectName() : entry.getKey();

            if (mean > maxSubAvg) {
                maxSubAvg = mean;
                bestSub = String.format("%s (%.1f%% avg)", label, mean);
            }
            if (mean < minSubAvg) {
                minSubAvg = mean;
                weakSub = String.format("%s (%.1f%% avg)", label, mean);
            }
        }

        bestSubjectLabel.setText(bestSub);
        weakSubjectLabel.setText(weakSub);
    }

    private void exportCurrentStudentReport() {
        Student s = studentSelector.getValue();
        if (s == null) return;

        String reportText = reportService.generateStudentTextReport(s.getStudentId());

        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Student Report Preview");
        alert.setHeaderText("Report for " + s.getFullName() + " (" + s.getStudentId() + ")");

        TextArea area = new TextArea(reportText);
        area.setEditable(false);
        area.setWrapText(false);
        area.setPrefSize(550, 320);
        area.setStyle("-fx-font-family: monospace; -fx-font-size: 11px;");

        alert.getDialogPane().setContent(area);
        alert.showAndWait();
    }
}
