import { Component, input, output } from '@angular/core';
import { Todo } from '../../models/todo';
import { Button } from '../button/button';
import { TooltipDirective } from '../../directives/tooltip';

@Component({
  selector: 'app-todo-list-item',
  imports: [Button, TooltipDirective],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.css',
})
export class TodoListItem {
  public todo = input<Todo>();
  public delete = output<number>();

  public onDelete(): void {
    if (!this.todo()) return;

    this.delete.emit(this.todo()!.id);
  }
}