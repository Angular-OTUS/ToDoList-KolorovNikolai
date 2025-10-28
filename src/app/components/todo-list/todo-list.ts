import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Todo } from '../../models/todo';
import { TodoListItem } from '../todo-list-item/todo-list-item';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoService } from '../../services/todo.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastService } from '../../shared/toast.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner.component/loading-spinner.component';
import { MatSelectModule } from '@angular/material/select';
import { TodoCreateItem } from '../todo-create-item/todo-create-item';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule, TodoListItem, MatInputModule, MatProgressSpinnerModule,
            ReactiveFormsModule, MatFormFieldModule, LoadingSpinnerComponent,
            MatSelectModule, TodoCreateItem, RouterOutlet],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly toastService = inject(ToastService);  

  protected readonly isLoading = signal(true);
  protected readonly statusFilter = signal<string>('');
  protected readonly editingId  = signal<string | null>(null);

  protected readonly filteredTodos = computed(() => {
    const filter = this.statusFilter();
    const todos = this.todoService.todos();
    return filter ? todos.filter((t) => t.status === filter) : todos;
  });

  protected readonly selectedTodoId = computed(() => this.todoService.selectedTodo()?.id ?? null);

  constructor() {
    effect(() => {      
      const selected = this.todoService.selectedTodo();

      // Если выбранная задача ушла из фильтра
      if (selected && !this.filteredTodos().some(t => t.id === selected.id)) {
        this.todoService.select(null); 
      }
    });
  }

  ngOnInit() {    
    this.todoService.loadTodos();
    setTimeout(() => this.isLoading.set(false), 500);
  }
  
  public selectTodo(todo: Todo | null) {
    // Выбираем только если задача есть в фильтре
    if (!todo || this.filteredTodos().some(t => t.id === todo.id)) {
      this.todoService.select(todo);
    }
  }

  public startEdit(id: string): void {    
    this.editingId.set(id);
  }

  public cancelEdit(): void {
    this.editingId.set(null);
  }  
 
  public onAdd(newTodo: Omit<Todo, 'id'>): void {
    this.todoService
      .add(newTodo)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (added) => {
          this.toastService.showToast('Задача добавлена', 'add');
          this.todoService.select(added);        
        },
        error: () => this.toastService.showToast('Ошибка добавления', 'error'),
      });
  }

  public onUpdate(todo: Todo): void {
    this.todoService
      .update(todo)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.cancelEdit();
          this.toastService.showToast('Задача обновлена', 'save');
        },
        error: () => this.toastService.showToast('Ошибка обновления', 'error'),
      });
  }

  public onRemove(id: string): void {
    this.todoService
      .remove(id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          if (this.editingId() === id) this.cancelEdit();
          this.toastService.showToast('Задача удалена', 'delete');
        },
        error: () => this.toastService.showToast('Ошибка удаления', 'error'),
      });
  }
}