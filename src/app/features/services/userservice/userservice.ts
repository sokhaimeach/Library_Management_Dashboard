import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetail } from '../../models/account.model';
import { UserI } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Userservice {
  private url: string = enviroment.apiUrl;
  constructor(private http: HttpClient) {}

  getUserDetail(id: string):Observable<UserDetail> {
    return this.http.get<UserDetail>(this.url+'/users/details/'+id);
  }

  getAllUsers():Observable<UserI[]> {
    return this.http.get<UserI[]>(this.url + '/users');
  }

  createUser(user: UserI):Observable<{message: string, data: UserI}> {
    return this.http.post<{message: string, data: UserI}>(this.url + '/users', user);
  }

  updateUser(id: string, user: any): Observable<{message: string}> {
    return this.http.put<{message: string}>(this.url + '/users/' + id, user);
  }

  changeUserStatus(id: string, status: boolean): Observable<{message: string}> {
    return this.http.patch<{message: string}>(this.url + '/users/' + id, {status});
  }

  resetPassword(id: string, newPassword: string): Observable<{message: string}> {
    return this.http.patch<{message: string}>(this.url + '/auth/reset/' + id, {newPassword});
  }

  changePassword(payload: {oldPassword: string, newPassword: string}): Observable<{type: string,message: string}>{
    return this.http.patch<{type: string, message: string}>(this.url + '/auth/changePassword', payload);
  }
}
