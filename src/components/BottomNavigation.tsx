import { PlusSquare, LayoutGrid } from 'lucide-react';
import { cn } from '../utils';

type View = 'capture' | 'dashboard';

interface BottomNavigationProps {
    currentView: View;
    onViewChange: (view: View) => void;
}

export function BottomNavigation({ currentView, onViewChange }: BottomNavigationProps) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md shadow-lg border border-white/20 rounded-full p-2 pl-3 pr-3">
                <button
                    onClick={() => onViewChange('capture')}
                    className={cn(
                        "p-3 rounded-2xl transition-all duration-200 ease-out active:scale-95 group relative",
                        currentView === 'capture'
                            ? "bg-zinc-100 text-zinc-900 shadow-sm"
                            : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50/50"
                    )}
                >
                    <PlusSquare size={24} strokeWidth={currentView === 'capture' ? 2.5 : 2} />
                    {currentView === 'capture' && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    )}
                </button>

                <div className="w-px h-8 bg-zinc-200 mx-1" />

                <button
                    onClick={() => onViewChange('dashboard')}
                    className={cn(
                        "p-3 rounded-2xl transition-all duration-200 ease-out active:scale-95",
                        currentView === 'dashboard'
                            ? "bg-zinc-100 text-zinc-900 shadow-sm"
                            : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50/50"
                    )}
                >
                    <LayoutGrid size={24} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
                </button>
            </div>
        </div>
    );
}
