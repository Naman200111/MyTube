import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mergeClasses = (
  class1: string | undefined,
  class2?: string | undefined
) => {
  return `${class1 ? class1 : ""} ${class2 ? class2 : ""}`;
};

export const getFormattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const PMorAM = hours >= 12 ? "PM" : "AM";
  const twelveHoursFormatHour = hours % 12 || 12;

  return `${day}-${month}-${year} ${twelveHoursFormatHour}:${minutes} ${PMorAM}`;
};

export const getVideoTimeFromDuration = (duration: number = 0) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  if (hours) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
};

export const getSnakeCasing = (text: string) => {
  const words = text.split(" ");
  const snakeCasedString = "";
  const snakeCasedWords = words.map((word) => {
    return word[0]?.toUpperCase() + word.slice(1);
  });
  return snakeCasedString.concat(...snakeCasedWords.join(" "));
};

export const getLongFormDateFromDate = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getShortFormDateFromDate = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day; // Approximation
  const year = 365 * day; // Approximation

  if (diffInSeconds < minute) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < hour)
    return `${Math.floor(diffInSeconds / minute)} minutes ago`;
  if (diffInSeconds < day)
    return `${Math.floor(diffInSeconds / hour)} hours ago`;
  if (diffInSeconds < week)
    return `${Math.floor(diffInSeconds / day)} days ago`;
  if (diffInSeconds < month)
    return `${Math.floor(diffInSeconds / week)} weeks ago`;
  if (diffInSeconds < year)
    return `${Math.floor(diffInSeconds / month)} months ago`;
  return `${Math.floor(diffInSeconds / year)} years ago`;
};

export const getCountLongForm = (num: number) => {
  return num.toLocaleString("en-us");
};

export const getCountShortForm = (num: number) => {
  if (num >= 1e7) return (num / 1e7).toFixed(2).replace(/\.0$/, "") + " Cr";
  if (num >= 1e5) return (num / 1e5).toFixed(2).replace(/\.0$/, "") + " Lakh";
  if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.0$/, "") + " K";
  return num.toString();
};
