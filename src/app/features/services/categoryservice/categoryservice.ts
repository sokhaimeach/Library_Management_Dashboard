import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryI, CategoryItem } from '../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class Categoryservice {
  private url: string = enviroment.apiUrl+"/categories/";

  constructor(private http: HttpClient) {}

  getAllCategories(search: string): Observable<CategoryI[]>{
    let params = new HttpParams();
    params = params.set("search", search);

    return this.http.get<CategoryI[]>(this.url, { params });
  }

  createNewCategory(category: CategoryItem): Observable<{message: string, id: string}> {
    return this.http.post<{message: string, id: string}>(this.url, category);
  }

  updateCategory(id: string, category: CategoryItem): Observable<{message: string}> {
    return this.http.put<{message: string}>(this.url+id, category);
  }

  deleteCategory(id: string): Observable<{message: string}>{
    return this.http.delete<{message: string}>(this.url+id);
  }
}
