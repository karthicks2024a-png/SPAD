package com.spas.view;

import com.spas.model.MarkRecord;
import com.spas.model.Student;
import com.spas.model.Subject;
import com.spas.service.DataService;
import com.spas.service.MarksService;
import com.spas.util.AlertUtils;
import javafx.beans.property.SimpleDoubleProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.Modality;
import javafx.stage.Stage;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Marks & Assessment Management View with TableView and Bulk Marks Entry.
 */
public class MarksView extends VBox {
    private final MarksService marksService;
    private final DataService dataService;
    private final TableView<MarkRecord> table = new TableView<>();
    private final FilteredList<MarkRecord> filteredData;
    private final TextField searchField = new TextField();
    private final ComboBox<String> subjectFilter = new ComboBox<>();
    private final ComboBox<String> typeFilter = new ComboBox<>();

    public MarksView() {
        this.marksService = new MarksService();
        this.dataService = DataService.getInstance();
        this.setSpacing(16);
        this.setPadding(new Insets(10, 16, 20, 16));

        // Toolbar
        HBox toolbar = new HBox(12);
        toolbar.setAlignment(Pos.CENTER_LEFT);

        searchField.setPromptText("🔍 Search student or assessment...");
        searchField.setPrefWidth(220);
        searchField.setStyle("-fx-background-radius: 6; -fx-padding: 7 10; -fx-border-color: #cbd5e1; -fx-border-radius: 6;");

        subjectFilter.setPromptText("Filter Subject");
        refreshSubjectFilterItems();
        subjectFilter.setStyle("-fx-background-radius: 6; -fx-border-color: #cbd5e1; -fx-border-radius: 6;");

        typeFilter.setPromptText("Assessment Type");
        typeFilter.setItems(FXCollections.observableArrayList("All Types", "Internal Test", "Midterm", "Assignment", "Final Examination"));
        typeFilter.setValue("All Types");
        typeFilter.setStyle("-fx-background-radius: 6; -fx-border-color: #cbd5e1; -fx-border-radius: 6;");

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Button btnBulk = new Button("⚡ Bulk Marks Entry");
        btnBulk.setStyle("-fx-background-color: #0f172a; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btnBulk.setOnAction(e -> openBulkMarksEntryDialog());

        Button btnAdd = new Button("+ Record Mark");
        btnAdd.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btnAdd.setOnAction(e -> showMarkDialog(null));

        Button btnEdit = new Button("✏️ Edit");
        btnEdit.setStyle("-fx-background-color: #334155; -fx-text-fill: white; -fx-padding: 8 14; -fx-background-radius: 6; -fx-cursor: hand;");
        btnEdit.setOnAction(e -> {
            MarkRecord sel = table.getSelectionModel().getSelectedItem();
            if (sel == null) {
                AlertUtils.showWarning("Selection Required", "No record selected", "Please select a mark record to edit.");
                return;
            }
            showMarkDialog(sel);
        });

        Button btnDelete = new Button("🗑️ Delete");
        btnDelete.setStyle("-fx-background-color: #fee2e2; -fx-text-fill: #b91c1c; -fx-font-weight: bold; -fx-padding: 8 14; -fx-background-radius: 6; -fx-cursor: hand;");
        btnDelete.setOnAction(e -> handleDelete());

        toolbar.getChildren().addAll(searchField, subjectFilter, typeFilter, spacer, btnBulk, btnAdd, btnEdit, btnDelete);

        // Table
        setupTable();

        filteredData = new FilteredList<>(marksService.getAllMarks(), p -> true);
        searchField.textProperty().addListener((obs, oldV, newV) -> updateFilter());
        subjectFilter.valueProperty().addListener((obs, oldV, newV) -> updateFilter());
        typeFilter.valueProperty().addListener((obs, oldV, newV) -> updateFilter());

        SortedList<MarkRecord> sorted = new SortedList<>(filteredData);
        sorted.comparatorProperty().bind(table.comparatorProperty());
        table.setItems(sorted);

        VBox.setVgrow(table, Priority.ALWAYS);
        this.getChildren().addAll(toolbar, table);
    }

    private void refreshSubjectFilterItems() {
        ObservableList<String> items = FXCollections.observableArrayList();
        items.add("All Subjects");
        for (Subject s : dataService.getSubjects()) {
            items.add(s.getSubjectId());
        }
        subjectFilter.setItems(items);
        subjectFilter.setValue("All Subjects");
    }

    private void setupTable() {
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        table.setStyle("-fx-background-color: white; -fx-border-color: #e2e8f0; -fx-border-radius: 6;");

        TableColumn<MarkRecord, String> colId = new TableColumn<>("Record ID");
        colId.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getAssessmentId()));
        colId.setPrefWidth(90);

