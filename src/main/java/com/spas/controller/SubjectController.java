package com.spas.controller;

import com.spas.model.Subject;
import com.spas.service.SubjectService;
import javafx.collections.ObservableList;

import java.util.Optional;

/**
 * Controller mediating subject configuration and referential integrity.
 */
public class SubjectController {
    private final SubjectService subjectService;

    public SubjectController() {
        this.subjectService = new SubjectService();
    }

    public ObservableList<Subject> getSubjects() {
        return subjectService.getAllSubjects();
    }

    public Optional<Subject> findSubject(String id) {
        return subjectService.findById(id);
    }

    public boolean addSubject(Subject subject) {
        return subjectService.addSubject(subject);
    }

    public boolean updateSubject(Subject subject) {
        return subjectService.updateSubject(subject);
    }

    public boolean deleteSubject(String subjectId) {
        return subjectService.deleteSubject(subjectId);
    }
}
