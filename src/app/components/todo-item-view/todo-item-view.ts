import { Component, computed, inject } from '@angular/core';
import { Todo } from '../../models/todo';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from '../../directives/tooltip';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item-view',
  imports: [CommonModule, TooltipDirective],
  templateUrl: './todo-item-view.html',
  styleUrl: './todo-item-view.css',
})
export class TodoItemView {  
  private readonly todoService = inject(TodoService);

  // выбранная задача
  public readonly todo = computed(() => this.todoService.selectedTodo());

  public toggleStatus(): void {
    const t = this.todo();
    if (!t) return;

    const updated: Todo = {
      ...t,
      status: t.status === 'Completed' ? 'InProgress' : 'Completed',
    };
    this.todoService.update(updated).subscribe();
  }
}
