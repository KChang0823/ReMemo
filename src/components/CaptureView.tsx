import { useRef, useState, useEffect } from 'react';
import { cn, vibrate, HAPTIC } from '../utils';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import type { StreamItem, TagType } from '../types';

export function CaptureView() {
    // 2. Component Needs State
    const [stream, setStream] = useState<StreamItem[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [activeTag, setActiveTag] = useState<TagType | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const addTask = useStore(state => state.addTask);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // 3. Interaction Logic - Tag Buttons
    const handleTagClick = (tag: TagType) => {
        vibrate(HAPTIC.TAP);

        // Toggle Logic: If clicking same tag, reset to null
        if (activeTag === tag) {
            setActiveTag(null);
        } else {
            // NEW: If there's existing text, save it as plain text first
            if (inputValue.trim()) {
                const newText: StreamItem = {
                    type: 'text',
                    value: inputValue.trim()
                };
                setStream(prev => [...prev, newText]);
                setInputValue(""); // Clear input for the new capsule
            }
            setActiveTag(tag);
        }

        inputRef.current?.focus();
    };

    // 3. Interaction Logic - Enter Key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Only Enter to confirm (Space removed to allow multi-word drug/test names)
        if (e.key === 'Enter') {
            e.preventDefault();

            if (!inputValue.trim()) return;

            if (activeTag) {
                // Scenario A: Tag Selected -> Create Capsule
                const newCapsule: StreamItem = {
                    type: 'capsule',
                    tag: activeTag,
                    value: inputValue.trim()
                };

                setStream(prev => [...prev, newCapsule]);
                setInputValue("");
                setActiveTag(null); // UX: Auto-reset to text mode
                vibrate(HAPTIC.SUCCESS);

            } else {
                // Scenario B: No Tag -> Create Text
                const newText: StreamItem = {
                    type: 'text',
                    value: inputValue
                };
                setStream(prev => [...prev, newText]);
                setInputValue("");
            }
        }

        // Escape to cancel active tag
        else if (e.key === 'Escape') {
            if (activeTag) {
                e.preventDefault();
                setActiveTag(null);
            }
        }

        // Backspace UX
        else if (e.key === 'Backspace' && inputValue === '') {
            // If active tag is on, turn it off first instead of deleting previous item
            if (activeTag) {
                e.preventDefault();
                setActiveTag(null);
                return;
            }

            if (stream.length > 0) {
                setStream(prev => prev.slice(0, -1));
            }
        }
    };

    const handleConfirm = () => {
        // If there is pending text, add it first
        let finalStream = [...stream];
        if (inputValue.trim()) {
            if (activeTag) {
                finalStream.push({ type: 'capsule', tag: activeTag, value: inputValue.trim() });
            } else {
                finalStream.push({ type: 'text', value: inputValue.trim() });
            }
        }

        if (finalStream.length === 0) return;

        addTask(finalStream);
        vibrate(HAPTIC.SUCCESS);

        // Reset All
        setStream([]);
        setInputValue("");
        setActiveTag(null);
    };



    return (
        <div className="flex flex-col h-full bg-background-dark relative leading-relaxed">
            {/* Header */}
            <div className="flex items-center justify-center py-4 shrink-0 border-b border-white/5">
                <span className="font-bold text-white">快速筆記</span>
            </div>

            {/* 4. Rendering - Stream Display */}
            <div className="flex-1 px-5 py-4 overflow-y-auto flex flex-wrap content-start items-center gap-2">
                <AnimatePresence mode="popLayout">
                    {stream.map((item, index) => {
                        if (item.type === 'capsule') {
                            const isBed = item.tag === 'bed';
                            const isDrug = item.tag === 'drug';
                            const isTest = item.tag === 'test';

                            return (
                                <motion.span
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
                                    transition={{ type: "spring", stiffness: 500, damping: 25, mass: 1 }}
                                    key={`capsule-${index}`}
                                    className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm select-none",
                                        isBed && "bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/50",
                                        isDrug && "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/50",
                                        isTest && "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/50"
                                    )}
                                >
                                    {isBed && <span className="material-symbols-outlined text-[16px]">bed</span>}
                                    {isDrug && <span className="material-symbols-outlined text-[16px]">pill</span>}
                                    {isTest && <span className="material-symbols-outlined text-[16px]">science</span>}
                                    <span>{item.value}</span>
                                </motion.span>
                            );
                        } else {
                            return (
                                <motion.span
                                    layout
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    key={`text-${index}`}
                                    className="text-lg text-gray-200"
                                >
                                    {item.value}
                                </motion.span>
                            );
                        }
                    })}
                </AnimatePresence>

                {activeTag ? (
                    <div
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ring-1 transition-colors max-w-full", // Restored gap-1.5, px-3, rounded-full
                            activeTag === 'bed' && "bg-teal-500/10 text-teal-400 ring-teal-500/50",
                            activeTag === 'drug' && "bg-blue-500/10 text-blue-400 ring-blue-500/50",
                            activeTag === 'test' && "bg-purple-500/10 text-purple-400 ring-purple-500/50"
                        )}
                    >
                        {/* Icon */}
                        {activeTag === 'bed' && <span className="material-symbols-outlined text-[16px] shrink-0 self-start mt-0.5">bed</span>}
                        {activeTag === 'drug' && <span className="material-symbols-outlined text-[16px] shrink-0 self-start mt-0.5">pill</span>}
                        {activeTag === 'test' && <span className="material-symbols-outlined text-[16px] shrink-0 self-start mt-0.5">science</span>}

                        <div className="relative grid items-center min-w-[1px] max-w-full"> {/* Removed max-w 200px, used full */}
                            {/* Hidden span to measure width/height */}
                            <span className="col-start-1 row-start-1 invisible whitespace-pre-wrap break-all px-0.5 text-inherit font-bold">
                                {inputValue || ""}
                            </span>

                            <textarea
                                ref={inputRef as any}
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown as any}
                                placeholder=""
                                rows={1}
                                className="col-start-1 row-start-1 w-full bg-transparent border-none outline-none text-inherit font-bold p-0 resize-none overflow-hidden"
                                autoFocus
                            />
                        </div>
                    </div>
                ) : (
                    <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={stream.length === 0 ? "輸入記事..." : "接著輸入..."}
                        className="bg-transparent border-none outline-none text-lg min-w-[120px] flex-1 text-gray-300 placeholder:text-gray-600 transition-all"
                        autoFocus
                    />
                )}
            </div>

            {/* Bottom Controls */}
            <div className="pb-safe-bottom bg-[#151C26] border-t border-white/5 pt-3">

                {/* 3. Tag Buttons */}
                <div className="flex gap-3 px-5 py-2 overflow-x-auto no-scrollbar mb-2">
                    {[
                        { id: 'bed', icon: 'bed', label: '床號' },
                        { id: 'drug', icon: 'pill', label: '藥物' },
                        { id: 'test', icon: 'science', label: '檢驗' },
                    ].map(tag => {
                        const isActive = activeTag === tag.id;

                        // Define custom colors for active state
                        const activeStyle =
                            tag.id === 'bed' ? "bg-teal-500 border-teal-500 text-teal-950 shadow-teal-500/20" :
                                tag.id === 'drug' ? "bg-blue-500 border-blue-500 text-blue-950 shadow-blue-500/20" :
                                    "bg-purple-500 border-purple-500 text-purple-950 shadow-purple-500/20"; // test

                        const iconColor =
                            !isActive && tag.id === 'bed' ? "text-teal-400" :
                                !isActive && tag.id === 'drug' ? "text-blue-400" :
                                    !isActive && tag.id === 'test' ? "text-purple-400" :
                                        "text-current";

                        return (
                            <button
                                key={tag.id}
                                onClick={() => handleTagClick(tag.id as TagType)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 active:scale-95",
                                    isActive
                                        ? cn(activeStyle, "shadow-lg translate-y-[-2px]")
                                        : "bg-[#1E2837] border-white/5 hover:bg-[#2A3648]"
                                )}
                            >
                                <span className={cn(
                                    "material-symbols-outlined text-[20px]",
                                    isActive && "animate-pulse",
                                    iconColor
                                )}>
                                    {tag.icon}
                                </span>
                                <span className={cn(
                                    "text-sm font-bold tracking-wide",
                                    !isActive && "text-gray-400"
                                )}>{tag.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Confirm Button */}
                <div className="px-5 pb-5">
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-primary hover:bg-blue-600 text-white font-bold text-lg py-3.5 rounded-xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                    >
                        <span>確認送出</span>
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
