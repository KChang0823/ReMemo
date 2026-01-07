import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ParsedBedInput {
    bed: string;
    task: string;
}

/**
 * Parse bed input string into bed label and task content
 * Examples:
 *   "5a01 k 3.0"             -> { bed: "05A-01", task: "k 3.0" }
 *   "12b05 wound dressing"   -> { bed: "12B-05", task: "wound dressing" }
 *   "1a1 check K+"           -> { bed: "01A-01", task: "check K+" }
 */
export function parseBedInput(input: string): ParsedBedInput | null {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Regex: captures bed number pattern at the start
    // Format: 1-2 digits + letter + 1-2 digits, followed by space and task content
    const regex = /^(\d{1,2})([a-zA-Z])(\d{1,2})\s+(.+)$/;
    const match = trimmed.match(regex);

    if (!match) return null;

    const [, ward, section, bed, task] = match;

    // Normalize to format: 00A-00
    const normalizedWard = ward.padStart(2, '0');
    const normalizedSection = section.toUpperCase();
    const normalizedBed = bed.padStart(2, '0');

    return {
        bed: `${normalizedWard}${normalizedSection}-${normalizedBed}`,
        task: task.trim(),
    };
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
