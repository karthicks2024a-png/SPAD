package com.spas.view;

import com.spas.service.DataService;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

/**
 * Master Desktop Shell Layout for SPAS.
 * Top Header, Navigational Sidebar, Center Content, and Status Bar.
 */
public class MainLayout extends BorderPane {
    private final Label pageTitleLabel;
    private final Label statusLabel;
    private final Label recordCountLabel;
    private final StackPane contentArea;
    private final VBox sidebar;
    private final Map<String, Button> navButtons = new HashMap<>();
    private String activeModule = "Dashboard";
    private Consumer<String> onNavigationChanged;

    public MainLayout() {
        this.setStyle("-fx-background-color: #f8fafc; -fx-font-family: 'Segoe UI', -apple-system, sans-serif;");

        // --- TOP HEADER ---
        HBox header = new HBox(16);
        header.setAlignment(Pos.CENTER_LEFT);
        header.setPadding(new Insets(12, 24, 12, 24));
        header.setStyle("-fx-background-color: #0f172a; -fx-border-color: #1e293b; -fx-border-width: 0 0 1 0;");

        Label brandIcon = new Label("📊");
        brandIcon.setStyle("-fx-font-size: 22px;");

        VBox brandBox = new VBox(2);
        Label appTitle = new Label("SPAS DESKTOP");
        appTitle.setTextFill(Color.WHITE);
        appTitle.setFont(Font.font("Segoe UI", FontWeight.BOLD, 15));

        Label appSub = new Label("Student Performance Analytics System");
        appSub.setTextFill(Color.web("#94a3b8"));
        appSub.setFont(Font.font("Segoe UI", FontWeight.NORMAL, 11));
        brandBox.getChildren().addAll(appTitle, appSub);

        Separator sep1 = new Separator(javafx.geometry.Orientation.VERTICAL);
        sep1.setStyle("-fx-opacity: 0.3;");

        pageTitleLabel = new Label("Executive Dashboard");
        pageTitleLabel.setTextFill(Color.web("#38bdf8"));
        pageTitleLabel.setFont(Font.font("Segoe UI", FontWeight.SEMI_BOLD, 15));

        Region headerSpacer = new Region();
        HBox.setHgrow(headerSpacer, Priority.ALWAYS);

        // Header Quick Actions
        Button btnQuickStudent = new Button("+ Add Student");
        styleHeaderButton(btnQuickStudent, "#2563eb", "#ffffff");
        btnQuickStudent.setOnAction(e -> navigateTo("Students"));

        Button btnQuickMarks = new Button("📝 Record Marks");
        styleHeaderButton(btnQuickMarks, "#1e293b", "#e2e8f0");
        btnQuickMarks.setOnAction(e -> navigateTo("Marks"));

        Button btnQuickReports = new Button("📄 Reports");
        styleHeaderButton(btnQuickReports, "#1e293b", "#e2e8f0");
        btnQuickReports.setOnAction(e -> navigateTo("Reports"));

        header.getChildren().addAll(brandIcon, brandBox, sep1, pageTitleLabel, headerSpacer, btnQuickStudent, btnQuickMarks, btnQuickReports);
        setTop(header);

        // --- LEFT SIDEBAR ---
        sidebar = new VBox(4);
        sidebar.setPrefWidth(240);
        sidebar.setPadding(new Insets(16, 10, 16, 10));
        sidebar.setStyle("-fx-background-color: #1e293b; -fx-border-color: #334155; -fx-border-width: 0 1 0 0;");

        Label navSectionLabel = new Label("ACADEMIC MODULES");
        navSectionLabel.setTextFill(Color.web("#64748b"));
        navSectionLabel.setFont(Font.font("Segoe UI", FontWeight.BOLD, 10));
        navSectionLabel.setPadding(new Insets(0, 12, 8, 12));
        sidebar.getChildren().add(navSectionLabel);

        addNavButton("Dashboard", "📈  Overview Dashboard");
        addNavButton("Students", "👥  Student Management");
        addNavButton("Subjects", "📚  Subject Management");
        addNavButton("Marks", "📝  Assessment & Marks");
        addNavButton("Attendance", "📅  Attendance Tracker");
        addNavButton("Profile", "👤  Academic Profile");
        addNavButton("Analytics", "📊  Performance Analytics");
        addNavButton("Alerts", "⚠️  Support Alerts");

        Separator navSep = new Separator();
        navSep.setPadding(new Insets(10, 8, 10, 8));
        navSep.setStyle("-fx-opacity: 0.2;");
        sidebar.getChildren().add(navSep);

        Label sysSectionLabel = new Label("SYSTEM & REPORTS");
        sysSectionLabel.setTextFill(Color.web("#64748b"));
        sysSectionLabel.setFont(Font.font("Segoe UI", FontWeight.BOLD, 10));
        sysSectionLabel.setPadding(new Insets(0, 12, 8, 12));
        sidebar.getChildren().add(sysSectionLabel);

        addNavButton("Reports", "📑  Report Center");
        addNavButton("Settings", "⚙️  Settings & Data");

        setLeft(sidebar);

        // --- CENTER CONTENT ---
        contentArea = new StackPane();
        contentArea.setPadding(new Insets(16));
        setCenter(contentArea);

        // --- BOTTOM STATUS BAR ---
        HBox statusBar = new HBox(16);
        statusBar.setAlignment(Pos.CENTER_LEFT);
        statusBar.setPadding(new Insets(6, 16, 6, 16));
        statusBar.setStyle("-fx-background-color: #0f172a; -fx-border-color: #1e293b; -fx-border-width: 1 0 0 0;");

        statusLabel = new Label("Ready • Local In-Memory Store Active");
        statusLabel.setTextFill(Color.web("#94a3b8"));
        statusLabel.setFont(Font.font("Segoe UI", 12));

        Region statusSpacer = new Region();
        HBox.setHgrow(statusSpacer, Priority.ALWAYS);

        recordCountLabel = new Label("Students: 0 | Subjects: 0 | Marks: 0");
        recordCountLabel.setTextFill(Color.web("#64748b"));
        recordCountLabel.setFont(Font.font("Segoe UI", 11));

        statusBar.getChildren().addAll(statusLabel, statusSpacer, recordCountLabel);
        setBottom(statusBar);

        refreshStatusCounts();
    }

