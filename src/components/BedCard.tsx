import type { Bed } from '../types';
import { cn } from '../utils';

interface BedCardProps {
    bed: Bed;
    onClick: () => void;
}

export function BedCard({ bed, onClick }: BedCardProps) {
    const pendingTasks = bed.tasks.filter((t) => !t.isDone);
    const completedTasks = bed.tasks.filter((t) => t.isDone);

    // Determine visual state
    const isEmpty = bed.tasks.length === 0;
    const allDone = bed.tasks.length > 0 && pendingTasks.length === 0;
    const hasPending = pendingTasks.length > 0;

    return (
        <button
            onClick={onClick}
            className={cn(
                'relative w-full aspect-[4/3] rounded-2xl', // Changed aspect ratio to be slightly wider
                'flex flex-col items-start justify-between p-4', // Changed alignment
                'transition-all duration-200 active:scale-95 ease-out',
                'bg-white border text-left',
                'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]', // Premium shadow
                // Border logic
                isEmpty ? 'border-zinc-100' : 'border-zinc-200',
                hasPending && 'ring-1 ring-zinc-200'
            )}
        >
            {/* Top row: Label + Badge */}
            <div className="w-full flex items-center justify-between">
                <span className={cn(
                    "text-2xl font-bold tracking-tight",
                    isEmpty ? "text-zinc-300" : "text-zinc-900"
                )}>
                    {bed.label}
                </span>

                {hasPending && (
                    <div className="flex flex-col items-end">
                        <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full border border-rose-100">
                            {pendingTasks.length} 待辦
                        </span>
                    </div>
                )}

                {allDone && (
                    <span className="text-emerald-500 font-medium text-xs bg-emerald-50 px-2 py-0.5 rounded-full">
                        Fully Clear
                    </span>
                )}
            </div>

            {/* Bottom Content: Task Preview or Empty State */}
            <div className="w-full mt-2">
                {isEmpty ? (
                    <span className="text-xs text-zinc-300 font-medium">No tasks</span>
                ) : (
                    <div className="flex flex-col gap-1 w-full">
                        {/* Quick preview of first pending task or 'All done' */}
                        <div className="text-sm font-medium text-zinc-600 truncate w-full">
                            {hasPending ? pendingTasks[0].content : "All tasks completed"}
                        </div>

                        {/* Progress Bar for visual feedback */}
                        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mt-1">
                            <div
                                className={cn("h-full transition-all duration-500", allDone ? "bg-emerald-400" : "bg-zinc-900")}
                                style={{ width: `${(completedTasks.length / bed.tasks.length) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </button>
    );
}
