export interface Task {
  id: string;
  content: string;
  isDone: boolean;
  createdAt: number;
}

export interface Bed {
  id: string;
  label: string;
  tasks: Task[];
}

export interface AppState {
  beds: Bed[];
  addBed: (label: string) => Bed;
  addTask: (bedLabel: string, content: string) => void;
  toggleTask: (bedId: string, taskId: string) => void;
  clearCompleted: (bedId: string) => void;
}
