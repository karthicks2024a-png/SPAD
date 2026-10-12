package com.spas.controller;

import com.spas.model.AppSettings;
import com.spas.service.DataService;

/**
 * Controller mediating configuration updates and sample data reset.
 */
public class SettingsController {
    private final DataService dataService;

    public SettingsController() {
        this.dataService = DataService.getInstance();
    }

    public AppSettings getSettings() {
        return dataService.getSettings();
    }

    public void updateSettings(AppSettings settings) {
        dataService.setSettings(settings);
    }

    public void resetSampleData() {
        dataService.loadSampleData();
    }
}
