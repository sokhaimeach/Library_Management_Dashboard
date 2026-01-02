import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BorrowDatail, BorrowI, ReturnI } from '../../models/borrow.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Borrowservice {
  private url: string = enviroment.apiUrl + "/borrowrecord/";

  constructor(private http: HttpClient) {}

  updateBorrowStatus(id: string, payload: ReturnI): Observable<{message: string}> {
    return this.http.put<{message: string}>(this.url+id, payload);
  }

  getAllBorrows(filter: string, search: string): Observable<BorrowI[]> {
    let params = new HttpParams();
    params = params.set("filter", filter);
    params = params.set("search", search);

    return this.http.get<BorrowI[]>(this.url, { params });
  }

  getBorrowDetail(id: string): Observable<BorrowDatail>{
    return this.http.get<BorrowDatail>(this.url+id+"/detail");
  }
}
