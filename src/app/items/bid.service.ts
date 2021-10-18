import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrl } from '../commons/apiURL';
import { User } from '../models/user';
import { AutoBid } from './models/AutoBid';
import { Bid } from './models/Bid';

@Injectable({
  providedIn: 'root'
})
export class BidService {


  constructor(private httpClient: HttpClient) { }

  apiURL = new ApiUrl();

  postBid(data: Bid): Observable<Bid> {
    const endpoint = 'bids/';
    return this.httpClient.post<Bid>(`${this.apiURL.url}${endpoint}`, data);
  }

  getAutoBid(user_id: number, itemID: number): Observable<any> {
    const endpoint = 'autobids/';
    const httpParams = new HttpParams()
      .append('made_by', user_id)
      .append('item', itemID.toString());
    return this.httpClient.get<any>(`${this.apiURL.url}${endpoint}`, { params: httpParams });
  }
  getClientAutoBids(user_id: number): Observable<AutoBid[]> {
    const endpoint = 'autobids/';
    const httpParams = new HttpParams()
      .append('made_by', user_id);
    return this.httpClient.get<AutoBid[]>(`${this.apiURL.url}${endpoint}`, { params: httpParams });
  }
  updateAutoBid(autobid: AutoBid): Observable<AutoBid> {
    const endpoint = `autobids/${autobid.id}/`;
    return this.httpClient.put<AutoBid>(`${this.apiURL.url}${endpoint}`, autobid);
  }
  postAutoBid(autobid: AutoBid): Observable<AutoBid> {
    const endpoint = `autobids/`;
    return this.httpClient.post<AutoBid>(`${this.apiURL.url}${endpoint}`, autobid);
  }


}
