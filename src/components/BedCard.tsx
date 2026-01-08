import { cn } from '../utils';
import type { Bed } from '../types';

export function BedCard({ bed }: { bed: Bed }) {
    const isOccupied = bed.status === 'occupied';
    const isIsolation = bed.status === 'isolation';

    // Status Indicator Color
    // Occupied: Blue, Isolation: Purple, Empty: Grey
    const statusColor = isIsolation ? "bg-purple-500" : isOccupied ? "bg-blue-500" : "bg-gray-600";
    const cardBg = isOccupied ? "bg-[#151C26] border-white/5" : "bg-transparent border-dashed border-gray-700";

    return (
        <div className={cn(
            "rounded-2xl p-4 flex flex-col justify-between border min-h-[120px] relative active:bg-[#1E2837] transition-colors",
            cardBg
        )}>
            {/* Header: Icon & Status */}
            <div className="flex justify-between items-start">
                <span className={cn(
                    "material-symbols-outlined text-2xl",
                    isOccupied ? "text-blue-400" : "text-gray-600"
                )}>
                    bed
                </span>
                <div className={cn("w-2 h-2 rounded-full", statusColor)} />
            </div>

            {/* Content: Bed No. & Patient */}
            <div className="mt-2">
                <h3 className="text-xl font-bold text-white tracking-wide">
                    {bed.ward}-{bed.number}
                </h3>
                {isOccupied && bed.patient ? (
                    <div className="mt-1">
                        <p className="text-sm text-gray-400 truncate">{bed.patient.diagnosis}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5" >(Pneumonia)</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600 mt-1">空床</p>
                )}
            </div>

            {isIsolation && (
                <span className="absolute bottom-2 right-2 text-[10px] bg-purple-900/40 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20">
                    Iso
                </span>
            )}
        </div>
    );
}
