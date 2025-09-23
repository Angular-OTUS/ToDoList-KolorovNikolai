import { Component, signal } from '@angular/core';
import { TodoList } from "./components/todo-list/todo-list";
import { ToastsComponent } from './shared/toasts.component/toasts.component';

@Component({
  selector: 'app-root',
  imports: [TodoList, ToastsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  
}