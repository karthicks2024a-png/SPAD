package com.spas.service;

import com.spas.model.Student;
import com.spas.util.ValidationUtils;
import javafx.collections.ObservableList;

import java.util.Optional;

/**
 * Service handling Student entity CRUD, searches, and validations.
 */
public class StudentService {
    private final DataService dataService;

    public StudentService() {
        this.dataService = DataService.getInstance();
    }

    public ObservableList<Student> getAllStudents() {
        return dataService.getStudents();
    }

    public Optional<Student> findById(String studentId) {
        return dataService.getStudents().stream()
                .filter(s -> s.getStudentId().equalsIgnoreCase(studentId))
                .findFirst();
    }

    public String validateStudent(Student s, boolean isNew) {
        if (!ValidationUtils.isNotEmpty(s.getStudentId())) {
            return "Student ID cannot be empty.";
        }
        if (!ValidationUtils.isNotEmpty(s.getFullName())) {
            return "Full Name cannot be empty.";
        }
        if (!ValidationUtils.isNotEmpty(s.getDepartment())) {
            return "Class / Department cannot be empty.";
        }
        if (!ValidationUtils.isNotEmpty(s.getSection())) {
            return "Section cannot be empty.";
        }
        if (!ValidationUtils.isValidEmail(s.getEmail())) {
            return "Invalid email address format.";
        }
        if (isNew && findById(s.getStudentId()).isPresent()) {
            return "Student ID '" + s.getStudentId() + "' already exists. IDs must be unique.";
        }
        return null;
    }

    public boolean addStudent(Student student) {
        String err = validateStudent(student, true);
        if (err != null) {
            throw new IllegalArgumentException(err);
        }
        dataService.getStudents().add(student);
        dataService.refreshAlerts();
        return true;
    }

    public boolean updateStudent(Student student) {
        String err = validateStudent(student, false);
        if (err != null) {
            throw new IllegalArgumentException(err);
        }
        for (int i = 0; i < dataService.getStudents().size(); i++) {
            if (dataService.getStudents().get(i).getStudentId().equalsIgnoreCase(student.getStudentId())) {
                dataService.getStudents().set(i, student);
                dataService.refreshAlerts();
                return true;
            }
        }
        return false;
    }

    public boolean deleteStudent(String studentId) {
        boolean removed = dataService.getStudents().removeIf(s -> s.getStudentId().equalsIgnoreCase(studentId));
        if (removed) {
            // Also clean up marks and attendance associated with deleted student
            dataService.getMarks().removeIf(m -> m.getStudentId().equalsIgnoreCase(studentId));
            dataService.getAttendance().removeIf(a -> a.getStudentId().equalsIgnoreCase(studentId));
            dataService.refreshAlerts();
        }
        return removed;
    }
}
