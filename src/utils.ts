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

    // Specific Regex from User:
    // Ward: Digit + [A-D]  (e.g., 3A)
    // Bed:  Double Digit + [A-D] (e.g., 04C)
    // Example: 3A04C

    // We look for this pattern ANYWHERE in the string to extract it?
    // User said: "In the future when organizing notes, this will be used".
    // "Scan content to see if it contains this format, if so extract metadata".

    // Let's make a regex that finds this specific token.
    // \b(\d+[A-D])(\d{2}[A-D])\b
    // But user example "3A04C" is concatenated.
    // Ward: 3A, Bed: 04C.

    const regex = /\b(\d+[A-Da-d])(\d{2}[A-Da-d])\b/;
    const match = trimmed.match(regex);

    if (!match) return null;

    const [fullMatch, ward, bedNum] = match;

    // Remaining task content is everything else?
    // Or just used for metadata extraction?
    // For now, let's keep the struct but just extract the bed info.

    return {
        bed: `${ward.toUpperCase()}-${bedNum.toUpperCase()}`,
        task: trimmed.replace(fullMatch, '').trim() || trimmed // If only bed ID, task is empty? Or keep original text?
        // Let's assume we remove the ID from the text if found, to clean it up?
        // Or keep it? User didn't specify. 
        // Plan says "extract as metadata".
        // Let's return the parsed bed components.
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
