import { Component, signal } from '@angular/core';
import { Authservice } from '../../core/auth/authservice';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-auth-layout',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  showPassword: boolean = false;
  loginByEmail: boolean = false;
  username = '';
  password: string = '';
  email: string = '';
  message = signal<string>('');
  emailMess = signal<string>('');

  constructor(private authService: Authservice, private route: Router, public loading: LoadingService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // login
  login() {
    this.loading.show();
    this.authService.login({username: this.username, password: this.password}).subscribe({
      next: (res: any) => {
        this.authService.setToken(res.data.token);
        setTimeout(() => {
          this.loading.hide();
          this.route.navigate(['/admin']);
        }, 100);
        const {token: _ , ...data} = res.data;
        localStorage.setItem('user_profile', JSON.stringify(data));
      },
      error: (err) => {
        this.loading.hide();
        this.message.set(err.error?.message);
      }
    });
  }

  loginByEmailFn() {
    this.loading.show();
    this.authService.loginByEmail({"contact.email": this.email}).subscribe({
      next: (res: any) => {
        this.authService.setToken(res.data.token);
        setTimeout(() => {
          this.loading.hide();
          this.route.navigate(['/admin']);
        }, 100);
        const {token: _ , ...data} = res.data;
        localStorage.setItem('user_profile', JSON.stringify(data));
      },
      error: (err) => {
        this.loading.hide();
        this.emailMess.set(err.error?.message);
      }
    })
  }
}
