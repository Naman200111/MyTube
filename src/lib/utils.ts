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
