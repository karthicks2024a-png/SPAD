package com.spas.view;

import com.spas.model.AppSettings;
import com.spas.service.DataService;
import com.spas.util.AlertUtils;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

/**
 * Settings & Data Store Management View.
 */
public class SettingsView extends ScrollPane {
    private final DataService dataService;
    private final Runnable onDataReset;

    private final TextField passPctField = new TextField();
    private final TextField attWarnField = new TextField();
    private final TextField supportScoreField = new TextField();
    private final TextField highPerfField = new TextField();
    private final TextField yearField = new TextField();
    private final CheckBox includeExcusedCheck = new CheckBox("Count Excused Absences in Total Countable Sessions");

    public SettingsView(Runnable onDataReset) {
        this.dataService = DataService.getInstance();
        this.onDataReset = onDataReset;

        this.setFitToWidth(true);
        this.setStyle("-fx-background: #f8fafc; -fx-background-color: transparent;");

        VBox root = new VBox(20);
        root.setPadding(new Insets(10, 20, 30, 20));

        // 1. Threshold Configuration Card
        VBox threshCard = new VBox(16);
        threshCard.setPadding(new Insets(20));
        threshCard.setStyle("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8;");

        Label threshTitle = new Label("Institutional Academic Rules & Thresholds");
        threshTitle.setFont(Font.font("Segoe UI", FontWeight.BOLD, 15));
        threshTitle.setTextFill(Color.web("#0f172a"));

        GridPane grid = new GridPane();
        grid.setHgap(16);
        grid.setVgap(14);

        AppSettings s = dataService.getSettings();
        passPctField.setText(String.valueOf(s.getPassingPercentage()));
        attWarnField.setText(String.valueOf(s.getAttendanceWarningThreshold()));
        supportScoreField.setText(String.valueOf(s.getAcademicSupportScoreThreshold()));
        highPerfField.setText(String.valueOf(s.getHighPerformanceThreshold()));
        yearField.setText(s.getDefaultAcademicYear());
        includeExcusedCheck.setSelected(s.isIncludeExcusedInAttendance());

        grid.add(new Label("Standard Passing Percentage (%):"), 0, 0);
        grid.add(passPctField, 1, 0);
        grid.add(new Label("Attendance Warning Alert Threshold (%):"), 0, 1);
        grid.add(attWarnField, 1, 1);
        grid.add(new Label("Academic Support Score Cutoff (%):"), 0, 2);
        grid.add(supportScoreField, 1, 2);
        grid.add(new Label("High Achievement Benchmark (%):"), 0, 3);
        grid.add(highPerfField, 1, 3);
        grid.add(new Label("Default Academic Year:"), 0, 4);
        grid.add(yearField, 1, 4);
        grid.add(includeExcusedCheck, 0, 5, 2, 1);

        Button btnSaveSettings = new Button("💾 Apply Threshold Changes");
        btnSaveSettings.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btnSaveSettings.setOnAction(e -> handleSaveSettings());

        threshCard.getChildren().addAll(threshTitle, grid, btnSaveSettings);
        root.getChildren().add(threshCard);

        // 2. Data Store Reset & Maintenance Card
        VBox dataCard = new VBox(14);
        dataCard.setPadding(new Insets(20));
        dataCard.setStyle("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8;");

        Label dataTitle = new Label("Sample Data Store & Institutional Records");
        dataTitle.setFont(Font.font("Segoe UI", FontWeight.BOLD, 15));
        dataTitle.setTextFill(Color.web("#0f172a"));

        Label dataDesc = new Label("Reset the in-memory database back to the 24 default fictional academic records (across Section A & B, 6 Core Subjects, and 12 Attendance dates).");
        dataDesc.setFont(Font.font("Segoe UI", 12));
        dataDesc.setTextFill(Color.web("#64748b"));

        Button btnResetData = new Button("🔄 Reload Default Sample Dataset");
        btnResetData.setStyle("-fx-background-color: #dc2626; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btnResetData.setOnAction(e -> handleResetData());

        dataCard.getChildren().addAll(dataTitle, dataDesc, btnResetData);
        root.getChildren().add(dataCard);

        this.setContent(root);
    }

    private void handleSaveSettings() {
        try {
            double pass = Double.parseDouble(passPctField.getText().trim());
            double att = Double.parseDouble(attWarnField.getText().trim());
            double sup = Double.parseDouble(supportScoreField.getText().trim());
            double high = Double.parseDouble(highPerfField.getText().trim());
            String yr = yearField.getText().trim();
            boolean incExc = includeExcusedCheck.isSelected();

            AppSettings s = new AppSettings();
            s.setPassingPercentage(pass);
            s.setAttendanceWarningThreshold(att);
            s.setAcademicSupportScoreThreshold(sup);
            s.setHighPerformanceThreshold(high);
            s.setDefaultAcademicYear(yr);
            s.setIncludeExcusedInAttendance(incExc);

            dataService.setSettings(s);
            AlertUtils.showInfo("Settings Saved", "Rules Updated", "Academic rules and alert triggers recalculated successfully.");
        } catch (NumberFormatException ex) {
            AlertUtils.showError("Validation Error", "Invalid Number", "Please enter valid numeric percentages.");
        }
    }

    private void handleResetData() {
        boolean confirm = AlertUtils.showConfirmation(
                "Reset Sample Data",
                "Reload Original Records",
                "Are you sure you want to restore the initial sample dataset? Any unsaved edits will be reset."
        );
        if (confirm) {
            dataService.loadSampleData();
            if (onDataReset != null) {
                onDataReset.run();
            }
            AlertUtils.showInfo("Dataset Reset", "Sample Data Restored", "Reloaded 24 student records, 6 subjects, and marks.");
        }
    }
}
