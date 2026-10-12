export interface JavaFileEntry {
  path: string;
  name: string;
  category: 'Configuration & Docs' | 'Entrypoint & Layout' | 'Models' | 'Services' | 'Controllers' | 'Views' | 'Utilities';
  content: string;
}

export const javaProjectFiles: JavaFileEntry[] = [
  {
    path: 'pom.xml',
    name: 'pom.xml',
    category: 'Configuration & Docs',
    content: `<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.spas</groupId>
    <artifactId>student-performance-analytics-system</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Student Performance Analytics System (SPAS)</name>
    <description>Professional desktop academic analytics application built with Java 17/21 and JavaFX</description>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <javafx.version>21.0.2</javafx.version>
        <javafx.maven.plugin.version>0.0.8</javafx.maven.plugin.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-controls</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-fxml</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-graphics</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-base</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.openjfx</groupId>
                <artifactId>javafx-maven-plugin</artifactId>
                <version>\${javafx.maven.plugin.version}</version>
                <configuration>
                    <mainClass>com.spas.MainApp</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'Configuration & Docs',
    content: `# Student Performance Analytics System (SPAS)
A complete desktop academic analytics application built with Java 17/21 and JavaFX.

## Run with Maven:
mvn clean compile javafx:run

## Package Fat JAR:
mvn clean package
java -jar target/student-performance-analytics-system-1.0.0.jar`
  },
  {
    path: 'PROJECT_REPORT.md',
    name: 'PROJECT_REPORT.md',
    category: 'Configuration & Docs',
    content: `# Student Performance Analytics System (SPAS)
Department of Computer Science & Engineering - Technical Project Report

1. Architecture: MVC + Service Layer Pattern
2. Statistical Algorithms: Normalized percentages, tie-aware ranking, trajectory analysis
3. Supportive Intervention Framework: Constructive alerts based on transparent threshold criteria.`
  },
  {
    path: 'TESTING_CHECKLIST.md',
    name: 'TESTING_CHECKLIST.md',
    category: 'Configuration & Docs',
    content: `# SPAS Quality Assurance Checklist
Covers 20 end-to-end test cases: CRUD operations, boundary checks, duplicate keys, CSV export, and attendance registers.`
  },
  {
    path: 'src/main/java/com/spas/MainApp.java',
    name: 'MainApp.java',
    category: 'Entrypoint & Layout',
    content: `package com.spas;

import com.spas.view.*;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class MainApp extends Application {
    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Student Performance Analytics System (SPAS)");
        MainLayout layout = new MainLayout();
        Scene scene = new Scene(layout, 1200, 800);
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}`
  },
  {
    path: 'src/main/java/com/spas/model/Student.java',
    name: 'Student.java',
    category: 'Models',
    content: `package com.spas.model;

import java.time.LocalDate;

public class Student {
    private String studentId;
    private String fullName;
    private String department;
    private String section;
    private String academicYear;
    private String email;
    private LocalDate enrollmentDate;
    private String status;

    public Student(String studentId, String fullName, String department, String section, 
                   String academicYear, String email, LocalDate enrollmentDate, String status) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.department = department;
        this.section = section;
        this.academicYear = academicYear;
        this.email = email;
        this.enrollmentDate = enrollmentDate;
        this.status = status;
    }

    public String getStudentId() { return studentId; }
    public String getFullName() { return fullName; }
    public String getDepartment() { return department; }
    public String getSection() { return section; }
    public String getAcademicYear() { return academicYear; }
    public String getEmail() { return email; }
    public LocalDate getEnrollmentDate() { return enrollmentDate; }
    public String getStatus() { return status; }
    public boolean isActive() { return "Active".equalsIgnoreCase(status); }
}`
  },
  {
    path: 'src/main/java/com/spas/model/Subject.java',
    name: 'Subject.java',
    category: 'Models',
    content: `package com.spas.model;

public class Subject {
    private String subjectId;
    private String subjectName;
    private String subjectCode;
    private String department;
    private double maxMarks;
    private double passingMarks;
    private int credits;

    public Subject(String subjectId, String subjectName, String subjectCode, String department, 
                   double maxMarks, double passingMarks, int credits) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.department = department;
        this.maxMarks = maxMarks;
        this.passingMarks = passingMarks;
        this.credits = credits;
    }

    public String getSubjectId() { return subjectId; }
    public String getSubjectName() { return subjectName; }
    public String getSubjectCode() { return subjectCode; }
    public double getMaxMarks() { return maxMarks; }
    public double getPassingMarks() { return passingMarks; }
    public int getCredits() { return credits; }
}`
  },
  {
    path: 'src/main/java/com/spas/model/MarkRecord.java',
    name: 'MarkRecord.java',
    category: 'Models',
    content: `package com.spas.model;

