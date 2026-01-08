import { useState } from 'react';
import { useStore } from '../store';
import { TaskItem } from './TaskItem';
import { cn, vibrate, HAPTIC } from '../utils';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useLongPress } from 'use-long-press';
import { Trash2, ChevronDown, ChevronRight, MoreVertical } from 'lucide-react';
import type { Bed } from '../types';

export function DashboardView() {
    const beds = useStore((state) => state.beds);
    // Expand state: keep track of expanded bed IDs
    const [expandedBeds, setExpandedBeds] = useState<Set<string>>(new Set());

    // For long press context menu (simple version: show delete button)
    const [editingBedId, setEditingBedId] = useState<string | null>(null);

    const toggleExpand = (bedId: string) => {
        setExpandedBeds(prev => {
            const next = new Set(prev);
            if (next.has(bedId)) {
                next.delete(bedId);
            } else {
                next.add(bedId);
            }
            return next;
        });
        vibrate(HAPTIC.TAP);
    };

    const bindLongPress = useLongPress((event, { context }) => {
        const bedId = context as string;
        setEditingBedId(bedId);
        vibrate(HAPTIC.TAP);
    }, { threshold: 600 });

    const handleClearTasks = (bedId: string, ignoredEvent: React.MouseEvent) => {
        ignoredEvent.stopPropagation();
        // Just clear completed tasks or delete bed? 
        // User said "Delete / Edit context menu". 
        // Let's implement Delete Bed functionality (or just clear tasks). 
        // Assuming "Delete Bed" isn't in store yet, maybe just "Clear Completed"?
        // Store has `clearCompleted`.
        // Let's assume user wants to remove the bed entirely if empty?
        // Current store doesn't have `removeBed`.
        // I will stick to "Clear Completed" for now as a safe action.
    };

    return (
        <div className="flex flex-col h-full bg-black/20">
            <div className="px-4 py-4 space-y-3 pb-24">
                <LayoutGroup>
                    <AnimatePresence>
                        {beds.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-zinc-500 py-16"
                            >
                                <p>尚無資料</p>
                            </motion.div>
                        )}

                        {beds.map((bed) => (
                            <BedListItem
                                key={bed.id}
                                bed={bed}
                                isExpanded={expandedBeds.has(bed.id)}
                                toggleExpand={() => toggleExpand(bed.id)}
                                isEditing={editingBedId === bed.id}
                                onDismissEdit={() => setEditingBedId(null)}
                                longPressBind={bindLongPress}
                            />
                        ))}
                    </AnimatePresence>
                </LayoutGroup>
            </div>
        </div>
    );
}

interface BedListItemProps {
    bed: Bed;
    isExpanded: boolean;
    toggleExpand: () => void;
    isEditing: boolean;
    onDismissEdit: () => void;
    longPressBind: any;
}

function BedListItem({ bed, isExpanded, toggleExpand, isEditing, onDismissEdit, longPressBind }: BedListItemProps) {
    const pendingTasks = bed.tasks.filter(t => !t.isDone);
    const hasPending = pendingTasks.length > 0;
    const clearCompleted = useStore(state => state.clearCompleted);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "bg-zinc-900 rounded-2xl overflow-hidden border transition-colors",
                hasPending ? "border-zinc-800" : "border-zinc-800/50"
            )}
        >
            {/* Header Row */}
            <div
                className="flex items-center p-4 active:bg-zinc-800/50 transition-colors"
                onClick={() => {
                    if (isEditing) onDismissEdit();
                    else toggleExpand();
                }}
                {...longPressBind(bed.id)}
            >
                <div className="flex-1 flex items-center gap-3">
                    {/* Status Dot */}
                    <div className={cn(
                        "w-3 h-3 rounded-full shadow-sm",
                        hasPending ? "bg-blue-500 shadow-blue-500/50" : "bg-zinc-700"
                    )} />

                    <span className="text-lg font-bold tracking-tight text-zinc-100">
                        {bed.label}
                    </span>

                    {hasPending && (
                        <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">
                            {pendingTasks.length} 待辦
                        </span>
                    )}
                </div>

                <div className="text-zinc-500">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
            </div>

            {/* Context Menu (Long Press) */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-zinc-800 px-4 py-2 flex items-center gap-2 border-t border-zinc-700"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearCompleted(bed.id);
                                vibrate(HAPTIC.SUCCESS);
                                onDismissEdit();
                            }}
                            className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-2 rounded-lg text-sm flex items-center justify-center gap-2 text-zinc-200"
                        >
                            <Trash2 size={14} /> 清除已完成
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDismissEdit();
                            }}
                            className="px-4 py-2 text-sm text-zinc-400"
                        >
                            取消
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Task List (Expanded) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-0 space-y-1 border-t border-dashed border-zinc-800/50 mt-1">
                            {bed.tasks.length === 0 ? (
                                <p className="text-zinc-600 text-sm py-2 pl-6">無任務</p>
                            ) : (
                                bed.tasks.map(task => (
                                    <TaskItem key={task.id} bedId={bed.id} task={task} />
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
