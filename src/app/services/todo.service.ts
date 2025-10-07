import { inject, Injectable, signal } from '@angular/core';
import { Todo, TodoApi } from '../models/todo';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private apiUrl = 'https://68d14427e6c0cbeb39a42790.mockapi.io/api/todos';  

  public todos = signal<Todo[]>([]);  

  public loadTodos(): void {
    this.http.get<TodoApi[]>(this.apiUrl).pipe(
      map(todos => todos.map(t => ({
        ...t,
        status: t.completed ? 'Completed' as const : 'InProgress' as const,
      }))),
      tap(mapped => this.todos.set(mapped)),
    ).subscribe();
  }  

  // Добавление задачи
  public add(todo: Omit<Todo, 'id'>): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      tap(newTodo => this.todos.update(list => [...list, newTodo])),
    );
  }

  // Обновление задачи
  public update(todo: Todo): Observable<Todo> {
    const apiTodo = {
      ...todo,
      completed: todo.status === 'Completed',
    };    
    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, apiTodo).pipe(
      tap(() => this.loadTodos()),
    );
  }

  // Удаление задачи
  public remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.todos.update(list => list.filter(t => t.id !== id));
      }),
    );
  }
}