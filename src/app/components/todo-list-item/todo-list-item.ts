import { Component, computed, effect, input, output, signal } from '@angular/core';
import { Todo } from '../../models/todo';
import { Button } from '../button/button';
import { TooltipDirective } from '../../directives/tooltip';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list-item',
  imports: [Button, TooltipDirective, FormsModule, CommonModule],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.css',
})
export class TodoListItem {
  public todo = input<Todo>();
  public editingId  = input<number | null>();

  public delete = output<number>();
  public save = output<Todo>();
  public edit = output<void>();
  public cancel = output<void>(); 
  
  public editingTitle = signal('');
  
  public isEditingTodo = computed(() => this.editingId() === this.todo()?.id);
  public isDeleteLocked = computed(() => this.editingId() !== null && this.editingId() !== this.todo()?.id);
 
  constructor() {
    // сбрасываем локальный editingTitle при закрытии редактирования
    effect(() => {
      if (!this.isEditingTodo()) {
        this.editingTitle.set('');        
      } else if (this.todo()) {
        this.editingTitle.set(this.todo()!.title);
      } 
    });
  }  

  public onEdit() {
    this.edit.emit();
  }

  public onDelete(event?: MouseEvent): void {
    event?.stopPropagation(); // не даём всплыть клику, так как кнопки в строке, которую можно выделить тем же кликом в родителе
    if (this.todo()) {
      this.delete.emit(this.todo()!.id);
    }
  }  

  public onSave(event?: MouseEvent): void {
    event?.stopPropagation();
    if (this.todo()) {
      this.save.emit({ ...this.todo()!, title: this.editingTitle() });
    }    
  }

  public onCancel(): void {
    this.cancel.emit();
  }
}