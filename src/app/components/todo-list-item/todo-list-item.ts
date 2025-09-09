import { Component, input, output } from '@angular/core';
import { Todo } from '../../models/todo';
import { Button } from '../button/button';

@Component({
  selector: 'app-todo-list-item',
  imports: [Button],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.css',
})
export class TodoListItem {
  todo = input<Todo>();
  delete = output<number>();

  onDelete() {
    if (!this.todo()) return;

    this.delete.emit(this.todo()!.id);
  }
}