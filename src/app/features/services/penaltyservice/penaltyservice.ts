import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PenaltyDetail, PenaltyItem, PenaltyListItem } from '../../models/penalty.model';

@Injectable({
  providedIn: 'root',
})
export class Penaltyservice {
  private url: string = enviroment.apiUrl + '/penalties/';

  constructor(private http: HttpClient) {}

  updatePenaltyStatus(
    id: string,
    status: string
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.url + id, { status });
  }

  getAllPenalties(filter: string, search: string): Observable<{message: string,data: PenaltyListItem[]}> {
    let params = new HttpParams();
    params = params.set("filter", filter);
    params = params.set("search", search);

    return this.http.get<{message: string,data: PenaltyListItem[]}>(this.url, {params});
  }

  getPenaltyDetail(id: string):Observable<{message: string, data: PenaltyDetail}> {
    return this.http.get<{message: string, data: PenaltyDetail}>(this.url + id);
  }

  createNewPenalty(penalty: PenaltyItem): Observable<{message: string}> {
    return this.http.post<{message: string}>(this.url, penalty);
  }

  deletePenalty(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(this.url + id);
  }
}
