import { Component } from '@angular/core';
import { ToastsComponent } from './shared/toasts.component/toasts.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ToastsComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  
}