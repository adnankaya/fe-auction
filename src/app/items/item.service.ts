import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrl } from '../commons/apiURL';
import { Item } from './models/Item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {


  constructor(private httpClient: HttpClient) { }

  apiURL = new ApiUrl();

  getItems(targetUrl: string, filterObj = null): Observable<Item> {
    if (targetUrl.length === 0 || targetUrl === null) {
      const endpoint = 'items/';
      const httpParams = new HttpParams()
        .append('query', filterObj.query.toString())
        .append('price', filterObj.price.toString());
      targetUrl = `${this.apiURL.url}${endpoint}`;
      return this.httpClient.get<Item>(targetUrl, { params: httpParams });
    }
    return this.httpClient.get<Item>(targetUrl);
  }
  getItem(id: number): Observable<Item> {
    const endpoint = 'items/';
    return this.httpClient.get<Item>(`${this.apiURL.url}${endpoint}${id}`);
  }

}
