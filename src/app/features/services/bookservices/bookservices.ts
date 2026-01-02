import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book as BookI, BookItem, RemoveBookI } from '../../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class Bookservices {
  private url: string = enviroment.apiUrl+"/books/";

  constructor(private http: HttpClient) {}

  getAllBooks(filter: string, search: string):Observable<{message: string, data: BookI}>  {
    let params = new HttpParams();

    params = params.set('category_ids', filter);
    params = params.set("search", search);

    return this.http.get<{message: string, data: BookI}>(`${this.url}`, { params });
  }

  createNewBook(book: BookItem): Observable<{message: string}> {
    return this.http.post<{message: string}>(this.url, book);
  }

  updateBook(id: string, book: BookItem):Observable<{message: string}> {
    return this.http.put<{message: string}>(this.url + id, book);
  }

  moveToRecycleBin(id: string, quantity: number): Observable<{message: string}> {
    return this.http.patch<{message: string}>(`${this.url}copy/${id}/allavailable`, {quantity});
  }

  getRemoveBook(search: string):Observable<{message: string, data: RemoveBookI[]}> {
    let params = new HttpParams();
    params = params.set("search", search);

    return this.http.get<{message: string, data: RemoveBookI[]}>(`${this.url}recycle`, {params});
  }

  restoreBook(id: string): Observable<{message: string}> {
    return this.http.patch<{message: string}>(`${this.url}copy/restore/${id}`, {});
  }

  deletePermanently(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.url}copy/${id}/deleteavailable`);
  }
}
