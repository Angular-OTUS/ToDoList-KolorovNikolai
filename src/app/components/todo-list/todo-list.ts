import { CommonModule } from '@angular/common';
import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo';
import { TodoListItem } from '../todo-list-item/todo-list-item';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule, TodoListItem, MatInputModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoList {
  taskText = model('');
  todos = signal<Todo[]>([
    { id: 1, text: 'Buy a new gaming laptop' },
    { id: 2, text: 'Complete previous task' },
    { id: 3, text: 'Create some angular app' }
  ]);

  get isTaskTextEmpty(): boolean {    
    return !this.taskText().trim();
  }  

  public add(): void {
    const newTaskText = this.taskText().trim();
    if (!newTaskText) return;
    
    const currentTodos = this.todos();

    const maxId = currentTodos.length 
      ? Math.max(...currentTodos.map(t => t.id))
      : 0;

    this.todos.set([...currentTodos, { id: maxId + 1, text: newTaskText }]);
    this.taskText.set('');
  }

  public remove(id: number) : void {
    this.todos.set(this.todos().filter(t => t.id !== id));
  }
}