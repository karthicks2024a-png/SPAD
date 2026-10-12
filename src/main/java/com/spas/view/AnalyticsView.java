package com.spas.view;

import com.spas.model.Student;
import com.spas.service.AnalyticsService;
import com.spas.service.DataService;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

import java.util.List;

/**
 * Deep Institutional Performance Analytics View with Rankings and Trajectories.
 */
public class AnalyticsView extends ScrollPane {
    private final AnalyticsService analyticsService;
    private final DataService dataService;

    private final TableView<AnalyticsService.StudentRanking> rankingTable = new TableView<>();
    private final TableView<AnalyticsService.StudentTrajectory> trajectoryTable = new TableView<>();
    private final ComboBox<String> sectionFilter = new ComboBox<>();
    private final Label highestSubjectLbl = new Label();
    private final Label lowestSubjectLbl = new Label();

    public AnalyticsView() {
        this.analyticsService = new AnalyticsService();
        this.dataService = DataService.getInstance();

        this.setFitToWidth(true);
        this.setStyle("-fx-background: #f8fafc; -fx-background-color: transparent;");

        VBox root = new VBox(20);
        root.setPadding(new Insets(10, 20, 30, 20));

        // Top Filter Bar
        HBox filterBar = new HBox(12);
        filterBar.setAlignment(Pos.CENTER_LEFT);

        Label fLbl = new Label("Filter Cohort:");
        fLbl.setFont(Font.font("Segoe UI", FontWeight.BOLD, 12));

        sectionFilter.setItems(FXCollections.observableArrayList("All Sections", "Section A", "Section B"));
        sectionFilter.setValue("All Sections");
        sectionFilter.setOnAction(e -> refreshData());

        filterBar.getChildren().addAll(fLbl, sectionFilter);
        root.getChildren().add(filterBar);

        // Subject Highlights Cards
        HBox highlightRow = new HBox(16);
        highlightRow.getChildren().addAll(
                createHighlightCard("🏆 Highest Subject Average", highestSubjectLbl, "#16a34a"),
                createHighlightCard("⚠️ Lowest Subject Average", lowestSubjectLbl, "#dc2626")
        );
        root.getChildren().add(highlightRow);

        // Student Ranking Table Card
        VBox rankingCard = new VBox(10);
        rankingCard.setPadding(new Insets(16));
        rankingCard.setStyle("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8;");

        Label rankTitle = new Label("Institutional Student Rankings (Calculated by Normalized Overall %)");
        rankTitle.setFont(Font.font("Segoe UI", FontWeight.BOLD, 14));
        rankTitle.setTextFill(Color.web("#0f172a"));

        setupRankingTable();
        rankingCard.getChildren().addAll(rankTitle, rankingTable);
        root.getChildren().add(rankingCard);

        // Trajectory Analysis Table Card
        VBox trajCard = new VBox(10);
        trajCard.setPadding(new Insets(16));
        trajCard.setStyle("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8;");

        Label trajTitle = new Label("Performance Trajectory Detection (Exam-to-Exam Score Velocity)");
        trajTitle.setFont(Font.font("Segoe UI", FontWeight.BOLD, 14));
        trajTitle.setTextFill(Color.web("#0f172a"));

        setupTrajectoryTable();
        trajCard.getChildren().addAll(trajTitle, trajectoryTable);
        root.getChildren().add(trajCard);

        this.setContent(root);
        refreshData();
    }

    private VBox createHighlightCard(String title, Label valLbl, String color) {
        VBox card = new VBox(6);
        card.setPadding(new Insets(16));
        card.setPrefWidth(350);
        card.setStyle(String.format("-fx-background-color: #ffffff; -fx-background-radius: 8; -fx-border-color: #e2e8f0; -fx-border-radius: 8; -fx-border-left-color: %s; -fx-border-left-width: 4;", color));

        Label t = new Label(title);
        t.setFont(Font.font("Segoe UI", FontWeight.SEMI_BOLD, 12));
        t.setTextFill(Color.web("#64748b"));

        valLbl.setFont(Font.font("Segoe UI", FontWeight.BOLD, 16));
        valLbl.setTextFill(Color.web("#0f172a"));

        card.getChildren().addAll(t, valLbl);
        return card;
    }