    private void styleHeaderButton(Button btn, String bg, String fg) {
        btn.setStyle(String.format("-fx-background-color: %s; -fx-text-fill: %s; -fx-font-weight: bold; -fx-font-size: 12px; -fx-padding: 6 12 6 12; -fx-background-radius: 6; -fx-cursor: hand;", bg, fg));
    }

    private void addNavButton(String id, String text) {
        Button btn = new Button(text);
        btn.setMaxWidth(Double.MAX_VALUE);
        btn.setAlignment(Pos.CENTER_LEFT);
        btn.setFont(Font.font("Segoe UI", FontWeight.SEMI_BOLD, 13));
        btn.setPadding(new Insets(10, 14, 10, 14));
        btn.setFocusTraversable(false);

        btn.setOnAction(e -> navigateTo(id));
        navButtons.put(id, btn);
        sidebar.getChildren().add(btn);
        updateNavButtonStyles();
    }

    public void navigateTo(String moduleId) {
        this.activeModule = moduleId;
        updateNavButtonStyles();

        switch (moduleId) {
            case "Dashboard": pageTitleLabel.setText("Executive Analytics Dashboard"); break;
            case "Students": pageTitleLabel.setText("Student Information Management"); break;
            case "Subjects": pageTitleLabel.setText("Subject & Grading Configuration"); break;
            case "Marks": pageTitleLabel.setText("Continuous Assessment & Marks"); break;
            case "Attendance": pageTitleLabel.setText("Daily Class Attendance Tracker"); break;
            case "Profile": pageTitleLabel.setText("Individual Student Academic Profile"); break;
            case "Analytics": pageTitleLabel.setText("Institutional Performance Analytics"); break;
            case "Alerts": pageTitleLabel.setText("Academic Support & Intervention Alerts"); break;
            case "Reports": pageTitleLabel.setText("Report Center & Data Export"); break;
            case "Settings": pageTitleLabel.setText("System Preferences & Data Store"); break;
        }

        if (onNavigationChanged != null) {
            onNavigationChanged.accept(moduleId);
        }
        refreshStatusCounts();
    }

    private void updateNavButtonStyles() {
        for (Map.Entry<String, Button> entry : navButtons.entrySet()) {
            Button btn = entry.getValue();
            if (entry.getKey().equals(activeModule)) {
                btn.setStyle("-fx-background-color: #2563eb; -fx-text-fill: #ffffff; -fx-background-radius: 6; -fx-cursor: hand;");
            } else {
                btn.setStyle("-fx-background-color: transparent; -fx-text-fill: #94a3b8; -fx-background-radius: 6; -fx-cursor: hand;");
            }
        }
    }

    public void setView(Node node) {
        contentArea.getChildren().clear();
        contentArea.getChildren().add(node);
    }

    public void setOnNavigationChanged(Consumer<String> consumer) {
        this.onNavigationChanged = consumer;
    }

    public void setStatusMessage(String message) {
        statusLabel.setText(message);
    }

    public void refreshStatusCounts() {
        DataService ds = DataService.getInstance();
        recordCountLabel.setText(String.format("Active Students: %d | Subjects: %d | Marks: %d | Alerts: %d",
                ds.getStudents().stream().filter(s -> s.isActive()).count(),
                ds.getSubjects().size(),
                ds.getMarks().size(),
                ds.getAlerts().size()));
    }
}
