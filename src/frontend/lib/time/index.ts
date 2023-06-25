import { format, formatDistanceToNow } from "date-fns";

export function formatTime(time: Date, type?: "L" | "G"): string {
  if (!time) {
    return "N/A";
  }
  if (type === "L") {
    return format(time, "do MMM yyyy, h:mm aa");
  }
  if (type === "G") {
    return format(time, "do MMM yyyy");
  }
  return format(time, "MMMM do, yyyy");
}

export function timeAgo(time: Date): string {
  if (!time) {
    return "";
  }
  return `${formatDistanceToNow(time)} ago`;
}
