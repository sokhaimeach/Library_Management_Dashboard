import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../../book/book';

@Injectable({
  providedIn: 'root',
})
export class Bookservices {
  private url: string = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllBooks() {
    let params = new HttpParams();

    params = params.set('category_ids', '');

    return this.http.get(`${this.url}/books`, { params });
  }
}