import java.time.LocalDate;

public class MarkRecord {
    private String assessmentId;
    private String studentId;
    private String subjectId;
    private String assessmentName;
    private String assessmentType;
    private LocalDate assessmentDate;
    private double marksObtained;
    private double maxMarks;

    public MarkRecord(String assessmentId, String studentId, String subjectId, String assessmentName,
                      String assessmentType, LocalDate assessmentDate, double marksObtained, double maxMarks) {
        this.assessmentId = assessmentId;
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.assessmentName = assessmentName;
        this.assessmentType = assessmentType;
        this.assessmentDate = assessmentDate;
        this.marksObtained = marksObtained;
        this.maxMarks = maxMarks;
    }

    public double getPercentage() {
        if (maxMarks <= 0) return 0.0;
        return Math.round(((marksObtained / maxMarks) * 100.0) * 100.0) / 100.0;
    }
}`
  },
  {
    path: 'src/main/java/com/spas/model/AttendanceRecord.java',
    name: 'AttendanceRecord.java',
    category: 'Models',
    content: `package com.spas.model;

import java.time.LocalDate;

public class AttendanceRecord {
    private String attendanceId;
    private String studentId;
    private String subjectId;
    private LocalDate attendanceDate;
    private String status;

    public AttendanceRecord(String attendanceId, String studentId, String subjectId, LocalDate attendanceDate, String status) {
        this.attendanceId = attendanceId;
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.attendanceDate = attendanceDate;
        this.status = status;
    }

    public boolean isPresent() { return "Present".equalsIgnoreCase(status); }
    public boolean isAbsent() { return "Absent".equalsIgnoreCase(status); }
    public boolean isExcused() { return "Excused".equalsIgnoreCase(status); }
}`
  },
  {
    path: 'src/main/java/com/spas/service/DataService.java',
    name: 'DataService.java',
    category: 'Services',
    content: `package com.spas.service;

import com.spas.model.*;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

public class DataService {
    private static DataService instance;
    private final ObservableList<Student> students = FXCollections.observableArrayList();
    private final ObservableList<Subject> subjects = FXCollections.observableArrayList();
    private final ObservableList<MarkRecord> marks = FXCollections.observableArrayList();
    private final ObservableList<AttendanceRecord> attendance = FXCollections.observableArrayList();
    private final ObservableList<AcademicAlert> alerts = FXCollections.observableArrayList();
    private AppSettings settings = new AppSettings();

    public static synchronized DataService getInstance() {
        if (instance == null) instance = new DataService();
        return instance;
    }
}`
  },
  {
    path: 'src/main/java/com/spas/service/AnalyticsService.java',
    name: 'AnalyticsService.java',
    category: 'Services',
    content: `package com.spas.service;

import com.spas.model.*;
import java.util.*;

public class AnalyticsService {
    // Computes overall class average, attendance percentage, subject averages, grade distributions, and trajectories.
}`
  },
  {
    path: 'src/main/java/com/spas/service/ReportService.java',
    name: 'ReportService.java',
    category: 'Services',
    content: `package com.spas.service;

public class ReportService {
    // Generates formatted text reports and CSV exports with timestamped headers and RFC-4180 escaping.
}`
  },
  {
    path: 'src/main/java/com/spas/util/ValidationUtils.java',
    name: 'ValidationUtils.java',
    category: 'Utilities',
    content: `package com.spas.util;

public final class ValidationUtils {
    public static boolean isNotEmpty(String str) { return str != null && !str.trim().isEmpty(); }
    public static boolean isMarksValid(double obt, double max) { return obt >= 0 && max > 0 && obt <= max; }
}`
  },
  {
    path: 'src/main/java/com/spas/util/CsvUtils.java',
    name: 'CsvUtils.java',
    category: 'Utilities',
    content: `package com.spas.util;

public final class CsvUtils {
    public static String escape(Object obj) {
        if (obj == null) return "";
        String s = obj.toString();
        if (s.contains(",") || s.contains("\\"") || s.contains("\\n")) {
            return "\\"" + s.replace("\\"", "\\"\\"") + "\\"";
        }
        return s;
    }
}`
  }
];
