package com.spas.util;

import java.util.regex.Pattern;

/**
 * Utility class providing validation helpers across forms.
 */
public final class ValidationUtils {
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"
    );

    private ValidationUtils() {}

    public static boolean isNotEmpty(String str) {
        return str != null && !str.trim().isEmpty();
    }

    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return true; // Optional field
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static boolean isPositiveNumber(double value) {
        return value > 0;
    }

    public static boolean isNonNegativeNumber(double value) {
        return value >= 0;
    }

    public static boolean isMarksValid(double marksObtained, double maxMarks) {
        return marksObtained >= 0 && maxMarks > 0 && marksObtained <= maxMarks;
    }
}
