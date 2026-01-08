import { motion, AnimatePresence } from 'framer-motion';
import { cn, vibrate, HAPTIC } from '../utils';
import { Delete } from 'lucide-react';

interface InputPadProps {
    visible: boolean;
    onWardClick: (ward: string) => void;
    onNumberClick: (num: string) => void;
    onDelete: () => void;
}

const WARDS = ['3A', '3B', '5A', '5B', '6A', '6B', '7A', '7B', '7C', '8A', 'ICU'];
const KEYS = [
    'A', '1', '2', '3',
    'B', '4', '5', '6',
    'C', '7', '8', '9',
    'D', '0', 'Del'
];

export function InputPad({ visible, onWardClick, onNumberClick, onDelete }: InputPadProps) {
    const handleWardClick = (ward: string) => {
        vibrate(HAPTIC.TAP);
        onWardClick(ward);
    };

    const handleKeyClick = (key: string) => {
        vibrate(HAPTIC.TAP);
        if (key === 'Del') {
            onDelete();
        } else {
            onNumberClick(key);
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 pb-safe z-40 shadow-xl"
                >
                    <div className="flex gap-4 h-64">
                        {/* Wards Column (Left) */}
                        <div className="w-1/3 flex flex-col gap-2 overflow-y-auto no-scrollbar">
                            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider text-center mb-1">
                                病房
                            </span>
                            {WARDS.map((ward) => (
                                <button
                                    key={ward}
                                    onClick={() => handleWardClick(ward)}
                                    className={cn(
                                        'flex-1 min-h-[3.5rem] rounded-xl font-bold text-lg',
                                        'bg-zinc-800 text-zinc-300',
                                        'active:bg-blue-600 active:text-white transition-colors duration-100'
                                    )}
                                >
                                    {ward}
                                </button>
                            ))}
                        </div>

                        {/* Custom Grid (Right) */}
                        <div className="flex-1 flex flex-col">
                            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider text-center mb-2">
                                床號輸入
                            </span>

                            <div className="flex-1 grid grid-cols-4 gap-2">
                                {KEYS.map((key) => {
                                    const isDel = key === 'Del';
                                    const isZero = key === '0';

                                    return (
                                        <button
                                            key={key}
                                            onClick={() => handleKeyClick(key)}
                                            className={cn(
                                                'rounded-2xl text-xl font-semibold',
                                                'transition-all duration-100 active:scale-95',
                                                isDel
                                                    ? 'bg-zinc-800/50 text-red-400 hover:bg-zinc-800'
                                                    : 'bg-zinc-800 text-zinc-100 active:bg-zinc-700',
                                                isZero && 'col-span-2',
                                                // Adjust text size for letters vs numbers if needed
                                                ['A', 'B', 'C', 'D'].includes(key) && 'text-blue-400'
                                            )}
                                        >
                                            {isDel ? <Delete className="w-6 h-6 mx-auto" /> : key}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
