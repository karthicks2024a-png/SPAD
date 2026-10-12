package com.spas.view;

import com.spas.model.AttendanceRecord;
import com.spas.model.Student;
import com.spas.service.AttendanceService;
import com.spas.service.DataService;
import com.spas.util.AlertUtils;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Attendance Management View with Class Register Entry and Student Attendance Summaries.
 */
public class AttendanceView extends VBox {
    private final AttendanceService attendanceService;
    private final DataService dataService;
    private final TableView<StudentAttendanceRow> table = new TableView<>();
    private final DatePicker datePicker = new DatePicker(LocalDate.now());
    private final ComboBox<String> sectionFilter = new ComboBox<>();
    private final Label summaryLabel = new Label();

    public static class StudentAttendanceRow {
        private final Student student;
        private String status; // "Present", "Absent", "Excused"
        private final double cumulativePercentage;

        public StudentAttendanceRow(Student student, String status, double cumulativePercentage) {
            this.student = student;
            this.status = status;
            this.cumulativePercentage = cumulativePercentage;
        }

        public Student getStudent() { return student; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public double getCumulativePercentage() { return cumulativePercentage; }
    }

    public AttendanceView() {
        this.attendanceService = new AttendanceService();
        this.dataService = DataService.getInstance();
        this.setSpacing(16);
        this.setPadding(new Insets(10, 16, 20, 16));

        // Toolbar
        HBox toolbar = new HBox(12);
        toolbar.setAlignment(Pos.CENTER_LEFT);

        Label dateLbl = new Label("Register Date:");
        dateLbl.setFont(Font.font("Segoe UI", FontWeight.BOLD, 12));

        datePicker.setStyle("-fx-background-radius: 6;");
        datePicker.setOnAction(e -> refreshTableData());

        sectionFilter.setItems(FXCollections.observableArrayList("All Sections", "Section A", "Section B"));
        sectionFilter.setValue("All Sections");
        sectionFilter.setOnAction(e -> refreshTableData());

        Button btnMarkAllPresent = new Button("✅ Mark All Present");
        btnMarkAllPresent.setStyle("-fx-background-color: #10b981; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 7 14; -fx-background-radius: 6; -fx-cursor: hand;");
        btnMarkAllPresent.setOnAction(e -> markAll("Present"));

        Button btnMarkAllAbsent = new Button("❌ Mark All Absent");
        btnMarkAllAbsent.setStyle("-fx-background-color: #ef4444; -fx-text-fill: white; -fx-padding: 7 14; -fx-background-radius: 6; -fx-cursor: hand;");
        btnMarkAllAbsent.setOnAction(e -> markAll("Absent"));

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Button btnSaveRegister = new Button("💾 Save Daily Register");
        btnSaveRegister.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 18; -fx-background-radius: 6; -fx-cursor: hand;");
        btnSaveRegister.setOnAction(e -> saveDailyRegister());

        toolbar.getChildren().addAll(dateLbl, datePicker, sectionFilter, btnMarkAllPresent, btnMarkAllAbsent, spacer, btnSaveRegister);

        // Summary Bar
        summaryLabel.setFont(Font.font("Segoe UI", FontWeight.SEMI_BOLD, 13));
        summaryLabel.setTextFill(Color.web("#334155"));

        // Setup Table
        setupTable();

        VBox.setVgrow(table, Priority.ALWAYS);
        this.getChildren().addAll(toolbar, summaryLabel, table);

        refreshTableData();
    }

    private void setupTable() {
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        table.setStyle("-fx-background-color: white; -fx-border-color: #e2e8f0; -fx-border-radius: 6;");

        TableColumn<StudentAttendanceRow, String> colId = new TableColumn<>("Student ID");
        colId.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getStudent().getStudentId()));
        colId.setPrefWidth(110);

