package com.spas.view;

import com.spas.model.Student;
import com.spas.service.DataService;
import com.spas.service.StudentService;
import com.spas.util.AlertUtils;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
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
import java.util.Optional;
import java.util.function.Consumer;

/**
 * Student Management View with TableView, Search, Multi-Filter, and CRUD dialogs.
 */
public class StudentView extends VBox {
    private final StudentService studentService;
    private final TableView<Student> table = new TableView<>();
    private final FilteredList<Student> filteredData;
    private final TextField searchField = new TextField();
    private final ComboBox<String> sectionFilter = new ComboBox<>();
    private final ComboBox<String> statusFilter = new ComboBox<>();
    private final Consumer<Student> onOpenProfile;

    public StudentView(Consumer<Student> onOpenProfile) {
        this.studentService = new StudentService();
        this.onOpenProfile = onOpenProfile;
        this.setSpacing(16);
        this.setPadding(new Insets(10, 16, 20, 16));

        // 1. Toolbar (Search, Filters, Action Buttons)
        HBox toolbar = new HBox(12);
        toolbar.setAlignment(Pos.CENTER_LEFT);

        searchField.setPromptText("🔍 Search student ID or name...");
        searchField.setPrefWidth(240);
        searchField.setStyle("-fx-background-radius: 6; -fx-padding: 7 10; -fx-border-color: #cbd5e1; -fx-border-radius: 6;");

        sectionFilter.setPromptText("Filter Section");
        sectionFilter.setItems(FXCollections.observableArrayList("All Sections", "A", "B"));
        sectionFilter.setValue("All Sections");
        sectionFilter.setStyle("-fx-background-radius: 6; -fx-border-color: #cbd5e1; -fx-border-radius: 6;");

        statusFilter.setPromptText("Filter Status");
        statusFilter.setItems(FXCollections.observableArrayList("All Status", "Active", "Inactive"));
        statusFilter.setValue("All Status");
        statusFilter.setStyle("-fx-background-radius: 6; -fx-border-color: #cbd5e1; -fx-border-radius: 6;");

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Button btnAdd = new Button("+ Add Student");
        btnAdd.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btnAdd.setOnAction(e -> showStudentDialog(null));

        Button btnEdit = new Button("✏️ Edit");
        btnEdit.setStyle("-fx-background-color: #0f172a; -fx-text-fill: white; -fx-padding: 8 14; -fx-background-radius: 6; -fx-cursor: hand;");
        btnEdit.setOnAction(e -> {
            Student selected = table.getSelectionModel().getSelectedItem();
            if (selected == null) {
                AlertUtils.showWarning("Selection Required", "No student selected", "Please select a student from the table to edit.");
                return;
            }
            showStudentDialog(selected);
        });

        Button btnDelete = new Button("🗑️ Delete");
        btnDelete.setStyle("-fx-background-color: #fee2e2; -fx-text-fill: #b91c1c; -fx-font-weight: bold; -fx-padding: 8 14; -fx-background-radius: 6; -fx-cursor: hand;");
        btnDelete.setOnAction(e -> handleDelete());

        Button btnProfile = new Button("👤 View Academic Profile");
        btnProfile.setStyle("-fx-background-color: #3b82f6; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 14; -fx-background-radius: 6; -fx-cursor: hand;");
        btnProfile.setOnAction(e -> {
            Student selected = table.getSelectionModel().getSelectedItem();
            if (selected == null) {
                AlertUtils.showWarning("Selection Required", "No student selected", "Please select a student to view their profile.");
                return;
            }
            if (this.onOpenProfile != null) {
                this.onOpenProfile.accept(selected);
            }
        });

        toolbar.getChildren().addAll(searchField, sectionFilter, statusFilter, spacer, btnAdd, btnEdit, btnDelete, btnProfile);

        // 2. Setup TableView
        setupTable();

        // 3. Filter Binding
        filteredData = new FilteredList<>(studentService.getAllStudents(), p -> true);
        searchField.textProperty().addListener((obs, oldV, newV) -> updateFilter());
        sectionFilter.valueProperty().addListener((obs, oldV, newV) -> updateFilter());
        statusFilter.valueProperty().addListener((obs, oldV, newV) -> updateFilter());

        SortedList<Student> sortedData = new SortedList<>(filteredData);
        sortedData.comparatorProperty().bind(table.comparatorProperty());
        table.setItems(sortedData);

        VBox.setVgrow(table, Priority.ALWAYS);
        this.getChildren().addAll(toolbar, table);
    }

