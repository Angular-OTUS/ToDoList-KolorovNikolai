import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule, TodoListItem, MatInputModule, MatProgressSpinnerModule,
            ReactiveFormsModule, MatFormFieldModule, LoadingSpinnerComponent,
            MatSelectModule, TodoCreateItem],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {  
  private readonly todoService = inject(TodoService);
  private readonly toastService = inject(ToastService);
  
  public todos = this.todoService.todos;
  public isLoading = signal(true);
  public statusFilter = signal<string>('');

  public selectedTodo = signal<Todo | null>(null);
  public editingId  = signal<number | null>(null);

  public filteredTodos = computed(() =>
    this.todos().filter(todo =>
      this.statusFilter() === '' || todo.status === this.statusFilter(),
    ),
  );

  ngOnInit() {
    this.todoService.loadTodos();
    setTimeout(() => this.isLoading.set(false), 500);
  }

  public selectTodo(todo: Todo): void {
    if (this.editingId() === null) this.selectedTodo.set(todo);
  }

  public startEdit(id: number): void {    
    this.editingId.set(id);
  }

  public cancelEdit(): void {
    this.editingId.set(null);
  }
  
  public onAdd(newTodo: Omit<Todo, 'id'>): void {
    this.todoService.add(newTodo).subscribe({
      next: (added) => {
        this.selectedTodo.set(added);
        this.toastService.showToast('Задача добавлена', 'add');
      },
      error: (err) => console.error('Ошибка добавления', err),
    });
  }  

  public onUpdate(updated: Todo): void {
    this.todoService.update(updated).subscribe({
      next: (updated) => {
        this.selectedTodo.set(updated);
        this.cancelEdit();
        this.toastService.showToast('Задача обновлена', 'save');
      },
      error: (err) => console.error('Ошибка обновления', err),
    });
  }  

  public onRemove(id: number): void {
    this.todoService.remove(id).subscribe({
      next: () => {
        if (this.editingId() === id) this.cancelEdit();
        if (this.selectedTodo()?.id === id) this.selectedTodo.set(null);        
        this.toastService.showToast('Задача удалена', 'delete');
      },
      error: (err) => console.error('Ошибка удаления', err),
    });
  }  
}