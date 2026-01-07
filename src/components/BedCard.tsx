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
                'relative w-full aspect-square rounded-2xl',
                'flex flex-col items-center justify-center gap-1',
                'transition-all duration-200 active:scale-95',
                'border-2',
                // Visual states
                isEmpty && 'bg-zinc-800/50 border-zinc-700 text-zinc-400',
                hasPending && 'bg-red-950/50 border-red-700 text-red-300',
                allDone && 'bg-green-950/50 border-green-700 text-green-300'
            )}
        >
            {/* Bed Label */}
            <span className="text-2xl font-bold tracking-tight">{bed.label}</span>

            {/* Task count indicator */}
            {!isEmpty && (
                <span className="text-xs opacity-75">
                    {completedTasks.length}/{bed.tasks.length} 完成
                </span>
            )}

            {/* Pending badge */}
            {hasPending && (
                <div
                    className={cn(
                        'absolute -top-2 -right-2 min-w-6 h-6 px-1.5',
                        'bg-red-600 rounded-full',
                        'flex items-center justify-center',
                        'text-sm font-semibold text-white',
                        'animate-pulse'
                    )}
                >
                    {pendingTasks.length}
                </div>
            )}
        </button>
    );
}
