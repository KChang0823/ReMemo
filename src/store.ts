import { create } from 'zustand';
import type { Task, Bed, StreamItem } from './types';

interface AppState {
    tasks: Task[];
    beds: Bed[]; // Added beds
    addTask: (stream: StreamItem[]) => void;
    toggleTask: (taskId: string) => void; // Added toggleTask
}

const MOCK_BEDS: Bed[] = [
    {
        id: '05B',
        ward: '05',
        number: 'B',
        status: 'occupied',
        patient: {
            name: '林小姐 (Lin)',
            diagnosis: 'Pneumonia',
            gender: 'F',
            age: 65
        }
    },
    {
        id: '18A',
        ward: '18',
        number: 'A',
        status: 'occupied',
        patient: {
            name: '陳先生 (Chen)',
            diagnosis: 'Stroke',
            gender: 'M',
            age: 72
        }
    },
    {
        id: '12A',
        ward: '12',
        number: 'A',
        status: 'occupied',
        patient: {
            name: '王小明 (Wang)',
            diagnosis: 'Appendicitis',
            gender: 'M',
            age: 25
        }
    },
    {
        id: '03C',
        ward: '03',
        number: 'C',
        status: 'isolation',
        patient: {
            name: '吳太太 (Wu)',
            diagnosis: 'COVID-19',
            gender: 'F',
            age: 55
        }
    },
    {
        id: '01A',
        ward: '01',
        number: 'A',
        status: 'empty'
    }
];

const MOCK_TASKS: Task[] = [
    {
        id: '1',
        bedId: '05B',
        patientName: '林小姐 (Lin)',
        content: '動脈血氣分析 (ABG) - SpO2 dropping to 92%, please re-check ABG...',
        status: 'pending',
        priority: 'urgent',
        createdAt: Date.now() - 1000 * 60 * 10,
        dueTime: '10m ago'
    },
    {
        id: '2',
        bedId: '18A',
        patientName: '陳先生 (Chen)',
        content: '簽署同意書 (Consent) - CT scan contrast consent needed before 11:00 AM.',
        status: 'pending',
        priority: 'urgent',
        createdAt: Date.now(),
        dueTime: 'Now'
    },
    {
        id: '3',
        bedId: '12A',
        patientName: '王小明 (Wang)',
        content: '開立抗生素 (Prescribe) - Adjust Tazocin dose based on renal function.',
        status: 'pending',
        priority: 'normal',
        createdAt: Date.now(),
        dueTime: '14:00'
    },
    {
        id: '4',
        bedId: '03C',
        patientName: '吳太太 (Wu)',
        content: '照會心臟科 (Cardio Consult) - Regarding new onset Atrial Fibrillation.',
        status: 'pending',
        priority: 'normal',
        createdAt: Date.now(),
        dueTime: '16:00'
    }
];

export const useStore = create<AppState>((set) => ({
    tasks: MOCK_TASKS,
    beds: MOCK_BEDS,
    addTask: (stream: StreamItem[]) => {
        // Parse stream to Task
        // Fix: Use type guard for capsule
        const bedItem = stream.find(s => s.type === 'capsule' && s.tag === 'bed');

        // Construct content from stream items
        const content = stream.map(s => {
            if (s.type === 'capsule') return `[${s.value}]`;
            return s.value;
        }).join(' ').trim();

        const newTask: Task = {
            id: Date.now().toString(),
            bedId: bedItem ? bedItem.value : undefined,
            patientName: 'Unknown', // In real app, look up Patient by Bed ID
            content: content,
            status: 'pending',
            priority: 'normal',
            createdAt: Date.now(),
            dueTime: 'Just now'
        };

        set((state) => ({
            tasks: [newTask, ...state.tasks]
        }));
    },
    toggleTask: (taskId: string) => {
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === taskId
                    ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
                    : t
            )
        }));
    }
}));
