package com.spas.controller;

import com.spas.model.Student;
import com.spas.service.StudentService;
import javafx.collections.ObservableList;

import java.util.Optional;

/**
 * Controller mediating student operations and validation checks.
 */
public class StudentController {
    private final StudentService studentService;

    public StudentController() {
        this.studentService = new StudentService();
    }

    public ObservableList<Student> getStudents() {
        return studentService.getAllStudents();
    }

    public Optional<Student> findStudent(String id) {
        return studentService.findById(id);
    }

    public boolean addStudent(Student student) {
        return studentService.addStudent(student);
    }

    public boolean updateStudent(Student student) {
        return studentService.updateStudent(student);
    }

    public boolean deleteStudent(String studentId) {
        return studentService.deleteStudent(studentId);
    }
}
