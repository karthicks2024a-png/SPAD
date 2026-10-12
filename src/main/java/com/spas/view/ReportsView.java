package com.spas.view;

import com.spas.model.Student;
import com.spas.service.DataService;
import com.spas.service.ReportService;
import com.spas.util.AlertUtils;
import javafx.collections.FXCollections;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.FileChooser;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Report Center View providing multi-format report previews and CSV exports.
 */
public class ReportsView extends VBox {
    private final ReportService reportService;
    private final DataService dataService;

    private final ComboBox<String> reportTypeCombo = new ComboBox<>();
    private final ComboBox<Student> studentCombo = new ComboBox<>();
    private final TextArea previewArea = new TextArea();

    public ReportsView() {
        this.reportService = new ReportService();
        this.dataService = DataService.getInstance();
        this.setSpacing(16);
        this.setPadding(new Insets(10, 16, 20, 16));

        // Selection Bar
        HBox bar = new HBox(12);
        bar.setAlignment(Pos.CENTER_LEFT);

        reportTypeCombo.setItems(FXCollections.observableArrayList(
                "Class Performance Summary Report",
                "Individual Student Academic Report",
                "Academic Support & Intervention Report"
        ));
        reportTypeCombo.setValue("Class Performance Summary Report");
        reportTypeCombo.setOnAction(e -> {
            boolean isStudentReport = reportTypeCombo.getValue().contains("Individual");
            studentCombo.setVisible(isStudentReport);
            studentCombo.setManaged(isStudentReport);
            generatePreview();
        });

        studentCombo.setItems(dataService.getStudents());
        if (!dataService.getStudents().isEmpty()) studentCombo.setValue(dataService.getStudents().get(0));
        studentCombo.setVisible(false);
        studentCombo.setManaged(false);
        studentCombo.setOnAction(e -> generatePreview());

        Button btnGenerate = new Button("🔄 Refresh Preview");
        btnGenerate.setStyle("-fx-background-color: #0f172a; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 7 14; -fx-background-radius: 6; -fx-cursor: hand;");
        btnGenerate.setOnAction(e -> generatePreview());

        Region sp = new Region();
        HBox.setHgrow(sp, Priority.ALWAYS);

        Button btnExportCsv = new Button("📥 Export CSV File");
        btnExportCsv.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btnExportCsv.setOnAction(e -> handleExportCsv());

        Button btnExportTxt = new Button("📄 Save Text Report");
        btnExportTxt.setStyle("-fx-background-color: #334155; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btnExportTxt.setOnAction(e -> handleExportTxt());

        bar.getChildren().addAll(new Label("Report Type:"), reportTypeCombo, studentCombo, btnGenerate, sp, btnExportCsv, btnExportTxt);

        // Preview Area
        previewArea.setEditable(false);
        previewArea.setStyle("-fx-font-family: 'Consolas', 'Courier New', monospace; -fx-font-size: 12px; -fx-background-color: white; -fx-border-color: #cbd5e1; -fx-border-radius: 6;");
        VBox.setVgrow(previewArea, Priority.ALWAYS);

        this.getChildren().addAll(bar, previewArea);
        generatePreview();
    }

    private void generatePreview() {
        String type = reportTypeCombo.getValue();
        if (type == null) return;

        if (type.contains("Individual")) {
            Student s = studentCombo.getValue();
            if (s != null) {
                previewArea.setText(reportService.generateStudentTextReport(s.getStudentId()));
            } else {
                previewArea.setText("Please select a student to preview report.");
            }
        } else if (type.contains("Academic Support")) {
            previewArea.setText(reportService.exportAcademicSupportCsv());
        } else {
            previewArea.setText(reportService.generateClassPerformanceReport());
        }
    }

    private void handleExportCsv() {
        FileChooser fc = new FileChooser();
        fc.setTitle("Save CSV Report");
        fc.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV Files (*.csv)", "*.csv"));
        fc.setInitialFileName("SPAS_Academic_Report.csv");

        File file = fc.showSaveDialog(null);
        if (file != null) {
            try (FileWriter writer = new FileWriter(file)) {
                String type = reportTypeCombo.getValue();
                if (type.contains("Academic Support")) {
                    writer.write(reportService.exportAcademicSupportCsv());
                } else {
                    writer.write(reportService.exportClassPerformanceCsv());
                }
                AlertUtils.showInfo("Export Successful", "Report Saved", "Report saved to " + file.getAbsolutePath());
            } catch (IOException e) {
                AlertUtils.showError("Export Failed", "Error saving file", e.getMessage());
            }
        }
    }

    private void handleExportTxt() {
        FileChooser fc = new FileChooser();
        fc.setTitle("Save Text Report");
        fc.getExtensionFilters().add(new FileChooser.ExtensionFilter("Text Files (*.txt)", "*.txt"));
        fc.setInitialFileName("SPAS_Academic_Report.txt");

        File file = fc.showSaveDialog(null);
        if (file != null) {
            try (FileWriter writer = new FileWriter(file)) {
                writer.write(previewArea.getText());
                AlertUtils.showInfo("Export Successful", "Report Saved", "Report saved to " + file.getAbsolutePath());
            } catch (IOException e) {
                AlertUtils.showError("Export Failed", "Error saving file", e.getMessage());
            }
        }
    }
}
