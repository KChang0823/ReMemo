import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Bed, Task } from './types';
import { generateId } from './utils';

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            beds: [],

            addBed: (label: string): Bed => {
                const existingBed = get().beds.find((b) => b.label === label);
                if (existingBed) return existingBed;

                const newBed: Bed = {
                    id: generateId(),
                    label,
                    tasks: [],
                };

                set((state) => ({
                    beds: [...state.beds, newBed].sort((a, b) =>
                        a.label.localeCompare(b.label)
                    ),
                }));

                return newBed;
            },

            addTask: (bedLabel: string, content: string) => {
                // Ensure bed exists, create if not
                let bed = get().beds.find((b) => b.label === bedLabel);
                if (!bed) {
                    bed = get().addBed(bedLabel);
                }

                const newTask: Task = {
                    id: generateId(),
                    content,
                    isDone: false,
                    createdAt: Date.now(),
                };

                set((state) => ({
                    beds: state.beds.map((b) =>
                        b.label === bedLabel ? { ...b, tasks: [...b.tasks, newTask] } : b
                    ),
                }));
            },

            toggleTask: (bedId: string, taskId: string) => {
                set((state) => ({
                    beds: state.beds.map((bed) =>
                        bed.id === bedId
                            ? {
                                ...bed,
                                tasks: bed.tasks.map((task) =>
                                    task.id === taskId
                                        ? { ...task, isDone: !task.isDone }
                                        : task
                                ),
                            }
                            : bed
                    ),
                }));
            },

            clearCompleted: (bedId: string) => {
                set((state) => ({
                    beds: state.beds.map((bed) =>
                        bed.id === bedId
                            ? { ...bed, tasks: bed.tasks.filter((task) => !task.isDone) }
                            : bed
                    ),
                }));
            },
        }),
        {
            name: 'rememo-storage',
        }
    )
);
