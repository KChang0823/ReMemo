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
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    'relative w-full max-w-lg bg-zinc-900 rounded-t-3xl',
                    'max-h-[80vh] flex flex-col',
                    'animate-slide-up'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                    <h2 className="text-xl font-semibold">
                        床位 <span className="text-blue-400">{bed.label}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {bed.tasks.length === 0 ? (
                        <p className="text-center text-zinc-500 py-8">尚無任務</p>
                    ) : (
                        <div className="space-y-2">
                            {bed.tasks.map((task) => (
                                <TaskItem key={task.id} bedId={bed.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {completedCount > 0 && (
                    <div className="px-4 py-4 border-t border-zinc-800">
                        <button
                            onClick={() => clearCompleted(bed.id)}
                            className={cn(
                                'w-full flex items-center justify-center gap-2',
                                'bg-red-600/20 hover:bg-red-600/30 text-red-400',
                                'py-3 rounded-xl transition-colors duration-200'
                            )}
                        >
                            <Trash2 className="w-4 h-4" />
                            清除已完成 ({completedCount})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
