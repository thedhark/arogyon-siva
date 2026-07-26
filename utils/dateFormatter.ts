/**
 * Centralized Date & Time Utility Functions for Arogyon Premium
 */

/**
 * Formats a Date/string/number into standard readable date: "25 Jul 2026"
 */
export const formatDisplayDate = (
  value: Date | string | number | null | undefined,
  fallback = 'N/A'
): string => {
  if (!value) return fallback;
  const date = new Date(value);
  if (isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formats a Date into a short readable date with day: "Mon, Aug 14" or "Aug 14"
 */
export const formatShortDate = (
  value: Date | string | number | null | undefined,
  includeDayName = false,
  fallback = 'N/A'
): string => {
  if (!value) return fallback;
  const date = new Date(value);
  if (isNaN(date.getTime())) return fallback;

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  if (includeDayName) {
    options.weekday = 'short';
  }

  return date.toLocaleDateString('en-US', options);
};

/**
 * Formats a Date into standard 12-hour time: "06:14 PM"
 */
export const formatTime = (
  value: Date | string | number | null | undefined,
  fallback = 'N/A'
): string => {
  if (!value) return fallback;
  const date = new Date(value);
  if (isNaN(date.getTime())) return fallback;

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Formats Date of Birth into ISO date format: "YYYY-MM-DD"
 */
export const formatDOB = (
  value: Date | string | number | null | undefined,
  fallback = ''
): string => {
  if (!value) return fallback;
  const date = new Date(value);
  if (isNaN(date.getTime())) return fallback;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Dynamically generates upcoming dates for appointment/slot selection
 */
export const getUpcomingDates = (count = 5): Array<{ id: string; date: string; day: string; rawDate: Date }> => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + i);

    const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    dates.push({
      id: String(i + 1),
      date: monthDay,
      day: dayName,
      rawDate: nextDate,
    });
  }

  return dates;
};
