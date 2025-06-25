import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";
import { tr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(timestamp: string | Date): string {
  try {
    const date =
      typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    return formatDistanceToNow(date, { addSuffix: true, locale: tr });
  } catch (error) {
    console.error("Invalid date for formatTimeAgo:", timestamp);
    return "bir süre önce";
  }
}
