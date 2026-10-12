package com.spas.service;

import com.spas.model.Subject;
import com.spas.util.ValidationUtils;
import javafx.collections.ObservableList;

import java.util.Optional;

/**
 * Service handling Subject entity CRUD, integrity checks, and validations.
 */
public class SubjectService {
    private final DataService dataService;

    public SubjectService() {
        this.dataService = DataService.getInstance();
    }

    public ObservableList<Subject> getAllSubjects() {
        return dataService.getSubjects();
    }

    public Optional<Subject> findById(String subjectId) {
        return dataService.getSubjects().stream()
                .filter(s -> s.getSubjectId().equalsIgnoreCase(subjectId))
                .findFirst();
    }

    public Optional<Subject> findByCode(String code) {
        return dataService.getSubjects().stream()
                .filter(s -> s.getSubjectCode().equalsIgnoreCase(code))
                .findFirst();
    }

    public String validateSubject(Subject subject, boolean isNew) {
        if (!ValidationUtils.isNotEmpty(subject.getSubjectId())) {
            return "Subject ID cannot be empty.";
        }
        if (!ValidationUtils.isNotEmpty(subject.getSubjectName())) {
            return "Subject Name cannot be empty.";
        }
        if (!ValidationUtils.isNotEmpty(subject.getSubjectCode())) {
            return "Subject Code cannot be empty.";
        }
        if (subject.getMaxMarks() <= 0) {
            return "Maximum marks must be greater than zero.";
        }
        if (subject.getPassingMarks() < 0 || subject.getPassingMarks() > subject.getMaxMarks()) {
            return "Passing marks must be between 0 and maximum marks.";
        }
        if (isNew) {
            if (findById(subject.getSubjectId()).isPresent()) {
                return "Subject ID '" + subject.getSubjectId() + "' already exists.";
            }
            if (findByCode(subject.getSubjectCode()).isPresent()) {
                return "Subject Code '" + subject.getSubjectCode() + "' already exists.";
            }
        }
        return null;
    }

    public boolean addSubject(Subject subject) {
        String err = validateSubject(subject, true);
        if (err != null) {
            throw new IllegalArgumentException(err);
        }
        dataService.getSubjects().add(subject);
        return true;
    }

    public boolean updateSubject(Subject subject) {
        String err = validateSubject(subject, false);
        if (err != null) {
            throw new IllegalArgumentException(err);
        }
        for (int i = 0; i < dataService.getSubjects().size(); i++) {
            if (dataService.getSubjects().get(i).getSubjectId().equalsIgnoreCase(subject.getSubjectId())) {
                dataService.getSubjects().set(i, subject);
                return true;
            }
        }
        return false;
    }

    public boolean hasAssociatedMarks(String subjectId) {
        return dataService.getMarks().stream()
                .anyMatch(m -> m.getSubjectId().equalsIgnoreCase(subjectId));
    }

    public boolean deleteSubject(String subjectId) {
        if (hasAssociatedMarks(subjectId)) {
            throw new IllegalStateException("Cannot delete subject: There are existing academic marks records associated with this subject.");
        }
        return dataService.getSubjects().removeIf(s -> s.getSubjectId().equalsIgnoreCase(subjectId));
    }
}
