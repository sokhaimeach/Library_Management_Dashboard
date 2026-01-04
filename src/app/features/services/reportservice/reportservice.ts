import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvaiVsBorI, KpiI } from '../../models/report.model';
import { BorrowI } from '../../models/borrow.model';
import { PenaltyListItem } from '../../models/penalty.model';

@Injectable({
  providedIn: 'root',
})
export class Reportservice {
  private url: string = enviroment.apiUrl + "/report/";

  constructor(private http: HttpClient) {}

  getKpiData(): Observable<KpiI[]> {
    return this.http.get<KpiI[]>(`${this.url}kpi`);
  }

  getAvailableVsBorrowed(): Observable<AvaiVsBorI> {
    return this.http.get<AvaiVsBorI>(`${this.url}available-vs-borrowed`);
  }

  getTrendBorrow(): Observable<number[]> {
    return this.http.get<number[]>(`${this.url}borrow-trend`);
  }

  getStatusBreakdown(): Observable<{labels: string[], data: number[]}>{
    return this.http.get<{labels: string[], data: number[]}>(`${this.url}status-breakdown`);
  }

  getTopCategory(): Observable<{labels: string[], data: number[]}>{
    return this.http.get<{labels: string[], data: number[]}>(`${this.url}top-categories`);
  }

  getRecentBorrows(): Observable<BorrowI[]> {
    return this.http.get<BorrowI[]>(`${this.url}recent-borrows`);
  }

  getRecentPenalty(): Observable<PenaltyListItem[]> {
    return this.http.get<PenaltyListItem[]>(`${this.url}recent-penalties`);
  }

  getOverdueBorrows(): Observable<BorrowI[]> {
    return this.http.get<BorrowI[]>(`${this.url}overdue`);
  }

}
