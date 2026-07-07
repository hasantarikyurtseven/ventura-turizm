import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number;
  action?: string;
}

const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 3500,
  error: 6000,
  warning: 6000,
  info: 3500,
};

const PANEL_CLASS: Record<ToastType, string> = {
  success: 'toast-success',
  error: 'toast-error',
  warning: 'toast-warning',
  info: 'toast-info',
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, options?: ToastOptions): MatSnackBarRef<TextOnlySnackBar> {
    return this.open('success', message, options);
  }

  error(message: string, options?: ToastOptions): MatSnackBarRef<TextOnlySnackBar> {
    return this.open('error', message, options);
  }

  warning(message: string, options?: ToastOptions): MatSnackBarRef<TextOnlySnackBar> {
    return this.open('warning', message, options);
  }

  info(message: string, options?: ToastOptions): MatSnackBarRef<TextOnlySnackBar> {
    return this.open('info', message, options);
  }

  private open(
    type: ToastType,
    message: string,
    options?: ToastOptions,
  ): MatSnackBarRef<TextOnlySnackBar> {
    const config: MatSnackBarConfig = {
      duration: options?.duration ?? DEFAULT_DURATION[type],
      panelClass: ['ventura-toast', PANEL_CLASS[type]],
      verticalPosition: 'top',
      horizontalPosition: 'end',
    };
    return this.snackBar.open(message, options?.action ?? undefined, config);
  }
}
