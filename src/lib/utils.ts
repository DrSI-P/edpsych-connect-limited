import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, then merges Tailwind CSS classes.
 * This is particularly useful for conditional and dynamic class names in components.
 * 
 * @param inputs - Class names to be merged
 * @returns A string of merged class names optimized for Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}