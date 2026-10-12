package com.spas.controller;

import com.spas.model.MarkRecord;
import com.spas.service.MarksService;
import javafx.collections.ObservableList;

import java.util.List;

/**
 * Controller mediating assessment marks recording and batch grading.
 */
public class MarksController {
    private final MarksService marksService;

    public MarksController() {
        this.marksService = new MarksService();
    }

    public ObservableList<MarkRecord> getMarks() {
        return marksService.getAllMarks();
    }

    public boolean addMark(MarkRecord mark) {
        return marksService.addMark(mark);
    }

    public boolean updateMark(MarkRecord mark) {
        return marksService.updateMark(mark);
    }

    public boolean deleteMark(String assessmentId) {
        return marksService.deleteMark(assessmentId);
    }

    public int saveBulk(List<MarkRecord> records) {
        return marksService.saveBulkMarks(records);
    }
}
