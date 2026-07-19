import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const BASE_URL = "http://127.0.0.1:8000";
  // export const BASE_URL = "https://youtubescriptagentbackend-production.up.railway.app";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 