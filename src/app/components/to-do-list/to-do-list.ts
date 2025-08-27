import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-to-do-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css'
})
export class ToDoList {
  todos: Todo[] = [
    { id: 1, title: 'Buy a new gaming laptop' },
    { id: 2, title: 'Complete previous task' },
    { id: 3, title: 'Create some angular app' }
  ];

  taskName: string  = '';

  public add(): void {
    const value = this.taskName.trim();
    if (!value) return;

    const maxId = this.todos.length 
      ? Math.max(...this.todos.map(t => t.id))
      : 0;

    this.todos.push({
      id: maxId  + 1,
      title: value
    });
    
    this.taskName = '';
  }

  public remove(id: number) : void {
    this.todos = this.todos.filter(t => t.id !== id);    
  }  
}