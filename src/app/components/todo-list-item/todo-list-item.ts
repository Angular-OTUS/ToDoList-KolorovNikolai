import { Component, input, output } from '@angular/core';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-todo-list-item',
  imports: [],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.css'
})
export class TodoListItem {
  todo = input<Todo>();  
  delete = output<number>();

  onDelete() {
    const t = this.todo();
    if (!t) return;  

    this.delete.emit(t.id);
  }
}
