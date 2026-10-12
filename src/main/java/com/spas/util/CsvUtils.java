package com.spas.util;

import java.util.ArrayList;
import java.util.List;

/**
 * Standard RFC-4180 compliant CSV utility for escaping, quoting, and formatting.
 */
public final class CsvUtils {
    private CsvUtils() {}

    /**
     * Escapes a single CSV cell value according to RFC-4180.
     */
    public static String escape(Object obj) {
        if (obj == null) return "";
        String value = obj.toString();
        boolean mustQuote = value.contains(",") || value.contains("\"") || value.contains("\n") || value.contains("\r");
        if (mustQuote) {
            value = value.replace("\"", "\"\"");
            return "\"" + value + "\"";
        }
        return value;
    }

    /**
     * Builds a single CSV line from values.
     */
    public static String toCsvLine(Object... values) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < values.length; i++) {
            sb.append(escape(values[i]));
            if (i < values.length - 1) {
                sb.append(",");
            }
        }
        return sb.toString();
    }

    /**
     * Simple parser for a single CSV row handling quotes.
     */
    public static List<String> parseLine(String line) {
        List<String> tokens = new ArrayList<>();
        if (line == null) return tokens;

        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '\"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '\"') {
                    sb.append('\"');
                    i++; // skip escaped quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                tokens.add(sb.toString().trim());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        tokens.add(sb.toString().trim());
        return tokens;
    }
}
