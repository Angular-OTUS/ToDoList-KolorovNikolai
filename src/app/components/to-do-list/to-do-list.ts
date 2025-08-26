import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-to-do-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css'
})
export class ToDoList {
  todos: string[] = [
    'Buy a new gaming laptop',
    'Complete previous task',
    'Create some angular app',
  ];

  taskName: string  = '';

  add() {
    var value = this.taskName.trim();
    if (!value) return;

    this.todos.push(value);
    this.taskName = '';
  }

  remove(index: number) {
    this.todos.splice(index, 1);
  }  
}