import { useState } from 'react';
import { useStore } from '../store';
import { BedCard } from './BedCard';
import { TaskDrawer } from './TaskDrawer';
import type { Bed } from '../types';

export function BedGrid() {
    const beds = useStore((state) => state.beds);
    const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

    return (
        <>
            <div className="px-4 py-4">
                {beds.length === 0 ? (
                    <div className="text-center text-zinc-500 py-16">
                        <p className="text-lg mb-2">尚無床位</p>
                        <p className="text-sm">輸入任務來新增床位（例如：5a01 check K+）</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {beds.map((bed) => (
                            <BedCard
                                key={bed.id}
                                bed={bed}
                                onClick={() => setSelectedBed(bed)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedBed && (
                <TaskDrawer
                    bed={beds.find((b) => b.id === selectedBed.id) || selectedBed}
                    onClose={() => setSelectedBed(null)}
                />
            )}
        </>
    );
}
