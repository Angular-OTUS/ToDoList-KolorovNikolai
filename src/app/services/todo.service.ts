import { inject, Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private apiUrl = 'https://68d14427e6c0cbeb39a42790.mockapi.io/api/todos';  

  public todos = signal<Todo[]>([]);  

  // Загрузить список задач
  public loadTodos(): void {
    this.http.get<Todo[]>(this.apiUrl).subscribe({
      next: (data) => this.todos.set(data),
      error: (err) => console.error('Ошибка загрузки todos', err),
    });
  }

  // Добавление задачи
  public add(todo: Omit<Todo, 'id'>): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      tap(newTodo => this.todos.update(list => [...list, newTodo])),
    );
  }

  // Обновление задачи
  public update(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo).pipe(
      tap(updated => {
        this.todos.update(list => list.map(t => t.id === updated.id ? updated : t));
      }),
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