    private void setupRankingTable() {
        rankingTable.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        rankingTable.setPrefHeight(250);

        TableColumn<AnalyticsService.StudentRanking, Number> colRank = new TableColumn<>("Rank");
        colRank.setCellValueFactory(d -> new SimpleIntegerProperty(d.getValue().getRank()));
        colRank.setPrefWidth(60);

        TableColumn<AnalyticsService.StudentRanking, String> colId = new TableColumn<>("Student ID");
        colId.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getStudent().getStudentId()));
        colId.setPrefWidth(100);

        TableColumn<AnalyticsService.StudentRanking, String> colName = new TableColumn<>("Full Name");
        colName.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getStudent().getFullName()));
        colName.setPrefWidth(180);

        TableColumn<AnalyticsService.StudentRanking, String> colSec = new TableColumn<>("Section");
        colSec.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getStudent().getSection()));
        colSec.setPrefWidth(70);

        TableColumn<AnalyticsService.StudentRanking, String> colAvg = new TableColumn<>("Overall Average %");
        colAvg.setCellValueFactory(d -> new SimpleStringProperty(String.format("%.2f%%", d.getValue().getOverallAverage())));
        colAvg.setPrefWidth(130);

        TableColumn<AnalyticsService.StudentRanking, String> colAtt = new TableColumn<>("Attendance %");
        colAtt.setCellValueFactory(d -> new SimpleStringProperty(String.format("%.2f%%", d.getValue().getAttendancePercentage())));
        colAtt.setPrefWidth(110);

        rankingTable.getColumns().addAll(colRank, colId, colName, colSec, colAvg, colAtt);
    }

    private void setupTrajectoryTable() {
        trajectoryTable.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        trajectoryTable.setPrefHeight(220);

        TableColumn<AnalyticsService.StudentTrajectory, String> colId = new TableColumn<>("Student ID");
        colId.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getStudent().getStudentId()));
        colId.setPrefWidth(100);

        TableColumn<AnalyticsService.StudentTrajectory, String> colName = new TableColumn<>("Full Name");
        colName.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getStudent().getFullName()));
        colName.setPrefWidth(180);

        TableColumn<AnalyticsService.StudentTrajectory, String> colFirst = new TableColumn<>("Initial Exam %");
        colFirst.setCellValueFactory(d -> new SimpleStringProperty(String.format("%.1f%%", d.getValue().getFirstScore())));

        TableColumn<AnalyticsService.StudentTrajectory, String> colLatest = new TableColumn<>("Latest Exam %");
        colLatest.setCellValueFactory(d -> new SimpleStringProperty(String.format("%.1f%%", d.getValue().getLatestScore())));

        TableColumn<AnalyticsService.StudentTrajectory, String> colDiff = new TableColumn<>("Net Delta");
        colDiff.setCellValueFactory(d -> new SimpleStringProperty(String.format("%+.1f%%", d.getValue().getDifference())));

        TableColumn<AnalyticsService.StudentTrajectory, String> colStatus = new TableColumn<>("Trajectory");
        colStatus.setCellValueFactory(d -> new SimpleStringProperty(d.getValue().getStatus()));

        trajectoryTable.getColumns().addAll(colId, colName, colFirst, colLatest, colDiff, colStatus);
    }

    private void refreshData() {
        // Rankings
        List<AnalyticsService.StudentRanking> rankings = analyticsService.getRankings();
        String sec = sectionFilter.getValue();
        if (sec != null && sec.equals("Section A")) {
            rankings.removeIf(r -> !r.getStudent().getSection().equalsIgnoreCase("A"));
        } else if (sec != null && sec.equals("Section B")) {
            rankings.removeIf(r -> !r.getStudent().getSection().equalsIgnoreCase("B"));
        }
        rankingTable.setItems(FXCollections.observableArrayList(rankings));

        // Trajectories
        List<AnalyticsService.StudentTrajectory> traj = analyticsService.getStudentTrajectories();
        trajectoryTable.setItems(FXCollections.observableArrayList(traj));

        // Highest and Lowest subject
        List<AnalyticsService.SubjectAverage> subs = analyticsService.getSubjectAverages();
        if (!subs.isEmpty()) {
            AnalyticsService.SubjectAverage high = subs.stream().max((a, b) -> Double.compare(a.getAveragePercentage(), b.getAveragePercentage())).orElse(subs.get(0));
            AnalyticsService.SubjectAverage low = subs.stream().min((a, b) -> Double.compare(a.getAveragePercentage(), b.getAveragePercentage())).orElse(subs.get(0));

            highestSubjectLbl.setText(String.format("%s (%.1f%%)", high.getSubjectName(), high.getAveragePercentage()));
            lowestSubjectLbl.setText(String.format("%s (%.1f%%)", low.getSubjectName(), low.getAveragePercentage()));
        }
    }
}
