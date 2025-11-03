import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Todo, TodoApi, TodoStatus } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoApiService {
  private readonly http = inject(HttpClient);  
  private readonly apiUrl = 'https://otus-angular-default-rtdb.europe-west1.firebasedatabase.app';

  // Получить все задачи
  getAll(): Observable<Todo[]> {
    return this.http.get<Record<string, TodoApi>>(`${this.apiUrl}/todos.json`).pipe(
      map(obj => {
        if (!obj) return [];
        return Object.entries(obj)
          .filter(([_, todo]) => todo && todo.title) // защита от null
          .map(([id, todo]) => ({
            id, // ключ Firebase
            title: todo.title,
            description: todo.description,
            status: todo.completed ? 'Completed' as TodoStatus : 'InProgress' as TodoStatus,
          }));
      }),
    );
  }

  // Добавить задачу
  add(todo: Omit<Todo, 'id'>): Observable<Todo> {
    return this.http.post<{ name: string }>(`${this.apiUrl}/todos.json`, {
      title: todo.title,
      description: todo.description || '',
      completed: todo.status === 'Completed',
    }).pipe(
      map(res => ({
        id: res.name, // ключ Firebase
        ...todo,
      })),
    );
  }

  // Обновить задачу
  update(todo: Todo): Observable<Todo> {
    const url = `${this.apiUrl}/todos/${todo.id}.json`;
    return this.http.put(url, {
      title: todo.title,
      description: todo.description || '',
      completed: todo.status === 'Completed',
    }).pipe(map(() => todo));
  }

  // Удалить задачу
  remove(id: string): Observable<void> {
    const url = `${this.apiUrl}/todos/${id}.json`;
    return this.http.delete<void>(url);
  }
}