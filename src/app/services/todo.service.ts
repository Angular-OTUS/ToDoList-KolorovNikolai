import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  public todos = signal<Todo[]>([
    {
      id: 1,
      title: 'Buy a new gaming laptop',
      description: 'Nemo enim ipsam voluptatem, quis nostrum exercitationem ullam corporis suscipit laboriosam, sed do eiusmod tempor incididunt ut labore et dolore',
      completed: false,
    },
    {
      id: 2,
      title: 'Complete previous task',
      description: 'Excepteur sint occaecat cupidatat non proident, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
      completed: false,
    },
    {
      id: 3,
      title: 'Create some angular app',
      description: 'Lorem ipsum dolor sit amet, nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id',
      completed: false,
    },
  ]);

  public add(title: string, description: string): void {
    const maxId = this.todos().length
      ? Math.max(...this.todos().map(t => t.id))
      : 0;

    this.todos.set([...this.todos(), { id: maxId + 1, title, description, completed: false }]);
  }

  public remove(id: number) : void {
    this.todos.set(this.todos().filter(t => t.id !== id));
  }    
}