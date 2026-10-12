package com.spas.view;

import com.spas.model.Subject;
import com.spas.service.DataService;
import com.spas.service.SubjectService;
import com.spas.util.AlertUtils;
import javafx.beans.property.SimpleDoubleProperty;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

import java.util.Optional;

/**
 * Subject & Grading Configuration Management View.
 */
public class SubjectView extends VBox {
    private final SubjectService subjectService;
    private final TableView<Subject> table = new TableView<>();
    private final FilteredList<Subject> filteredData;
    private final TextField searchField = new TextField();

    public SubjectView() {
        this.subjectService = new SubjectService();
        this.setSpacing(16);
        this.setPadding(new Insets(10, 16, 20, 16));

        // Toolbar
        HBox toolbar = new HBox(12);
        toolbar.setAlignment(Pos.CENTER_LEFT);

        searchField.setPromptText("🔍 Search subject name or code...");
        searchField.setPrefWidth(260);
        searchField.setStyle("-fx-background-radius: 6; -fx-padding: 7 10; -fx-border-color: #cbd5e1; -fx-border-radius: 6;");

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Button btnAdd = new Button("+ Add Subject");
        btnAdd.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btnAdd.setOnAction(e -> showSubjectDialog(null));

        Button btnEdit = new Button("✏️ Edit");
        btnEdit.setStyle("-fx-background-color: #0f172a; -fx-text-fill: white; -fx-padding: 8 14; -fx-background-radius: 6; -fx-cursor: hand;");
        btnEdit.setOnAction(e -> {
            Subject sel = table.getSelectionModel().getSelectedItem();
            if (sel == null) {
                AlertUtils.showWarning("Selection Required", "No subject selected", "Please select a subject to edit.");
                return;
            }
            showSubjectDialog(sel);
        });

        Button btnDelete = new Button("🗑️ Delete");
        btnDelete.setStyle("-fx-background-color: #fee2e2; -fx-text-fill: #b91c1c; -fx-font-weight: bold; -fx-padding: 8 14; -fx-background-radius: 6; -fx-cursor: hand;");
        btnDelete.setOnAction(e -> handleDelete());

        toolbar.getChildren().addAll(searchField, spacer, btnAdd, btnEdit, btnDelete);

        // Table setup
        setupTable();

        filteredData = new FilteredList<>(subjectService.getAllSubjects(), p -> true);
        searchField.textProperty().addListener((obs, oldV, newV) -> {
            String q = newV == null ? "" : newV.trim().toLowerCase();
            filteredData.setPredicate(s -> q.isEmpty()
                    || s.getSubjectName().toLowerCase().contains(q)
                    || s.getSubjectCode().toLowerCase().contains(q));
        });

        SortedList<Subject> sorted = new SortedList<>(filteredData);
        sorted.comparatorProperty().bind(table.comparatorProperty());
        table.setItems(sorted);

        VBox.setVgrow(table, Priority.ALWAYS);
        this.getChildren().addAll(toolbar, table);
    }

