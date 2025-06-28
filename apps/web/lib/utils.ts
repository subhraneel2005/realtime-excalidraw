import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanToken(rawToken: string): string {
  if (rawToken.endsWith("=")) {
    return rawToken.slice(0, -1) + "%3D";
  }
  return rawToken;
}
