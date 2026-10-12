# Student Performance Analytics System (SPAS)
## Quality Assurance & Testing Checklist

Use this checklist during academic evaluation, defense, and regression testing.

| Test ID | Module | Test Scenario | Steps to Execute | Expected Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-01 | MainApp | Application Startup | Run `mvn javafx:run` | Main window launches centered with Dark Navy title bar, sidebar, and dashboard metrics loaded with sample data | [ ] |
| TC-02 | Navigation | Module Switching | Click each item in the left sidebar | Central view transitions smoothly to the selected module without flickering or memory leak | [ ] |
| TC-03 | Student Mgmt | Add Valid Student | Click "+ Add Student", fill ID "STU-999", Name "Alex Mercer", Class "CS-A", Section "1", Year "2024", Status "Active" | Student appears in TableView; record counter in status bar increments by 1 | [ ] |
| TC-04 | Student Mgmt | Duplicate ID Validation | Attempt adding another student with ID "STU-999" | Alert dialog displays: "Student ID already exists. IDs must be unique." | [ ] |
| TC-05 | Student Mgmt | Search & Filter | Type "Alex" in search box, filter by Class "CS-A" | Table updates in real-time showing only matching records; clears when reset | [ ] |
| TC-06 | Student Mgmt | Delete Student | Select student, click "Delete", confirm dialog | Student is removed from list; status bar updates; associated marks/attendance handled | [ ] |
| TC-07 | Subject Mgmt | Add Subject & Credit Check | Add Subject with Code "CS305", Credits 4, Max Marks 100, Pass Marks 40 | Subject saved; displayed in TableView | [ ] |
| TC-08 | Subject Mgmt | Referential Integrity Delete | Try deleting a subject that has marks recorded | Confirmation prevents deletion or warns that existing marks records are tied to it | [ ] |
| TC-09 | Marks Mgmt | Record Assessment Mark | Select student, subject, enter 85 out of 100 | Percentage auto-calculates to 85.0%, Status shows "PASS" in green | [ ] |
| TC-10 | Marks Mgmt | Score Boundary Validation | Enter marks obtained 105 with max marks 100 | Validation error prevents saving: "Marks obtained cannot exceed maximum marks" | [ ] |
| TC-11 | Marks Mgmt | Bulk Marks Entry | Open "Bulk Marks Entry", choose Exam & Subject, enter marks for class roster | Batch saves all records at once; TableView refreshes immediately | [ ] |
| TC-12 | Attendance | Daily Register Entry | Select Date and Class, mark students Present, Absent, Excused | Records saved; attendance percentages recalculate instantly | [ ] |
| TC-13 | Attendance | Attendance Threshold Alert | Set a student's attendance to 65% | Row highlights in warning amber/red; attendance counter reflects at-risk status | [ ] |
| TC-14 | Profile | 360° Academic Card | Double-click or select student and click "View Profile" | Detailed modal opens displaying subject scores, trend line chart, strongest & weakest subjects | [ ] |
| TC-15 | Analytics | Multi-Criteria Filtering | Filter by Academic Year, Class, and Subject | Bar charts, Line charts, and Scatter plots recalculate with the filtered subset | [ ] |
| TC-16 | Alerts | Support Rule Engine | Check students with score < 40% or attendance < 75% | Alerts displayed with high/medium severity, clear rationale, and action suggestion | [ ] |
| TC-17 | Reports | CSV & Text Export | Open Reports, select "Class Performance Report", click "Export CSV" | File is generated with timestamp, valid headers, and RFC-4180 escaped fields | [ ] |
| TC-18 | Settings | Threshold Adjustment | Change Attendance Warning Threshold from 75% to 80% | Dashboard and Academic Support module re-evaluate immediately | [ ] |
| TC-19 | Settings | Reset Sample Data | Click "Reload Sample Data" and confirm | Database resets to the 24 default diverse academic records | [ ] |
| TC-20 | Data I/O | Zero Division Prevention | Select student with 0 assessments or 0 countable attendance | UI displays "N/A" or "100% (No absences)" rather than `NaN` or dividing by zero | [ ] |
