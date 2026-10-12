package com.spas;

import com.spas.model.Student;
import com.spas.view.*;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;

/**
 * Main JavaFX Application Entry Point for Student Performance Analytics System (SPAS).
 */
public class MainApp extends Application {
    private MainLayout mainLayout;
    private DashboardView dashboardView;
    private StudentView studentView;
    private SubjectView subjectView;
    private MarksView marksView;
    private AttendanceView attendanceView;
    private StudentProfileView profileView;
    private AnalyticsView analyticsView;
    private AlertsView alertsView;
    private ReportsView reportsView;
    private SettingsView settingsView;

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Student Performance Analytics System (SPAS) - JavaFX Desktop");

        mainLayout = new MainLayout();

        // Instantiate views
        dashboardView = new DashboardView(
                () -> mainLayout.navigateTo("Students"),
                () -> mainLayout.navigateTo("Marks"),
                () -> mainLayout.navigateTo("Reports")
        );

        studentView = new StudentView(student -> {
            profileView.selectStudent(student);
            mainLayout.navigateTo("Profile");
        });

        subjectView = new SubjectView();
        marksView = new MarksView();
        attendanceView = new AttendanceView();
        profileView = new StudentProfileView();
        analyticsView = new AnalyticsView();
        alertsView = new AlertsView();
        reportsView = new ReportsView();
        settingsView = new SettingsView(() -> {
            dashboardView.refresh();
            mainLayout.refreshStatusCounts();
        });

        // Set default view
        mainLayout.setView(dashboardView);

        // Navigation handler
        mainLayout.setOnNavigationChanged(moduleId -> {
            switch (moduleId) {
                case "Dashboard":
                    dashboardView.refresh();
                    mainLayout.setView(dashboardView);
                    break;
                case "Students":
                    mainLayout.setView(studentView);
                    break;
                case "Subjects":
                    mainLayout.setView(subjectView);
                    break;
                case "Marks":
                    mainLayout.setView(marksView);
                    break;
                case "Attendance":
                    mainLayout.setView(attendanceView);
                    break;
                case "Profile":
                    mainLayout.setView(profileView);
                    break;
                case "Analytics":
                    mainLayout.setView(analyticsView);
                    break;
                case "Alerts":
                    mainLayout.setView(alertsView);
                    break;
                case "Reports":
                    mainLayout.setView(reportsView);
                    break;
                case "Settings":
                    mainLayout.setView(settingsView);
                    break;
            }
        });

        Scene scene = new Scene(mainLayout, 1200, 800);
        primaryStage.setScene(scene);
        primaryStage.setMinWidth(1000);
        primaryStage.setMinHeight(650);

        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
