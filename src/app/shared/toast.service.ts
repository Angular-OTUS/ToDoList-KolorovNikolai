import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from './toast';

@Injectable({
  providedIn: 'root',
})

export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  private tostId = 1;
  
  public get toasts() {
    return this._toasts;
  }
  
  public showToast(message: string, type: ToastType): void {
    const toast: Toast = { id: this.tostId++, message, type };
    this._toasts.update(list => [...list, toast]);

    // Aвтоматическое скрытие
    setTimeout(() => this.removeToast(toast.id), 3000);
  }

  public removeToast(id: number): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}