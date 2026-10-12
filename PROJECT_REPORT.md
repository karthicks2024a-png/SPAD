# Student Performance Analytics System (SPAS)
## Academic Project Report & Technical Specification

**Author:** Department of Computer Science & Engineering  
**Version:** 1.0.0  
**Target Environment:** Java 17/21 LTS, JavaFX 21, Apache Maven  

---

### 1. Executive Summary & Objectives
Educational institutions face significant challenges in detecting academic decline early enough to intervene effectively. Traditional gradebooks provide raw numbers but lack automated correlation, trajectory modeling, and supportive intervention cues. 

The **Student Performance Analytics System (SPAS)** provides a desktop software platform designed specifically for academic coordinators, educators, and mentors. SPAS combines operational data entry (demographics, subjects, continuous assessments, and daily attendance) with automated statistical analytics, transparent pedagogical support alerts, and standardized report generation.

### 2. Architecture & Design Principles
SPAS adheres to clean architectural separation between User Interface, Controllers, Business Services, and Data Models:
1. **Model Layer (`com.spas.model`)**:
   Pure domain classes encapsulating state, JavaFX observable properties for reactive binding, data integrity constraints, and domain logic.
2. **Service Layer (`com.spas.service`)**:
   Stateless business logic executing statistical calculations, referential checks, rule evaluation, and file generation. `DataService` serves as the centralized in-memory transaction repository.
3. **Controller Layer (`com.spas.controller`)**:
   Mediates user events triggered from JavaFX views, invokes service methods, and updates observable lists.
4. **View Layer (`com.spas.view`)**:
   Programmatic JavaFX component construction without FXML or external CSS, guaranteeing 100% self-contained styling and predictable rendering across Linux, macOS, and Windows.
5. **Utility Layer (`com.spas.util`)**:
   Standardized validation logic, CSV string escaping complying with RFC-4180, mock data seeders, and unified dialog display handlers.

---

### 3. Key Calculation Policies & Algorithms

#### 3.1. Marks Percentage Calculation
$$\text{Percentage} = \left(\frac{\text{Marks Obtained}}{\text{Maximum Marks}}\right) \times 100$$
To guarantee precision, floating-point divisions are rounded to 2 decimal places using `Math.round(val * 100.0) / 100.0` or `BigDecimal.setScale(2, RoundingMode.HALF_UP)`.

#### 3.2. Student Overall Academic Average
To prevent exams with higher total marks (e.g., End-Semester 100 vs Quiz 20) from skewing or misrepresenting subject mastery, student performance is calculated as the arithmetic mean of normalized percentage scores across all evaluated assessments:
$$\text{Overall Average} = \frac{1}{N} \sum_{i=1}^{N} \text{Percentage}_i$$

#### 3.3. Attendance Percentage & Excused Absence Policy
Attendance tracking accounts for three states: **Present (P)**, **Absent (A)**, and **Excused (E)** (e.g., medical leave or sanctioned sports duty).
$$\text{Countable Sessions} = \text{Sessions Present} + \text{Sessions Absent}$$
$$\text{Attendance Percentage} = \begin{cases} 
\left(\frac{\text{Sessions Present}}{\text{Countable Sessions}}\right) \times 100, & \text{if } \text{Countable Sessions} > 0 \\
100.0\%, & \text{if } \text{Total Sessions} = 0 \text{ or all Excused}
\end{cases}$$
*Policy Justification:* Excused sessions are excluded from the denominator to avoid unfairly penalizing students with verified emergencies.

#### 3.4. Academic Trajectory & Trend Detection
Student performance between consecutive chronological assessments is evaluated. If a student's score in test $T_{n}$ is lower than $T_{n-1}$ by more than 10%, the system flags a "Declining Trajectory". If $T_{n} \ge T_{n-1} + 8\%$, an "Improving Trajectory" is identified.

#### 3.5. Fair Student Ranking Algorithm
Students are ranked in descending order based on their overall average percentage. In case of tied scores, students share the same rank (e.g., Rank 1, Rank 1, Rank 3) without arbitrarily favoring one student over another.

---

### 4. Ethical & Pedagogical Alert System
SPAS intentionally avoids labeling students as "weak", "failing", or "slow". Instead, alerts are framed as **Supportive Intervention Triggers**:
- **Critical Threshold**: Average score $< 40\%$ or Attendance $< 70\%$
- **Warning Threshold**: Average score between $40\%-50\%$ or Attendance between $70\%-75\%$
- **Suggested Follow-up**: Constructive actions (e.g., peer tutoring, counseling for attendance patterns, syllabus clarification sessions).

---

### 5. Limitations & Future Scope
- **Current Version**: In-memory data store with CSV import/export capabilities, ideal for single-user departmental desktop workstations.
- **Future Roadmap**: Integration with relational databases (PostgreSQL/Cloud SQL) for multi-user concurrent read/write, automated email dispatch for student reports, and PDF print formatting.
