import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetail } from '../../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class Userservice {
  private url: string = enviroment.apiUrl;
  constructor(private http: HttpClient) {}

  getUserDetail(id: string):Observable<UserDetail> {
    return this.http.get<UserDetail>(this.url+'/users/details/'+id);
  }
}