        TableColumn<StudentAttendanceRow, String> colName = new TableColumn<>("Student Name");
        colName.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getStudent().getFullName()));
        colName.setPrefWidth(200);

        TableColumn<StudentAttendanceRow, String> colSec = new TableColumn<>("Section");
        colSec.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getStudent().getSection()));
        colSec.setPrefWidth(80);

        TableColumn<StudentAttendanceRow, String> colRate = new TableColumn<>("Overall Attendance %");
        colRate.setCellValueFactory(d -> new SimpleStringProperty(String.format("%.1f%%", d.getValue().getCumulativePercentage())));
        colRate.setPrefWidth(140);

        // Custom status toggle column: Present, Absent, Excused buttons
        TableColumn<StudentAttendanceRow, Void> colStatus = new TableColumn<>("Session Status on " + datePicker.getValue());
        colStatus.setPrefWidth(260);
        colStatus.setCellFactory(param -> new TableCell<>() {
            private final ToggleGroup group = new ToggleGroup();
            private final RadioButton rbP = new RadioButton("Present");
            private final RadioButton rbA = new RadioButton("Absent");
            private final RadioButton rbE = new RadioButton("Excused");
            private final HBox box = new HBox(12, rbP, rbA, rbE);

            {
                rbP.setToggleGroup(group);
                rbA.setToggleGroup(group);
                rbE.setToggleGroup(group);
                box.setAlignment(Pos.CENTER);

                rbP.setOnAction(e -> {
                    if (getTableRow() != null && getTableRow().getItem() != null) {
                        getTableRow().getItem().setStatus("Present");
                    }
                });
                rbA.setOnAction(e -> {
                    if (getTableRow() != null && getTableRow().getItem() != null) {
                        getTableRow().getItem().setStatus("Absent");
                    }
                });
                rbE.setOnAction(e -> {
                    if (getTableRow() != null && getTableRow().getItem() != null) {
                        getTableRow().getItem().setStatus("Excused");
                    }
                });
            }

            @Override
            protected void updateItem(Void item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || getTableRow() == null || getTableRow().getItem() == null) {
                    setGraphic(null);
                } else {
                    StudentAttendanceRow row = getTableRow().getItem();
                    if ("Present".equalsIgnoreCase(row.getStatus())) rbP.setSelected(true);
                    else if ("Absent".equalsIgnoreCase(row.getStatus())) rbA.setSelected(true);
                    else if ("Excused".equalsIgnoreCase(row.getStatus())) rbE.setSelected(true);
                    setGraphic(box);
                }
            }
        });

        table.getColumns().addAll(colId, colName, colSec, colRate, colStatus);

        // Highlight rows below warning threshold (e.g. 75%)
        table.setRowFactory(tv -> new TableRow<>() {
            @Override
            protected void updateItem(StudentAttendanceRow item, boolean empty) {
                super.updateItem(item, empty);
                if (item != null && !empty) {
                    double warningThreshold = dataService.getSettings().getAttendanceWarningThreshold();
                    if (item.getCumulativePercentage() < warningThreshold) {
                        setStyle("-fx-background-color: #fef2f2;"); // light red warning
                    } else {
                        setStyle("");
                    }
                } else {
                    setStyle("");
                }
            }
        });
    }

    private void markAll(String status) {
        for (StudentAttendanceRow row : table.getItems()) {
            row.setStatus(status);
        }
        table.refresh();
    }

    private void saveDailyRegister() {
        LocalDate date = datePicker.getValue();
        List<AttendanceRecord> batch = new ArrayList<>();
        int p = 0, a = 0, e = 0;

        for (StudentAttendanceRow row : table.getItems()) {
            batch.add(new AttendanceRecord(
                    "ATT-D-" + System.currentTimeMillis() + "-" + row.getStudent().getStudentId(),
                    row.getStudent().getStudentId(),
                    "CS-CORE",
                    date,
                    row.getStatus()
            ));
            if ("Present".equalsIgnoreCase(row.getStatus())) p++;
            else if ("Absent".equalsIgnoreCase(row.getStatus())) a++;
            else e++;
        }

        attendanceService.saveBulkAttendance(batch);
        AlertUtils.showInfo("Register Saved", "Daily Attendance Recorded",
                String.format("Saved register for %s:\n• Present: %d\n• Absent: %d\n• Excused: %d", date, p, a, e));
        refreshTableData();
    }

    private void refreshTableData() {
        LocalDate date = datePicker.getValue();
        String sec = sectionFilter.getValue();

        List<StudentAttendanceRow> rows = new ArrayList<>();
        int presentCount = 0;
        int absentCount = 0;
        int excusedCount = 0;

        for (Student s : dataService.getStudents()) {
            if (!s.isActive()) continue;
            if (sec != null && sec.equals("Section A") && !s.getSection().equalsIgnoreCase("A")) continue;
            if (sec != null && sec.equals("Section B") && !s.getSection().equalsIgnoreCase("B")) continue;

            // Find existing record for this date
            String status = "Present";
            for (AttendanceRecord ar : dataService.getAttendance()) {
                if (ar.getStudentId().equalsIgnoreCase(s.getStudentId()) && ar.getAttendanceDate().equals(date)) {
                    status = ar.getStatus();
                    break;
                }
            }

            if ("Present".equalsIgnoreCase(status)) presentCount++;
            else if ("Absent".equalsIgnoreCase(status)) absentCount++;
            else excusedCount++;

            double cumPct = dataService.calculateStudentAttendancePercentage(s.getStudentId());
            rows.add(new StudentAttendanceRow(s, status, cumPct));
        }

        table.setItems(FXCollections.observableArrayList(rows));
        summaryLabel.setText(String.format("Showing %d Students | Total Present: %d | Total Absent: %d | Excused: %d | Warning Threshold: %.0f%% (Highlighted in Red)",
                rows.size(), presentCount, absentCount, excusedCount, dataService.getSettings().getAttendanceWarningThreshold()));
    }
}