    private void setupTable() {
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        table.setStyle("-fx-background-color: white; -fx-border-color: #e2e8f0; -fx-border-radius: 6;");

        TableColumn<Student, String> colId = new TableColumn<>("Student ID");
        colId.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getStudentId()));
        colId.setPrefWidth(100);

        TableColumn<Student, String> colName = new TableColumn<>("Full Name");
        colName.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getFullName()));
        colName.setPrefWidth(160);

        TableColumn<Student, String> colDept = new TableColumn<>("Department / Class");
        colDept.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getDepartment()));
        colDept.setPrefWidth(140);

        TableColumn<Student, String> colSec = new TableColumn<>("Section");
        colSec.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getSection()));
        colSec.setPrefWidth(80);

        TableColumn<Student, String> colYear = new TableColumn<>("Academic Year");
        colYear.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getAcademicYear()));
        colYear.setPrefWidth(110);

        TableColumn<Student, String> colEmail = new TableColumn<>("Email Address");
        colEmail.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getEmail()));
        colEmail.setPrefWidth(180);

        TableColumn<Student, String> colStatus = new TableColumn<>("Status");
        colStatus.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getStatus()));
        colStatus.setPrefWidth(90);

        table.getColumns().addAll(colId, colName, colDept, colSec, colYear, colEmail, colStatus);

        // Double click to open profile
        table.setRowFactory(tv -> {
            TableRow<Student> row = new TableRow<>();
            row.setOnMouseClicked(event -> {
                if (event.getClickCount() == 2 && (!row.isEmpty()) && onOpenProfile != null) {
                    onOpenProfile.accept(row.getItem());
                }
            });
            return row;
        });
    }

    private void updateFilter() {
        String query = searchField.getText() == null ? "" : searchField.getText().trim().toLowerCase();
        String sec = sectionFilter.getValue();
        String st = statusFilter.getValue();

        filteredData.setPredicate(s -> {
            if (s == null) return false;
            boolean matchQuery = query.isEmpty()
                    || s.getStudentId().toLowerCase().contains(query)
                    || s.getFullName().toLowerCase().contains(query);

            boolean matchSec = sec == null || sec.equals("All Sections")
                    || s.getSection().equalsIgnoreCase(sec);

            boolean matchStatus = st == null || st.equals("All Status")
                    || s.getStatus().equalsIgnoreCase(st);

            return matchQuery && matchSec && matchStatus;
        });
    }

    private void handleDelete() {
        Student selected = table.getSelectionModel().getSelectedItem();
        if (selected == null) {
            AlertUtils.showWarning("Selection Required", "No student selected", "Please select a student record to delete.");
            return;
        }

        boolean confirm = AlertUtils.showConfirmation(
                "Confirm Deletion",
                "Delete Student Record",
                "Are you sure you want to delete student " + selected.getFullName() + " (" + selected.getStudentId() + ")? All associated marks and attendance will also be removed."
        );

        if (confirm) {
            studentService.deleteStudent(selected.getStudentId());
        }
    }

    private void showStudentDialog(Student studentToEdit) {
        boolean isNew = (studentToEdit == null);
        Dialog<Student> dialog = new Dialog<>();
        dialog.setTitle(isNew ? "Add New Student Record" : "Edit Student Record");
        dialog.setHeaderText(isNew ? "Enter academic and contact details for the new student" : "Modify student information");

        ButtonType saveButtonType = new ButtonType("Save Student", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(saveButtonType, ButtonType.CANCEL);

        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(12);
        grid.setPadding(new Insets(20, 150, 10, 10));

        TextField idField = new TextField(isNew ? "STU-" + (DataService.getInstance().getStudents().size() + 101) : studentToEdit.getStudentId());
        if (!isNew) idField.setDisable(true); // Don't allow changing primary key ID

        TextField nameField = new TextField(isNew ? "" : studentToEdit.getFullName());
        TextField deptField = new TextField(isNew ? "Computer Science" : studentToEdit.getDepartment());
        TextField secField = new TextField(isNew ? "A" : studentToEdit.getSection());
        TextField yearField = new TextField(isNew ? "2023-2024" : studentToEdit.getAcademicYear());
        TextField emailField = new TextField(isNew ? "" : studentToEdit.getEmail());
        ComboBox<String> statusBox = new ComboBox<>(FXCollections.observableArrayList("Active", "Inactive"));
        statusBox.setValue(isNew ? "Active" : studentToEdit.getStatus());

        grid.add(new Label("Student ID:"), 0, 0);
        grid.add(idField, 1, 0);
        grid.add(new Label("Full Name:"), 0, 1);
        grid.add(nameField, 1, 1);
        grid.add(new Label("Department/Class:"), 0, 2);
        grid.add(deptField, 1, 2);
        grid.add(new Label("Section:"), 0, 3);
        grid.add(secField, 1, 3);
        grid.add(new Label("Academic Year:"), 0, 4);
        grid.add(yearField, 1, 4);
        grid.add(new Label("Email:"), 0, 5);
        grid.add(emailField, 1, 5);
        grid.add(new Label("Status:"), 0, 6);
        grid.add(statusBox, 1, 6);

        dialog.getDialogPane().setContent(grid);

        dialog.setResultConverter(dialogButton -> {
            if (dialogButton == saveButtonType) {
                return new Student(
                        idField.getText().trim(),
                        nameField.getText().trim(),
                        deptField.getText().trim(),
                        secField.getText().trim(),
                        yearField.getText().trim(),
                        emailField.getText().trim(),
                        isNew ? LocalDate.now() : studentToEdit.getEnrollmentDate(),
                        statusBox.getValue()
                );
            }
            return null;
        });

        Optional<Student> result = dialog.showAndWait();
        result.ifPresent(student -> {
            try {
                if (isNew) {
                    studentService.addStudent(student);
                    AlertUtils.showInfo("Success", "Student Added", "Successfully enrolled " + student.getFullName());
                } else {
                    studentService.updateStudent(student);
                    AlertUtils.showInfo("Success", "Student Updated", "Updated records for " + student.getFullName());
                }
            } catch (Exception ex) {
                AlertUtils.showError("Validation Error", "Could not save student", ex.getMessage());
            }
        });
    }
}
