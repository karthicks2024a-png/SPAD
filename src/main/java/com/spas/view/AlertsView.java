package com.spas.view;

import com.spas.model.AcademicAlert;
import com.spas.service.DataService;
import com.spas.util.AlertUtils;
import javafx.beans.property.SimpleBooleanProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.transformation.FilteredList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

/**
 * Academic Support Alerts Module with pedagogical guidance and review workflows.
 */
public class AlertsView extends VBox {
    private final DataService dataService;
    private final TableView<AcademicAlert> table = new TableView<>();
    private final FilteredList<AcademicAlert> filteredData;
    private final ComboBox<String> severityFilter = new ComboBox<>();
    private final CheckBox showReviewedCheck = new CheckBox("Show Reviewed Alerts");

    public AlertsView() {
        this.dataService = DataService.getInstance();
        this.setSpacing(16);
        this.setPadding(new Insets(10, 16, 20, 16));

        // Educational notice
        HBox noticeBox = new HBox(12);
        noticeBox.setAlignment(Pos.CENTER_LEFT);
        noticeBox.setPadding(new Insets(12, 16, 12, 16));
        noticeBox.setStyle("-fx-background-color: #eff6ff; -fx-background-radius: 6; -fx-border-color: #bfdbfe; -fx-border-radius: 6;");

        Label noticeIcon = new Label("💡");
        noticeIcon.setStyle("-fx-font-size: 18px;");

        Label noticeText = new Label("Pedagogical Principle: Alerts are early indicators intended to trigger supportive academic review, mentoring, and diagnostic feedback. They are never labels of innate capability.");
        noticeText.setFont(Font.font("Segoe UI", FontWeight.MEDIUM, 12));
        noticeText.setTextFill(Color.web("#1e40af"));

        noticeBox.getChildren().addAll(noticeIcon, noticeText);

        // Toolbar
        HBox toolbar = new HBox(12);
        toolbar.setAlignment(Pos.CENTER_LEFT);

        Label fLbl = new Label("Filter Severity:");
        fLbl.setFont(Font.font("Segoe UI", FontWeight.BOLD, 12));

        severityFilter.setItems(FXCollections.observableArrayList("All Severities", "Critical", "Warning", "Informational"));
        severityFilter.setValue("All Severities");
        severityFilter.setOnAction(e -> updateFilter());

        showReviewedCheck.setOnAction(e -> updateFilter());

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Button btnToggleReviewed = new Button("✔️ Mark As Reviewed");
        btnToggleReviewed.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 8 16; -fx-background-radius: 6; -fx-cursor: hand;");
        btnToggleReviewed.setOnAction(e -> {
            AcademicAlert sel = table.getSelectionModel().getSelectedItem();
            if (sel == null) {
                AlertUtils.showWarning("Selection Required", "No alert selected", "Please select an alert to toggle review status.");
                return;
            }
            sel.setReviewed(!sel.isReviewed());
            table.refresh();
            updateFilter();
        });

        toolbar.getChildren().addAll(fLbl, severityFilter, showReviewedCheck, spacer, btnToggleReviewed);

        // Table
        setupTable();

        filteredData = new FilteredList<>(dataService.getAlerts(), p -> true);
        table.setItems(filteredData);
        updateFilter();

        VBox.setVgrow(table, Priority.ALWAYS);
        this.getChildren().addAll(noticeBox, toolbar, table);
    }

    private void setupTable() {
        table.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        table.setStyle("-fx-background-color: white; -fx-border-color: #e2e8f0; -fx-border-radius: 6;");

        TableColumn<AcademicAlert, String> colSev = new TableColumn<>("Severity");
        colSev.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getSeverity()));
        colSev.setPrefWidth(90);

        TableColumn<AcademicAlert, String> colStu = new TableColumn<>("Student");
        colStu.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getStudentName() + " (" + d.getValue().getStudentId() + ")"));
        colStu.setPrefWidth(180);

        TableColumn<AcademicAlert, String> colReason = new TableColumn<>("Trigger Reason");
        colReason.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getReason()));
        colReason.setPrefWidth(220);

        TableColumn<AcademicAlert, String> colMetric = new TableColumn<>("Observed Metric");
        colMetric.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getMetricLabel()));
        colMetric.setPrefWidth(120);

        TableColumn<AcademicAlert, String> colAction = new TableColumn<>("Suggested Academic Intervention");
        colAction.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getSuggestedAction()));
        colAction.setPrefWidth(240);

        TableColumn<AcademicAlert, String> colStatus = new TableColumn<>("Review State");
        colStatus.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().isReviewed() ? "Reviewed" : "Pending Action"));
        colStatus.setPrefWidth(110);

        table.getColumns().addAll(colSev, colStu, colReason, colMetric, colAction, colStatus);
    }

    private void updateFilter() {
        String sev = severityFilter.getValue();
        boolean showRev = showReviewedCheck.isSelected();

        filteredData.setPredicate(a -> {
            if (a == null) return false;
            boolean matchSev = sev == null || sev.equals("All Severities") || a.getSeverity().equalsIgnoreCase(sev);
            boolean matchRev = showRev || !a.isReviewed();
            return matchSev && matchRev;
        });
    }
}
