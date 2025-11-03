export type TodoStatus = 'InProgress' | 'Completed';

export interface Todo {
  id: string,
  title: string,
  description?: string,
  status: TodoStatus
}

export interface TodoApi {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}