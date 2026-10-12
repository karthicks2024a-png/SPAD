package com.spas.service;

import com.spas.model.MarkRecord;
import com.spas.model.Student;
import com.spas.model.Subject;
import com.spas.util.ValidationUtils;
import javafx.collections.ObservableList;

import java.util.List;
import java.util.Optional;

/**
 * Service handling Assessment Mark records, validations, and bulk entry.
 */
public class MarksService {
    private final DataService dataService;

    public MarksService() {
        this.dataService = DataService.getInstance();
    }

    public ObservableList<MarkRecord> getAllMarks() {
        return dataService.getMarks();
    }

    public Optional<MarkRecord> findById(String id) {
        return dataService.getMarks().stream()
                .filter(m -> m.getAssessmentId().equalsIgnoreCase(id))
                .findFirst();
    }

    public String validateMarkRecord(MarkRecord record, boolean isNew) {
        if (!ValidationUtils.isNotEmpty(record.getAssessmentId())) {
            return "Assessment ID cannot be empty.";
        }
        if (!ValidationUtils.isNotEmpty(record.getStudentId())) {
            return "Student must be selected.";
        }
        if (!ValidationUtils.isNotEmpty(record.getSubjectId())) {
            return "Subject must be selected.";
        }
        if (!ValidationUtils.isNotEmpty(record.getAssessmentName())) {
            return "Assessment Name cannot be empty.";
        }
        if (!ValidationUtils.isNotEmpty(record.getAssessmentType())) {
            return "Assessment Type cannot be empty.";
        }
        if (!ValidationUtils.isMarksValid(record.getMarksObtained(), record.getMaxMarks())) {
            return "Marks obtained must be between 0 and maximum marks (" + record.getMaxMarks() + ").";
        }

        // Check for duplicate record for same student, subject, and assessment name
        boolean duplicate = dataService.getMarks().stream()
                .anyMatch(m -> !m.getAssessmentId().equalsIgnoreCase(record.getAssessmentId())
                        && m.getStudentId().equalsIgnoreCase(record.getStudentId())
                        && m.getSubjectId().equalsIgnoreCase(record.getSubjectId())
                        && m.getAssessmentName().equalsIgnoreCase(record.getAssessmentName()));
        if (duplicate) {
            return "A mark record for this student, subject, and assessment name already exists.";
        }

        return null;
    }

    public boolean addMark(MarkRecord record) {
        String err = validateMarkRecord(record, true);
        if (err != null) {
            throw new IllegalArgumentException(err);
        }
        dataService.getMarks().add(record);
        dataService.refreshAlerts();
        return true;
    }

    public boolean updateMark(MarkRecord record) {
        String err = validateMarkRecord(record, false);
        if (err != null) {
            throw new IllegalArgumentException(err);
        }
        for (int i = 0; i < dataService.getMarks().size(); i++) {
            if (dataService.getMarks().get(i).getAssessmentId().equalsIgnoreCase(record.getAssessmentId())) {
                dataService.getMarks().set(i, record);
                dataService.refreshAlerts();
                return true;
            }
        }
        return false;
    }

    public boolean deleteMark(String assessmentId) {
        boolean removed = dataService.getMarks().removeIf(m -> m.getAssessmentId().equalsIgnoreCase(assessmentId));
        if (removed) {
            dataService.refreshAlerts();
        }
        return removed;
    }

    /**
     * Bulk save marks for an assessment session.
     */
    public int saveBulkMarks(List<MarkRecord> records) {
        int count = 0;
        for (MarkRecord rec : records) {
            // Update or add
            Optional<MarkRecord> existing = dataService.getMarks().stream()
                    .filter(m -> m.getStudentId().equalsIgnoreCase(rec.getStudentId())
                            && m.getSubjectId().equalsIgnoreCase(rec.getSubjectId())
                            && m.getAssessmentName().equalsIgnoreCase(rec.getAssessmentName()))
                    .findFirst();
            if (existing.isPresent()) {
                existing.get().setMarksObtained(rec.getMarksObtained());
                existing.get().setMaxMarks(rec.getMaxMarks());
                existing.get().setAssessmentDate(rec.getAssessmentDate());
            } else {
                dataService.getMarks().add(rec);
            }
            count++;
        }
        dataService.refreshAlerts();
        return count;
    }
}
