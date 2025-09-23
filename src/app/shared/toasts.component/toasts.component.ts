import { Component, inject } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toasts',
  imports: [],
  templateUrl: './toasts.component.html',
  styleUrl: './toasts.component.css',
})
export class ToastsComponent {
  public readonly toastService = inject(ToastService);
  public toasts = this.toastService.toasts;
}