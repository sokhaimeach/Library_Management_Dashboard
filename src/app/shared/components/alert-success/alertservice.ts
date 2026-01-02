import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Alertservice {
  type: string = 'Success';
  message: string = '';

  visible = signal<boolean>(false);

  showAlert(type: string, message: string) {
    this.type = type;
    this.message = message;
    this.visible.set(true);

    setTimeout(() => {
      this.visible.set(false);
    }, 3000);
  }
}
