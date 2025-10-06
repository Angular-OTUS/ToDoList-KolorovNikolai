export type TodoStatus = 'InProgress' | 'Completed';

export interface Todo {
  id: number,
  title: string,
  description?: string,
  status: TodoStatus
}

export interface TodoApi {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}