import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';
import { TodoApiService } from './todo-api.service';
import { filter, map, Observable, tap } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly api = inject(TodoApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly #todos = signal<Todo[]>([]);
  readonly #selectedTodo = signal<Todo | null>(null);

  public readonly todos = this.#todos.asReadonly();
  public readonly selectedTodo = this.#selectedTodo.asReadonly();

  // Сигнал получения id из урла
  readonly #routeId = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        let active = this.router.routerState.root;
        while (active.firstChild) {
          active = active.firstChild;
        }
        return active.snapshot.paramMap.get('id') ?? null;
      }),
    ),
    { initialValue: null },
  );

  constructor() {
    // Синхронизируем выбор задачи по урлу
    effect(() => {            
      const todo = this.#todos().find(t => t.id === this.#routeId()) ?? null;
      this.#selectedTodo.set(todo);
    });
  }  

  public loadTodos(): void {
    this.api.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (todos) => this.#todos.set(todos),
        error: (err) => console.error('Ошибка загрузки задач', err),
      });
  }

  public select(todo: Todo | null) {
    if (todo) {      
      this.router.navigate(['/tasks', todo.id]);
    } else {      
      this.router.navigate(['/tasks']);
    }
  }

  public add(newTodo: Omit<Todo, 'id'>): Observable<Todo> {
    return this.api.add(newTodo).pipe(
      tap((added) => {
        this.#todos.update((list) => [...list, added]);
        this.#selectedTodo.set(added);
      }),
    );
  }

  public update(todo: Todo): Observable<Todo> {
    return this.api.update(todo).pipe(
      tap((updated) => {
        this.#todos.update((list) =>
          list.map((t) => (t.id === updated.id ? updated : t)),
        );
        if (this.#selectedTodo()?.id === updated.id) {
          this.#selectedTodo.set(updated);
        }
      }),
    );
  }

  public remove(id: string): Observable<void> {
    return this.api.remove(id).pipe(
      tap(() => {
        this.#todos.update((list) => list.filter((t) => t.id !== id));
        if (this.#selectedTodo()?.id === id) {
          this.#selectedTodo.set(null);
        }
      }),
    );
  }
}