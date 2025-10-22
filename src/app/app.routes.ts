import { Routes } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
import { TodoItemView } from './components/todo-item-view/todo-item-view';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    component: TodoList,
    children: [
      { path: '', component: TodoItemView },
      { path: ':id', component: TodoItemView },      
    ],  
  },
  { path: '**', redirectTo: 'tasks' },
];
