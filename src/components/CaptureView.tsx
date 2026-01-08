import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '../store';
import { parseBedInput, cn, vibrate, HAPTIC } from '../utils';
import { InputPad } from './InputPad';
import { BedGrid } from './BedGrid';

export function CaptureView() {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPadVisible, setIsPadVisible] = useState(true);
    const [isInputFocused, setIsInputFocused] = useState(false);

    // We use a ref to control the standard input element
    const inputRef = useRef<HTMLInputElement>(null);
    const addTask = useStore((state) => state.addTask);

    // Smart Handover Logic
    useEffect(() => {
        // Regex to detect if we have "Ward (Num+Let) + Bed (Num+Let)"
        // Example: "5A" + "01A" = "5A01A"
        // Regex: Digits+Letter + Digits+Letter
        const handoverRegex = /^(\d+[a-zA-Z])(\d+[a-zA-Z])$/;

        if (isPadVisible && handoverRegex.test(input)) {
            // Trigger Handover
            setIsPadVisible(false);

            // Add space for user convenience
            setInput((prev) => prev + ' ');

            // We need to wait for state update/render before focusing, 
            // but since isPadVisible toggles standard keyboard availability, 
            // we might want to focus immediately? 
            // Actually, if we focus while readOnly is true (implied by isPadVisible logic below), system keyboard doesn't show.
            // So we need to set readOnly false first.

            setTimeout(() => {
                inputRef.current?.focus();
            }, 10);
        }
    }, [input, isPadVisible]);

    const handleWardClick = (ward: string) => {
        setInput(ward);
        setError(null);
    };

    const handleNumberClick = (num: string) => {
        setInput((prev) => prev + num);
        setError(null);
    };

    const handleDelete = () => {
        setInput((prev) => prev.slice(0, -1));
    };

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();

        if (!input.trim()) {
            vibrate(HAPTIC.ERROR);
            return;
        }

        const parsed = parseBedInput(input);
        if (!parsed) {
            setError('格式：床號 任務 (例: 5A01 Check)');
            vibrate(HAPTIC.ERROR);
            return;
        }

        addTask(parsed.bed, parsed.task);
        vibrate(HAPTIC.SUCCESS);

        // Reset State
        setInput('');
        setError(null);
        setIsPadVisible(true);
        inputRef.current?.blur();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Manual focus handler: if user taps input, we might want to decide whether to show system keyboard or pad.
    // For now, let's say tapping input explicitly always allows system keyboard?
    // Or, enforces Pad if input is short? 
    // User requirement: "Main Input Field is focused visually, but read-only to system keyboard... until handover"
    // So we use `readOnly={isPadVisible}`.

    return (
        <div className="flex flex-col h-full relative">
            {/* Sticky Input Header */}
            <div className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 px-4 py-3">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        readOnly={isPadVisible}
                        // Helper: allow deleting even if readOnly? 
                        // DOM input readOnly usually blocks typing.
                        // We rely on Pad for typing in that state.
                        onChange={(e) => {
                            if (!isPadVisible) {
                                setInput(e.target.value);
                                setError(null);
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsInputFocused(true)} // Used for visual styling
                        onBlur={() => setIsInputFocused(false)}
                        placeholder="點擊下方選擇床號..."
                        className={cn(
                            'flex-1 bg-zinc-800 border rounded-xl px-4 py-3 text-lg',
                            'placeholder:text-zinc-600 focus:outline-none focus:ring-2',
                            'transition-all duration-200',
                            error
                                ? 'border-red-500 focus:ring-red-500/50'
                                : isInputFocused
                                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                                    : 'border-zinc-700'
                        )}
                    />
                    <button
                        type="submit"
                        className={cn(
                            'bg-blue-600 hover:bg-blue-500 active:bg-blue-700',
                            'rounded-xl px-4 transition-colors duration-200',
                            'flex items-center justify-center'
                        )}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                {error && <p className="text-red-400 text-sm mt-2 px-1 animate-pulse">{error}</p>}
            </div>

            {/* Main Content Area - Bed Grid */}
            <main className="flex-1 overflow-y-auto pb-64"> {/* Extra padding for Pad */}
                <BedGrid />
            </main>

            {/* Custom Input Pad */}
            <InputPad
                visible={isPadVisible}
                onWardClick={handleWardClick}
                onNumberClick={handleNumberClick}
                onDelete={handleDelete}
            />
        </div>
    );
}
