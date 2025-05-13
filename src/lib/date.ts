export function dateFormat(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  };

  const datePart = new Intl.DateTimeFormat("en-US", options).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart} at ${timePart}`;
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30.44); // Average days in a month
  const years = Math.round(days / 365.25); // Account for leap years

  if (seconds < 60) {
    return `${seconds}s ago`;
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else if (weeks < 4.345) {
    // Average weeks in a month
    return `${weeks}w ago`;
  } else if (months < 12) {
    return `${months}mo ago`;
  } else {
    return `${years}y ago`;
  }
}
export function formatMemberSince(date: Date | string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  const formattedDate = d.toLocaleDateString("en-US", options);
  return `Member since ${formattedDate}`;
}
export const getFormattedBlogDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString("en-US", {
    month: "short", // 'Apr'
    day: "numeric", // '9'
    year: "numeric", // '2025'
  });
};
