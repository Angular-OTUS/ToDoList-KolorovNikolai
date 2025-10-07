import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../button/button';
import { TooltipDirective } from '../../directives/tooltip';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-todo-create-item',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, TooltipDirective],
  templateUrl: './todo-create-item.html',
  styleUrl: './todo-create-item.css',
})
export class TodoCreateItem {
  private readonly fb = inject(FormBuilder);
  
  public add = output<Omit<Todo, 'id'>>();

  public todoForm: FormGroup = this.fb.group({
      title: ['', Validators.required],
      description: [''],
  });

  public get isTaskEmpty(): boolean {    
    return !(this.todoForm.get('title')?.value?.trim());
  }

  public onSubmit(): void {
    if (!this.todoForm.valid) return;

    const newTodo: Omit<Todo, 'id'> = {
      title: this.todoForm.get('title')?.value.trim(),
      description: this.todoForm.get('description')?.value.trim(),
      status: 'InProgress',
    };

    this.add.emit(newTodo);
    this.todoForm.reset();
  }  
}
