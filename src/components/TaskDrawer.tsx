import { X, Trash2 } from 'lucide-react';
import type { Bed } from '../types';
import { useStore } from '../store';
import { cn } from '../utils';
import { TaskItem } from './TaskItem';

interface TaskDrawerProps {
    bed: Bed;
    onClose: () => void;
}

export function TaskDrawer({ bed, onClose }: TaskDrawerProps) {
    const clearCompleted = useStore((state) => state.clearCompleted);
    const completedCount = bed.tasks.filter((t) => t.isDone).length;

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    'relative w-full max-w-lg bg-white rounded-t-[2rem] shadow-2xl',
                    'max-h-[85vh] flex flex-col',
                    'animate-slide-up pb-safe'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
                    <div>
                        <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Bed</span>
                        <h2 className="text-3xl font-bold text-zinc-900 mt-0.5">
                            {bed.label}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto px-5 py-6">
                    {bed.tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                            <p>No active tasks</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {bed.tasks.map((task) => (
                                <TaskItem key={task.id} bedId={bed.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {completedCount > 0 && (
                    <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/50">
                        <button
                            onClick={() => clearCompleted(bed.id)}
                            className={cn(
                                'w-full flex items-center justify-center gap-2',
                                'bg-white border border-zinc-200 shadow-sm text-zinc-600',
                                'hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200',
                                'py-3.5 rounded-xl transition-all duration-200 font-medium'
                            )}
                        >
                            <Trash2 className="w-5 h-5" />
                            Clear Completed ({completedCount})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
