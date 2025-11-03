import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadComponent: () => import('./components/todo-list/todo-list').then(m => m.TodoList),
    children: [
      {
        path: '',
      loadComponent: () => import('./components/todo-item-view/todo-item-view').then(m => m.TodoItemView),
      },
      {
        path: ':id',
        loadComponent: () => import('./components/todo-item-view/todo-item-view').then(m => m.TodoItemView),
      },
    ],  
  },
  { path: '**', redirectTo: 'tasks' },
];
