import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorI, AuthorItem } from '../../models/author.model';

@Injectable({
  providedIn: 'root',
})
export class Authorservice {
  private url: string = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllAuthors(query: string, search: string): Observable<AuthorI[]>{
    let params = new HttpParams();
    params = params.set("nation", query);
    params = params.set("search", search);

    return this.http.get<AuthorI[]>(this.url+"/authors", { params });
  }

  createNewAuthor(author: AuthorItem): Observable<{message: string, id: string}>{
    return this.http.post<{message: string, id: string}>(this.url+"/authors", author);
  }

  putAuthor(id: string, author: AuthorItem): Observable<{message: string}>{
    return this.http.put<{message: string}>(this.url + '/authors/'+id, author);
  }

  deleteAuthor(id: string): Observable<{message: string}>{
    return this.http.delete<{message: string}>(this.url+'/authors/'+id);
  }
}
