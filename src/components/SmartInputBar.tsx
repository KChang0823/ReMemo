import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '../store';
import { parseBedInput, cn } from '../utils';

export function SmartInputBar() {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const addTask = useStore((state) => state.addTask);

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const parsed = parseBedInput(input);
        if (!parsed) {
            setError('格式錯誤。請輸入：床號 任務內容 (例如：5a01 check K+)');
            return;
        }

        addTask(parsed.bed, parsed.task);
        setInput('');
        setError(null);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 px-4 py-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="5a01 check K+..."
                    className={cn(
                        'flex-1 bg-zinc-800 border rounded-xl px-4 py-3 text-lg',
                        'placeholder:text-zinc-500 focus:outline-none focus:ring-2',
                        'transition-all duration-200',
                        error
                            ? 'border-red-500 focus:ring-red-500/50'
                            : 'border-zinc-700 focus:ring-blue-500/50'
                    )}
                />
                <button
                    type="submit"
                    className={cn(
                        'bg-blue-600 hover:bg-blue-500 active:bg-blue-700',
                        'rounded-xl px-4 transition-colors duration-200',
                        'flex items-center justify-center'
                    )}
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
            {error && <p className="text-red-400 text-sm mt-2 px-1">{error}</p>}
        </div>
    );
}
