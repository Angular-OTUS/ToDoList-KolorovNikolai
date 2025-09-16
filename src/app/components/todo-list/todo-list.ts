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
  
  public todos = this.todoService.todos;
  public isLoading = signal(true);
  public selectedTodo = signal<Todo | null>(null);

  public todoForm: FormGroup = this.fb.group({
      title: ['', Validators.required],
      description: [''],
  });

  public get isTaskEmpty(): boolean {
    const title = this.todoForm.get('title')?.value;
    return !(title?.trim());
  }  

  ngOnInit() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500); 
  }

  public selectTodo(todo: Todo): void {
    this.selectedTodo.set(todo);
  }

  public onAdd(): void {
    if (this.todoForm.invalid) return;

    this.todoService.add(
      this.todoForm.get('title')?.value.trim(),
      this.todoForm.get('description')?.value.trim(),
    );

    this.todoForm.reset({ title: '', description: '' });
  }

  public onRemove(id: number): void {
    this.todoService.remove(id);
  }  
}