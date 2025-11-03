export type ToastType = 'add' | 'delete' | 'save' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}