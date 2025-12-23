import { Injectable } from '@angular/core';
import { enviroment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private readonly TOKEN_KEY = 'auth_token';

  private url: string = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  login(data: any){
    return this.http.post(`${this.url}/auth/login`, data);
  }

  loginByEmail(data: any){
    return this.http.post(`${this.url}/auth/loginByEmail`, data);
  }

  logout(){
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user_profile');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserProfile(): UserProfile | null{
    const user:any = localStorage.getItem('user_profile') || null;
    if(user){
      return JSON.parse(user);
    }
    console.log(user)
    return user;
  }


  hasRole(requireRole: string[]){
    let user: any = localStorage.getItem('user_profile') || null;
    if(user){
      try{
        user = JSON.parse(user);
      }catch{
        user = null;
      }
      
      if(user !== null){
        return !!requireRole.includes(user.role);
      }
    }
    return false;
  }
}

export interface UserProfile {
  _id: string;
  username: string;
  role: string;
  image_url: string;
}
