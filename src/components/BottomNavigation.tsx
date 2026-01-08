import { cn, vibrate, HAPTIC } from '../utils';

export type Tab = 'tasks' | 'add' | 'patients';

interface BottomNavigationProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
    const navItems: { id: Tab; icon: string; label: string }[] = [
        { id: 'tasks', icon: 'check_circle', label: '任務' },
        { id: 'add', icon: 'add_circle', label: '新增' },
        { id: 'patients', icon: 'ward', label: '病患' },
    ];

    return (
        <nav className="shrink-0 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pb-safe-bottom z-50">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onTabChange(item.id);
                                vibrate(HAPTIC.TAP);
                            }}
                            className="flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform"
                        >
                            <span className={cn(
                                "material-symbols-outlined text-2xl transition-colors",
                                isActive ? "text-primary" : "text-gray-400 dark:text-gray-500"
                            )}>
                                {item.icon}
                            </span>
                            <span className={cn(
                                "text-[10px] font-medium transition-colors",
                                isActive ? "text-primary" : "text-gray-400 dark:text-gray-500"
                            )}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
