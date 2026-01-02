import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
