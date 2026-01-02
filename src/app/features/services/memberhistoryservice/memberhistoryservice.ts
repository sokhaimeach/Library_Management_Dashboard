import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MemberI } from '../../models/member.modal';
import { BorrowI } from '../../models/borrow.model';
import { PenaltyListItem } from '../../models/penalty.model';

@Injectable({
  providedIn: 'root',
})
export class Memberhistoryservice {
  private url: string = enviroment.apiUrl;

  constructor(private http: HttpClient) {}

  getMemberById(id: string): Observable<MemberI> {
    return this.http.get<MemberI>(this.url +"/members/"+id);
  }

  changeMemberType(id: string, type: string): Observable<{message: string}> {
    return this.http.patch<{message: string}>(this.url+"/members/"+id+"/type", {member_type: type});
  }

  getBorrow(id: string, filter: string, search: string): Observable<BorrowI[]> {
    let params = new HttpParams();
    params = params.set("filter", filter);
    params = params.set("search", search);

    return this.http.get<BorrowI[]>(this.url+"/history/borrow/"+id, { params });
  }

  getPenalty(id: string, filter: string, search: string): Observable<PenaltyListItem[]>{
    let params = new HttpParams();
    params = params.set("filter", filter);
    params = params.set("search", search);

    return this.http.get<PenaltyListItem[]>(this.url+"/history/penalty/"+id, {params});
  }
}
