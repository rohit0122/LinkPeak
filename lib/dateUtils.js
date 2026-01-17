
/**
 * Global Date Utilities
 * Centralized formatting to ensure consistent date/time display across the app.
 * Handles UTC strings from server and converts to user's local time.
 */

// Default configuration for dates (e.g., "January 1, 2024")
const DEFAULT_DATE_OPTIONS = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

// Default configuration for date + time (e.g., "January 1, 2024 at 10:30 AM")
const DEFAULT_DATETIME_OPTIONS = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
};

/**
 * Parses a date string and returns a Date object.
 * Handles SQL timestamps (YYYY-MM-DD HH:MM:SS) by appending 'Z' if missing
 * to force UTC interpretation, assuming the server will communicate in UTC.
 */
const parseDate = (dateString) => {
    if (!dateString) return null;

    // If it's already a Date object
    if (dateString instanceof Date) return dateString;

    let parsableDate = dateString;

    // If it looks like a SQL timestamp without timezone info (e.g., "2024-01-15 12:00:00")
    // We treat it as UTC by appending 'Z' or replacing space with 'T' and appending 'Z'
    // This is based on the user's plan to send UTC from server.
    if (typeof dateString === 'string') {
        // Check for "YYYY-MM-DD HH:MM:SS" format
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
            parsableDate = dateString.replace(' ', 'T') + 'Z';
        }
    }

    const date = new Date(parsableDate);
    return isNaN(date.getTime()) ? null : date;
};

/**
 * Formats a date string to specific format options.
 * Defaults to "Month DD, YYYY"
 */
export const formatDate = (dateString, options = {}) => {
    const date = parseDate(dateString);
    if (!date) return dateString || 'N/A'; // Fallback to original string or N/A

    try {
        return new Intl.DateTimeFormat('en-US', { ...DEFAULT_DATE_OPTIONS, ...options }).format(date);
    } catch (error) {
        console.error("Date formatting error", error);
        return dateString;
    }
};

/**
 * Formats a date string to include time.
 * "Month DD, YYYY at HH:MM AM/PM"
 */
export const formatDateTime = (dateString, options = {}) => {
    const date = parseDate(dateString);
    if (!date) return dateString || 'N/A';

    try {
        return new Intl.DateTimeFormat('en-US', { ...DEFAULT_DATETIME_OPTIONS, ...options }).format(date);
    } catch (error) {
        return dateString;
    }
};

/**
 * Returns relative time (e.g., "2 days ago")
 * Uses Intl.RelativeTimeFormat if applicable, or simple fallback
 */
export const formatRelativeTime = (dateString) => {
    const date = parseDate(dateString);
    if (!date) return 'N/A';

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    // Simple relative formatter
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(dateString, { month: 'short', day: 'numeric' });
};
