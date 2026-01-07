import type { Task } from '../types';
import { useStore } from '../store';
import { cn } from '../utils';
import { Check } from 'lucide-react';

interface TaskItemProps {
    bedId: string;
    task: Task;
}

export function TaskItem({ bedId, task }: TaskItemProps) {
    const toggleTask = useStore((state) => state.toggleTask);

    return (
        <button
            onClick={() => toggleTask(bedId, task.id)}
            className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl',
                'transition-all duration-200 text-left',
                task.isDone
                    ? 'bg-zinc-800/50 text-zinc-500'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
            )}
        >
            <div
                className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    'transition-all duration-200',
                    task.isDone
                        ? 'bg-green-600 border-green-600'
                        : 'border-zinc-500 hover:border-blue-500'
                )}
            >
                {task.isDone && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className={cn('flex-1', task.isDone && 'line-through')}>
                {task.content}
            </span>
        </button>
    );
}
