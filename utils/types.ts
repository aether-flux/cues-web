export interface Task {
  id: number;
  title: string;
  description?: string;
  due?: string;
  priority?: 'Low' | 'Medium' | 'High';
  projectId: number;
  isDone: boolean;
  createdAt: string;
};

export interface Project {
  id: number;
  name: string;
  userId: string;
  createdAt: string;
};