        TableColumn<MarkRecord, String> colStu = new TableColumn<>("Student");
        colStu.setCellValueFactory(d -> {
            String sid = d.getValue().getStudentId();
            Student s = dataService.getStudents().stream().filter(st -> st.getStudentId().equalsIgnoreCase(sid)).findFirst().orElse(null);
            return new SimpleStringProperty(s != null ? s.getFullName() + " (" + sid + ")" : sid);
        });
        colStu.setPrefWidth(180);

        TableColumn<MarkRecord, String> colSub = new TableColumn<>("Subject");
        colSub.setCellValueFactory(d -> {
            String subId = d.getValue().getSubjectId();
            Subject sub = dataService.getSubjects().stream().filter(s -> s.getSubjectId().equalsIgnoreCase(subId)).findFirst().orElse(null);
            return new SimpleStringProperty(sub != null ? sub.getSubjectCode() : subId);
        });
        colSub.setPrefWidth(100);

        TableColumn<MarkRecord, String> colName = new TableColumn<>("Assessment Name");
        colName.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getAssessmentName()));
        colName.setPrefWidth(140);

        TableColumn<MarkRecord, String> colType = new TableColumn<>("Type");
        colType.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getAssessmentType()));
        colType.setPrefWidth(120);

        TableColumn<MarkRecord, String> colDate = new TableColumn<>("Date");
        colDate.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getAssessmentDate().toString()));
        colDate.setPrefWidth(100);

        TableColumn<MarkRecord, String> colScore = new TableColumn<>("Marks");
        colScore.setCellValueFactory(d -> new SimpleStringProperty(String.format("%.1f / %.0f", d.getValue().getMarksObtained(), d.getValue().getMaxMarks())));
        colScore.setPrefWidth(100);

        TableColumn<MarkRecord, String> colPct = new TableColumn<>("Percentage");
        colPct.setCellValueFactory(d -> new SimpleStringProperty(String.format("%.1f%%", d.getValue().getPercentage())));
        colPct.setPrefWidth(90);

        TableColumn<MarkRecord, String> colStatus = new TableColumn<>("Result");
        colStatus.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getPercentage() >= dataService.getSettings().getPassingPercentage() ? "PASS" : "FAIL"));
        colStatus.setPrefWidth(80);

        table.getColumns().addAll(colId, colStu, colSub, colName, colType, colDate, colScore, colPct, colStatus);
    }

    private void updateFilter() {
        String q = searchField.getText() == null ? "" : searchField.getText().trim().toLowerCase();
        String sub = subjectFilter.getValue();
        String type = typeFilter.getValue();

        filteredData.setPredicate(m -> {
            if (m == null) return false;
            boolean matchQ = q.isEmpty()
                    || m.getStudentId().toLowerCase().contains(q)
                    || m.getAssessmentName().toLowerCase().contains(q);

            boolean matchSub = sub == null || sub.equals("All Subjects")
                    || m.getSubjectId().equalsIgnoreCase(sub);

            boolean matchType = type == null || type.equals("All Types")
                    || m.getAssessmentType().equalsIgnoreCase(type);

            return matchQ && matchSub && matchType;
        });
    }

    private void handleDelete() {
        MarkRecord sel = table.getSelectionModel().getSelectedItem();
        if (sel == null) {
            AlertUtils.showWarning("Selection Required", "No record selected", "Please select a mark record to delete.");
            return;
        }

        boolean confirm = AlertUtils.showConfirmation("Confirm Deletion", "Delete Mark Record",
                "Are you sure you want to delete mark record " + sel.getAssessmentId() + "?");
        if (confirm) {
            marksService.deleteMark(sel.getAssessmentId());
        }
    }

    private void showMarkDialog(MarkRecord toEdit) {
        boolean isNew = (toEdit == null);
        Dialog<MarkRecord> dialog = new Dialog<>();
        dialog.setTitle(isNew ? "Record Assessment Marks" : "Edit Assessment Marks");
        dialog.setHeaderText(isNew ? "Select student, subject, and enter score" : "Modify score details");

        ButtonType saveType = new ButtonType("Save Mark", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(saveType, ButtonType.CANCEL);

        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(12);
        grid.setPadding(new Insets(20, 120, 10, 10));

        TextField idField = new TextField(isNew ? "MR-" + (dataService.getMarks().size() + 101) : toEdit.getAssessmentId());
        if (!isNew) idField.setDisable(true);

        ComboBox<Student> studentBox = new ComboBox<>(dataService.getStudents());
        if (!isNew) {
            dataService.getStudents().stream().filter(s -> s.getStudentId().equalsIgnoreCase(toEdit.getStudentId()))
                    .findFirst().ifPresent(studentBox::setValue);
            studentBox.setDisable(true);
        } else if (!dataService.getStudents().isEmpty()) {
            studentBox.setValue(dataService.getStudents().get(0));
        }

        ComboBox<Subject> subjectBox = new ComboBox<>(dataService.getSubjects());
        if (!isNew) {
            dataService.getSubjects().stream().filter(s -> s.getSubjectId().equalsIgnoreCase(toEdit.getSubjectId()))
                    .findFirst().ifPresent(subjectBox::setValue);
        } else if (!dataService.getSubjects().isEmpty()) {
            subjectBox.setValue(dataService.getSubjects().get(0));
        }

        TextField nameField = new TextField(isNew ? "Midterm Exam" : toEdit.getAssessmentName());
        ComboBox<String> typeBox = new ComboBox<>(FXCollections.observableArrayList("Internal Test", "Midterm", "Assignment", "Practical", "Final Examination"));
        typeBox.setValue(isNew ? "Midterm" : toEdit.getAssessmentType());

        DatePicker datePicker = new DatePicker(isNew ? LocalDate.now() : toEdit.getAssessmentDate());
        TextField obtainedField = new TextField(isNew ? "80" : String.valueOf(toEdit.getMarksObtained()));
        TextField maxField = new TextField(isNew ? "100" : String.valueOf(toEdit.getMaxMarks()));

        grid.add(new Label("Record ID:"), 0, 0); grid.add(idField, 1, 0);
        grid.add(new Label("Student:"), 0, 1); grid.add(studentBox, 1, 1);
        grid.add(new Label("Subject:"), 0, 2); grid.add(subjectBox, 1, 2);
        grid.add(new Label("Assessment Name:"), 0, 3); grid.add(nameField, 1, 3);
        grid.add(new Label("Assessment Type:"), 0, 4); grid.add(typeBox, 1, 4);
        grid.add(new Label("Date:"), 0, 5); grid.add(datePicker, 1, 5);
        grid.add(new Label("Marks Obtained:"), 0, 6); grid.add(obtainedField, 1, 6);
        grid.add(new Label("Maximum Marks:"), 0, 7); grid.add(maxField, 1, 7);

        dialog.getDialogPane().setContent(grid);

        dialog.setResultConverter(btn -> {
            if (btn == saveType) {
                try {
                    Student s = studentBox.getValue();
                    Subject sub = subjectBox.getValue();
                    if (s == null || sub == null) return null;
                    double obt = Double.parseDouble(obtainedField.getText().trim());
                    double mx = Double.parseDouble(maxField.getText().trim());
                    return new MarkRecord(idField.getText().trim(), s.getStudentId(), sub.getSubjectId(),
                            nameField.getText().trim(), typeBox.getValue(), datePicker.getValue(), obt, mx);
                } catch (NumberFormatException ex) {
                    return null;
                }
            }
            return null;
        });

        Optional<MarkRecord> res = dialog.showAndWait();
        res.ifPresent(record -> {
            try {
                if (isNew) {
                    marksService.addMark(record);
                    AlertUtils.showInfo("Success", "Mark Recorded", "Assessment mark saved successfully.");
                } else {
                    marksService.updateMark(record);
                    AlertUtils.showInfo("Success", "Mark Updated", "Assessment mark updated successfully.");
                }
            } catch (Exception ex) {
                AlertUtils.showError("Validation Error", "Could not save mark", ex.getMessage());
            }
        });
    }

    /**
     * Bulk marks entry modal for rapid grading across an entire class.
     */
    private void openBulkMarksEntryDialog() {
        Stage stage = new Stage();
        stage.initModality(Modality.APPLICATION_MODAL);
        stage.setTitle("Bulk Marks Entry - Class Grading Roster");

        VBox root = new VBox(14);
        root.setPadding(new Insets(16));
        root.setPrefSize(650, 500);

        HBox topForm = new HBox(12);
        topForm.setAlignment(Pos.CENTER_LEFT);

        ComboBox<Subject> subBox = new ComboBox<>(dataService.getSubjects());
        if (!dataService.getSubjects().isEmpty()) subBox.setValue(dataService.getSubjects().get(0));

        TextField examNameField = new TextField("Unit Test 2");
        TextField maxMarksField = new TextField("100");
        maxMarksField.setPrefWidth(70);

        topForm.getChildren().addAll(new Label("Subject:"), subBox, new Label("Exam Name:"), examNameField, new Label("Max Marks:"), maxMarksField);

        // Student Table with editable TextFields
        TableView<Student> bulkTable = new TableView<>(dataService.getStudents());
        bulkTable.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);

        TableColumn<Student, String> cId = new TableColumn<>("ID");
        cId.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getStudentId()));
        cId.setPrefWidth(90);

        TableColumn<Student, String> cName = new TableColumn<>("Student Name");
        cName.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getFullName()));
        cName.setPrefWidth(180);

        // Marks input column
        List<TextField> scoreInputs = new ArrayList<>();
        TableColumn<Student, Void> cScore = new TableColumn<>("Marks Obtained");
        cScore.setCellFactory(param -> new TableCell<>() {
            private final TextField tf = new TextField("75");
            {
                tf.setStyle("-fx-alignment: CENTER;");
            }
            @Override
            protected void updateItem(Void item, boolean empty) {
                super.updateItem(item, empty);
                if (empty) setGraphic(null);
                else {
                    setGraphic(tf);
                    if (!scoreInputs.contains(tf)) scoreInputs.add(tf);
                }
            }
        });

        bulkTable.getColumns().addAll(cId, cName, cScore);
        VBox.setVgrow(bulkTable, Priority.ALWAYS);

        HBox actions = new HBox(12);
        actions.setAlignment(Pos.CENTER_RIGHT);

        Button btnCancel = new Button("Cancel");
        btnCancel.setOnAction(e -> stage.close());

        Button btnSave = new Button("💾 Save All Marks");
        btnSave.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6;");
        btnSave.setOnAction(e -> {
            try {
                Subject sub = subBox.getValue();
                double maxM = Double.parseDouble(maxMarksField.getText().trim());
                String examName = examNameField.getText().trim();
                List<MarkRecord> batch = new ArrayList<>();

                int idx = 0;
                for (Student s : dataService.getStudents()) {
                    String scoreStr = (idx < scoreInputs.size()) ? scoreInputs.get(idx).getText().trim() : "70";
                    double obt = Double.parseDouble(scoreStr);
                    String id = "MR-B" + System.currentTimeMillis() + "-" + (idx + 1);
                    batch.add(new MarkRecord(id, s.getStudentId(), sub.getSubjectId(), examName, "Internal Test", LocalDate.now(), obt, maxM));
                    idx++;
                }

                int saved = marksService.saveBulkMarks(batch);
                AlertUtils.showInfo("Bulk Entry Saved", "Success", "Recorded marks for " + saved + " students.");
                stage.close();
            } catch (Exception ex) {
                AlertUtils.showError("Error", "Could not complete bulk marks save", ex.getMessage());
            }
        });

        actions.getChildren().addAll(btnCancel, btnSave);
        root.getChildren().addAll(topForm, bulkTable, actions);

        stage.setScene(new Scene(root));
        stage.showAndWait();
    }
}
