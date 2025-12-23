import { Component, signal } from '@angular/core';
import { Authservice } from '../../core/auth/authservice';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";

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

  constructor(private authService: Authservice, private route: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // login
  login() {
    this.authService.login({username: this.username, password: this.password}).subscribe({
      next: (res: any) => {
        this.authService.setToken(res.data.token);
        setTimeout(() => {
          this.route.navigate(['/admin']);
        }, 100);
        const {token: _ , ...data} = res.data;
        localStorage.setItem('user_profile', JSON.stringify(data));
      },
      error: (err) => {
        this.message.set(err.error?.message);
      }
    });
  }

  loginByEmailFn() {
    this.authService.loginByEmail({"contact.email": this.email}).subscribe({
      next: (res: any) => {
        this.authService.setToken(res.data.token);
        setTimeout(() => {
          this.route.navigate(['/admin']);
        }, 100);
        const {token: _ , ...data} = res.data;
        localStorage.setItem('user_profile', JSON.stringify(data));
      },
      error: (err) => {
        this.emailMess.set(err.error?.message);
      }
    })
  }
}
