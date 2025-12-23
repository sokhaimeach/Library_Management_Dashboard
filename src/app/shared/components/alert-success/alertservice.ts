import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Alertservice {
  title: string = 'Success';
  message: string = '';

  visible = signal<boolean>(false);

  showAlert(title: string, message: string) {
    this.title = title;
    this.message = message;
    this.visible.set(true);

    setTimeout(() => {
      this.visible.set(false);
    }, 2000);
  }
}
