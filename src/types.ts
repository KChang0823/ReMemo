export type TagType = 'bed' | 'drug' | 'test';

export type StreamItem =
  | { type: 'text'; value: string }
  | { type: 'capsule'; tag: TagType; value: string };

export interface Task {
  id: string;
  bedId?: string;
  patientName?: string;
  content: string;
  status: 'pending' | 'completed';
  priority: 'normal' | 'urgent';
  createdAt: number;
  dueTime?: string;
  // tags can be derived from content
}

export interface Bed {
  id: string;
  ward: string;
  number: string;
  status: 'occupied' | 'empty' | 'isolation';
  patient?: {
    name: string;
    diagnosis?: string;
    gender: 'M' | 'F';
    age: number;
  };
}
