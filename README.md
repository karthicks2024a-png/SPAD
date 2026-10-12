# Student Performance Analytics System (SPAS)
*A Modern Desktop Academic Analytics and Record Management System Built with Java 17/21 and JavaFX*

---

## 1. Project Overview
**Student Performance Analytics System (SPAS)** is a standalone JavaFX desktop application designed for educational institutions, department heads, teachers, and academic advisors. It provides an intuitive interface for managing student demographics, subject curriculum, periodic assessments, and daily attendance records, coupled with deep analytical insights and an automated academic support alert engine.

## 2. Key Features
- **Modern Dashboard**: Real-time aggregate KPIs (Class Average, Attendance %, At-Risk Count, Top Achievers) with 4 synchronized charts:
  - Subject-wise Performance Bar Chart
  - Performance Grade Distribution Pie Chart
  - Assessment Performance Trends Line Chart
  - Attendance vs. Marks Correlation Scatter Chart
- **Student Information System (SIS)**:
  - Complete CRUD for student records with validation (ID uniqueness, email format, enrollment date).
  - Multi-criteria filtering by Class, Section, Academic Year, and Status (Active/Inactive).
  - Quick action to launch individual Academic Profiles.
- **Subject & Curriculum Management**:
  - Configurable course credits, maximum marks, and minimum passing threshold.
  - Referential integrity guards preventing deletion of subjects with recorded marks.
- **Marks & Assessment Tracking**:
  - Individual assessment record entries with percentage and pass/fail calculation.
  - **Bulk Marks Entry Mode**: Fast grade entry for an entire class roster in a specific examination.
  - Duplicate assessment prevention and score-boundary validations.
- **Attendance Management**:
  - Date-driven class attendance recording with Present, Absent, and Excused statuses.
  - Real-time attendance rate calculation with clear excused absence policy.
  - Color-coded highlighting for students falling below the minimum attendance threshold (default 75%).
- **Student Academic Profile**:
  - Comprehensive 360-degree card displaying subject averages, chronological score progression line chart, strongest subject, weakest subject, and automated supportive recommendations.
- **Performance Analytics Suite**:
  - Multi-filter comparisons by Year, Department, Subject, and Exam Type.
  - Student rankings with fair tie-handling.
  - Longitudinal trajectory detection (identifies students on an improving vs. declining trend).
- **Academic Support Alerts**:
  - Transparent rule engine flagging students needing pedagogical assistance (e.g., marks < 40%, attendance < 75%, multiple failed assessments, score drop > 10%).
  - Configurable alert thresholds and review workflow.
- **Reports & Data Export**:
  - Formatted text reports and clean CSV exports with timestamped headers for audits and parent-teacher meetings.
  - Sample data reloader with 24 realistic fictional students across varied performance tiers.

---

## 3. Technology Stack & Prerequisites
- **Language**: Java 17 or Java 21 (LTS)
- **GUI Toolkit**: JavaFX 21 (Controls, Charts, Graphics, Base)
- **Build & Dependency Management**: Apache Maven 3.8+
- **Architecture**: Model-View-Controller (MVC) + Service Layer pattern
- **Styling**: Programmatic CSS styling with Dark Navy Blue (`#1e293b` / `#0f172a`), Accent Blue (`#2563eb`), and accessible indicator palettes.

---

## 4. How to Run the JavaFX Desktop Application

### Prerequisites:
Ensure JDK 17 or JDK 21 and Apache Maven are installed on your machine:
```bash
java -version
mvn -version
```

### Running with Maven:
From the project root directory, run:
```bash
mvn clean compile javafx:run
```

### Packaging an Executable Fat JAR:
To build a standalone executable `.jar` file:
```bash
mvn clean package
```
The generated `.jar` file will be located in the `target/` directory:
```bash
java -jar target/student-performance-analytics-system-1.0.0.jar
```

---

## 5. Project Structure
```
├── pom.xml
├── README.md
├── PROJECT_REPORT.md
├── TESTING_CHECKLIST.md
└── src/main/java/com/spas/
    ├── MainApp.java                    # JavaFX Application Entry Point & Stage Setup
    ├── model/
    │   ├── Student.java                # Student Entity Model
    │   ├── Subject.java                # Subject & Grading Configuration Model
    │   ├── MarkRecord.java             # Assessment Marks & Score Record Model
    │   ├── AttendanceRecord.java       # Daily Attendance Record Model
    │   ├── AcademicAlert.java          # Support Alert Entity
    │   └── AppSettings.java            # Configurable Thresholds & Settings
    ├── service/
    │   ├── DataService.java            # In-memory Store & Repository Facade
    │   ├── StudentService.java         # Student Operations & Validations
    │   ├── SubjectService.java         # Subject Operations & Integrity Checks
    │   ├── MarksService.java           # Assessment Calculations & Bulk Entries
    │   ├── AttendanceService.java      # Attendance Aggregation & Rules
    │   ├── AnalyticsService.java       # Statistical Analysis, Trends & Rankings
    │   └── ReportService.java          # Report Generation & CSV Exporter
    ├── controller/
    │   ├── DashboardController.java    # Coordinates KPIs and Chart Updates
    │   ├── StudentController.java      # Coordinates Student CRUD & Filters
    │   ├── SubjectController.java      # Coordinates Subject Management
    │   ├── MarksController.java        # Coordinates Marks & Bulk Entry
    │   ├── AttendanceController.java   # Coordinates Daily Attendance Marking
    │   ├── AnalyticsController.java    # Coordinates Deep Analytics Filters
    │   ├── ReportsController.java      # Coordinates Report Generation
    │   └── SettingsController.java     # Coordinates Configuration & Resets
    ├── view/
    │   ├── MainLayout.java             # Master Layout (Header, Sidebar, Content, Status Bar)
    │   ├── DashboardView.java          # Dashboard UI & JavaFX Charts
    │   ├── StudentView.java            # Student TableView & Dialogs
    │   ├── SubjectView.java            # Subject TableView & Forms
    │   ├── MarksView.java              # Marks TableView & Bulk Grade Entry
    │   ├── AttendanceView.java         # Attendance Table & Class Register
    │   ├── StudentProfileView.java     # 360-degree Student Profile Modal
    │   ├── AnalyticsView.java          # Analytics Dashboards & Comparative Charts
    │   ├── ReportsView.java            # Report Center & CSV Downloader
    │   └── SettingsView.java           # Rules & System Configuration UI
    └── util/
        ├── AlertUtils.java             # JavaFX Dialog & Alert Wrappers
        ├── CsvUtils.java               # RFC-4180 Compliant CSV Parser & Formatter
        ├── SampleDataGenerator.java    # Realistic Sample Academic Dataset
        └── ValidationUtils.java        # Regex & Semantic Field Validators
```
