import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { cn } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export function DashboardView() {
    const beds = useStore((state) => state.beds);
    const [filter, setFilter] = useState<'all' | 'urgent' | 'patient' | 'due'>('all');

    // Flatten and sort tasks
    const allTasks = useMemo(() => {
        return beds.flatMap(bed =>
            bed.tasks.map(task => ({
                ...task,
                bedLabel: bed.label,
                patientName: bed.patientName || 'Unknown',
                bedStatus: bed.status
            }))
        ).sort((a, b) => b.createdAt - a.createdAt);
    }, [beds]);

    const pendingTasks = allTasks.filter(t => !t.isDone);
    const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent');
    const normalTasks = pendingTasks.filter(t => t.priority !== 'urgent');



    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="shrink-0 pt-safe-top z-20 px-4 py-3 bg-background-light dark:bg-background-dark sticky top-0">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {format(new Date(), 'EEE, MMM d')}
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">任務清單</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">notifications</span>
                        </button>
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-200">
                            {/* Placeholder Avatar */}
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">DR</div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative group mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400">search</span>
                    </div>
                    <input
                        className="block w-full pl-10 pr-10 py-3 rounded-lg border-none bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary text-sm shadow-sm transition-shadow"
                        placeholder="搜尋病患、任務或床號..."
                        type="text"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                        <span className="material-symbols-outlined text-primary">mic</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-3 mb-4">
                    <div className="flex-1 bg-white dark:bg-surface-dark rounded-xl p-3 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{pendingTasks.length}</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">待辦事項 (Pending)</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-lg">assignment</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-surface-dark rounded-xl p-3 border border-red-100 dark:border-red-900/30 shadow-sm flex items-center justify-between relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-urgent"></div>
                        <div className="flex flex-col pl-2">
                            <span className="text-2xl font-bold text-urgent">{urgentTasks.length}</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">緊急任務 (Urgent)</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-urgent text-lg">priority_high</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {[
                        { id: 'all', label: '全部' },
                        { id: 'urgent', label: '緊急 (Urgent)' },
                        { id: 'patient', label: '病患 (Patient)' },
                        { id: 'due', label: '即將到期 (Due Soon)' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id as any)}
                            className={cn(
                                "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                                filter === f.id
                                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                                    : "bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Main Content (Task List) */}
            <main className="flex-1 overflow-y-auto px-4 pb-2 relative">
                <AnimatePresence mode="popLayout">
                    {/* Urgent Section */}
                    {urgentTasks.length > 0 && (filter === 'all' || filter === 'urgent') && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-6"
                        >
                            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 mt-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-urgent animate-pulse"></span>
                                Immediate / STAT
                            </h3>
                            {urgentTasks.map(task => (
                                <TaskCard key={task.id} task={task} isUrgent />
                            ))}
                        </motion.div>
                    )}

                    {/* Normal Section */}
                    {normalTasks.length > 0 && (filter === 'all' || filter === 'patient') && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-6"
                        >
                            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                To Do
                            </h3>
                            {normalTasks.map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </motion.div>
                    )}

                    {allTasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-gray-400"
                        >
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">task_alt</span>
                            <p>No tasks found</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function TaskCard({ task, isUrgent = false }: { task: any, isUrgent?: boolean }) {
    const toggleTask = useStore(state => state.toggleTask); // We need bedId for this...
    // Current toggleTask requires bedId. Our flattened task has it.

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "group relative bg-white dark:bg-surface-dark rounded-xl p-4 mb-3 shadow-sm transition-all border",
                isUrgent
                    ? "border-l-4 border-l-urgent border-y-transparent border-r-transparent"
                    : "border-gray-100 dark:border-gray-800"
            )}
        >
            <div className="flex items-start gap-3">
                <button
                    onClick={() => toggleTask(task.bedId, task.id)}
                    className={cn(
                        "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        task.isDone
                            ? "bg-primary border-primary text-white"
                            : "border-gray-300 dark:border-gray-600 hover:border-primary"
                    )}
                >
                    {task.isDone && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={cn(
                            "text-base font-semibold truncate pr-2 transition-all",
                            task.isDone ? "text-gray-400 line-through" : "text-gray-900 dark:text-gray-100"
                        )}>
                            {task.content}
                        </h4>
                        {isUrgent && !task.isDone && (
                            <span className="text-[10px] font-bold text-urgent bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded ml-2 whitespace-nowrap border border-red-100 dark:border-transparent">
                                STAT
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded font-bold font-mono",
                            isUrgent
                                ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                                : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        )}>
                            {task.bedLabel}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{task.patientName}</span>
                    </div>

                    {!task.isDone && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">
                            {/* Placeholder for description if we had one */}
                            Created at {format(task.createdAt, 'HH:mm')}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
