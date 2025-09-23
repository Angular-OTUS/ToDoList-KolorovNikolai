export type ToastType = 'add' | 'delete' | 'save';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}