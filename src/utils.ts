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
 *   "5A01A check K+"         -> { bed: "5A-01A", task: "check K+" }
 *   "12B05C wound dressing"  -> { bed: "12B-05C", task: "wound dressing" }
 *   "3A1B diet"              -> { bed: "3A-1B", task: "diet" }
 */
export function parseBedInput(input: string): ParsedBedInput | null {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Regex: Ward (Digits+Letter) + Bed (Digits+Letter) + Space + Task
    // Case insensitive for input convenience, though we normalize to uppercase
    const regex = /^(\d+[a-zA-Z])(\d+[a-zA-Z])\s+(.+)$/;
    const match = trimmed.match(regex);

    if (!match) return null;

    const [, ward, bed, task] = match;

    // Normalize
    const normalizedWard = ward.toUpperCase();
    const normalizedBed = bed.toUpperCase();

    // Reconstruct label: "5A-01A"
    return {
        bed: `${normalizedWard}-${normalizedBed}`,
        task: task.trim(),
    };
}

/**
 * Generate a unique ID
 */
export const generateId = () => Math.random().toString(36).substring(2, 9);

export const vibrate = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};

export const HAPTIC = {
    TAP: 5,
    SUCCESS: 15,
    ERROR: [50, 50, 50],
};
