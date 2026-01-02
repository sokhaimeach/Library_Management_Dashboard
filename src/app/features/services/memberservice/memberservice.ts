import { Injectable } from '@angular/core';
import { enviroment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MemberI, MemberItem } from '../../models/member.modal';

@Injectable({
  providedIn: 'root',
})
export class Memberservice {
  private url: string = enviroment.apiUrl + "/members/";

  constructor(private http: HttpClient) {}

  getAllMembers(filter: string, search: string):Observable<MemberI[]> {
    let params = new HttpParams();
    params = params.set("filter", filter);
    params = params.set("search", search);

    return this.http.get<MemberI[]>(this.url, { params });
  }

  createNewMember(member: MemberItem): Observable<{message: string}> {
    return this.http.post<{message: string}>(this.url, member);
  }

  updateMember(id: string, member: MemberItem): Observable<{message: string}> {
    return this.http.put<{message: string}>(this.url+id, member);
  }
}
