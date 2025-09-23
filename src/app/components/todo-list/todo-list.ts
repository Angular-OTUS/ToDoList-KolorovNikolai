import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo } from '../../models/todo';
import { TodoListItem } from '../todo-list-item/todo-list-item';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Button } from '../button/button';
import { TodoService } from '../../services/todo.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TooltipDirective } from '../../directives/tooltip';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule, TodoListItem, MatInputModule, MatProgressSpinnerModule,
            Button, ReactiveFormsModule, MatFormFieldModule, TooltipDirective],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  private readonly fb = inject(FormBuilder);
  private readonly todoService = inject(TodoService);
  private readonly toastService = inject(ToastService);
  
  public todos = this.todoService.todos;
  public isLoading = signal(true);

  public selectedTodo = signal<Todo | null>(null);
  public editingId  = signal<number | null>(null);

  public todoForm: FormGroup = this.fb.group({
      title: ['', Validators.required],
      description: [''],
  });

  public get isTaskEmpty(): boolean {    
    return !(this.todoForm.get('title')?.value?.trim());
  }  

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
  
  public onAdd(): void {
    if (!this.todoForm.valid) return;

    const newTodo: Omit<Todo, 'id'> = {
      title: this.todoForm.get('title')?.value.trim(),
      description: this.todoForm.get('description')?.value.trim(),
      completed: false,
    };

    this.todoService.add(newTodo).subscribe({
      next: (added) => {
        this.todoForm.reset({ title: '', description: '' });
        this.selectedTodo.set(added); // выделяем только что добавленную задачу
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