    private void setupTable() {
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        table.setStyle("-fx-background-color: white; -fx-border-color: #e2e8f0; -fx-border-radius: 6;");

        TableColumn<Subject, String> colId = new TableColumn<>("Subject ID");
        colId.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getSubjectId()));
        colId.setPrefWidth(100);

        TableColumn<Subject, String> colCode = new TableColumn<>("Code");
        colCode.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getSubjectCode()));
        colCode.setPrefWidth(90);

        TableColumn<Subject, String> colName = new TableColumn<>("Subject Name");
        colName.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getSubjectName()));
        colName.setPrefWidth(220);

        TableColumn<Subject, String> colDept = new TableColumn<>("Department");
        colDept.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getDepartment()));
        colDept.setPrefWidth(150);

        TableColumn<Subject, Number> colCredits = new TableColumn<>("Credits");
        colCredits.setCellValueFactory(d -> new SimpleIntegerProperty(d.getValue().getCredits()));
        colCredits.setPrefWidth(80);

        TableColumn<Subject, Number> colMax = new TableColumn<>("Max Marks");
        colMax.setCellValueFactory(d -> new SimpleDoubleProperty(d.getValue().getMaxMarks()));
        colMax.setPrefWidth(100);

        TableColumn<Subject, Number> colPass = new TableColumn<>("Passing Marks");
        colPass.setCellValueFactory(d -> new SimpleDoubleProperty(d.getValue().getPassingMarks()));
        colPass.setPrefWidth(110);

        table.getColumns().addAll(colId, colCode, colName, colDept, colCredits, colMax, colPass);
    }

    private void handleDelete() {
        Subject sel = table.getSelectionModel().getSelectedItem();
        if (sel == null) {
            AlertUtils.showWarning("Selection Required", "No subject selected", "Please select a subject to delete.");
            return;
        }

        if (subjectService.hasAssociatedMarks(sel.getSubjectId())) {
            AlertUtils.showError("Constraint Error", "Cannot Delete Subject",
                    "Subject '" + sel.getSubjectName() + "' has academic marks recorded. Deletion is prevented to maintain data integrity.");
            return;
        }

        boolean confirm = AlertUtils.showConfirmation("Confirm Delete", "Delete Subject",
                "Are you sure you want to delete subject " + sel.getSubjectName() + " (" + sel.getSubjectCode() + ")?");
        if (confirm) {
            subjectService.deleteSubject(sel.getSubjectId());
        }
    }

    private void showSubjectDialog(Subject toEdit) {
        boolean isNew = (toEdit == null);
        Dialog<Subject> dialog = new Dialog<>();
        dialog.setTitle(isNew ? "Add New Subject" : "Edit Subject Configuration");
        dialog.setHeaderText(isNew ? "Enter subject and grading threshold details" : "Update subject details");

        ButtonType saveType = new ButtonType("Save Subject", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(saveType, ButtonType.CANCEL);

        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(12);
        grid.setPadding(new Insets(20, 150, 10, 10));

        TextField idField = new TextField(isNew ? "SUB-" + (DataService.getInstance().getSubjects().size() + 101) : toEdit.getSubjectId());
        if (!isNew) idField.setDisable(true);

        TextField codeField = new TextField(isNew ? "CS" : toEdit.getSubjectCode());
        TextField nameField = new TextField(isNew ? "" : toEdit.getSubjectName());
        TextField deptField = new TextField(isNew ? "Computer Science" : toEdit.getDepartment());
        TextField creditsField = new TextField(isNew ? "3" : String.valueOf(toEdit.getCredits()));
        TextField maxMarksField = new TextField(isNew ? "100" : String.valueOf(toEdit.getMaxMarks()));
        TextField passMarksField = new TextField(isNew ? "40" : String.valueOf(toEdit.getPassingMarks()));

        grid.add(new Label("Subject ID:"), 0, 0); grid.add(idField, 1, 0);
        grid.add(new Label("Subject Code:"), 0, 1); grid.add(codeField, 1, 1);
        grid.add(new Label("Subject Name:"), 0, 2); grid.add(nameField, 1, 2);
        grid.add(new Label("Department:"), 0, 3); grid.add(deptField, 1, 3);
        grid.add(new Label("Credits:"), 0, 4); grid.add(creditsField, 1, 4);
        grid.add(new Label("Max Marks:"), 0, 5); grid.add(maxMarksField, 1, 5);
        grid.add(new Label("Passing Marks:"), 0, 6); grid.add(passMarksField, 1, 6);

        dialog.getDialogPane().setContent(grid);

        dialog.setResultConverter(btn -> {
            if (btn == saveType) {
                try {
                    int cr = Integer.parseInt(creditsField.getText().trim());
                    double mm = Double.parseDouble(maxMarksField.getText().trim());
                    double pm = Double.parseDouble(passMarksField.getText().trim());
                    return new Subject(idField.getText().trim(), nameField.getText().trim(), codeField.getText().trim(),
                            deptField.getText().trim(), mm, pm, cr);
                } catch (NumberFormatException ex) {
                    return null;
                }
            }
            return null;
        });

        Optional<Subject> result = dialog.showAndWait();
        result.ifPresent(sub -> {
            try {
                if (isNew) {
                    subjectService.addSubject(sub);
                    AlertUtils.showInfo("Success", "Subject Added", "Subject added: " + sub.getSubjectName());
                } else {
                    subjectService.updateSubject(sub);
                    AlertUtils.showInfo("Success", "Subject Updated", "Subject updated: " + sub.getSubjectName());
                }
            } catch (Exception ex) {
                AlertUtils.showError("Validation Error", "Could not save subject", ex.getMessage());
            }
        });
    }
}
