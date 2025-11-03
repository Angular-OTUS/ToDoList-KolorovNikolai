import { Component, computed, DestroyRef, inject } from '@angular/core';
import { Todo } from '../../models/todo';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from '../../directives/tooltip';
import { TodoService } from '../../services/todo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todo-item-view',
  imports: [CommonModule, TooltipDirective],
  templateUrl: './todo-item-view.html',
  styleUrl: './todo-item-view.css',
})
export class TodoItemView {  
  private readonly todoService = inject(TodoService);
  private readonly destroyRef = inject(DestroyRef);

  // выбранная задача
  public readonly todo = computed(() => this.todoService.selectedTodo());

  // текст статуса
  public readonly statusText = computed(() => {
    const t = this.todo();
    if (!t) return '';
    return t.status === 'Completed' ? 'Completed' : 'In Progress';
  });

  // css для иконки
  public readonly statusIconClass = computed(() => {
    const t = this.todo();
    if (!t) return '';
    return t.status === 'Completed'
      ? 'bi-check-circle text-success'
      : 'bi-circle text-secondary';
  });

  // css для текста
  public readonly statusTextClass = computed(() => {
    const t = this.todo();
    if (!t) return '';
    return t.status === 'Completed' ? 'text-success' : 'text-secondary';
  });  

  public toggleStatus(): void {
    const t = this.todo();
    if (!t) return;

    const updated: Todo = {
      ...t,
      status: t.status === 'Completed' ? 'InProgress' : 'Completed',
    };
    this.todoService.update(updated)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}