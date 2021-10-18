import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { ApiUrl } from '../commons/apiURL';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({ providedIn: 'root' })
export class AuthService {
  apiURL = new ApiUrl();

  constructor(private http: HttpClient,
    private jwtHelper: JwtHelperService) {
  }

  

  login(username: string, password: string) {
    const endpoint = 'token/'
    return this.http.post<any>(`${this.apiURL.url}${endpoint}`, { username, password })
      .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', data[`access`] as string);
        return true;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    
  }


  loggedIn(): boolean {
    const val = this.decodedToken;
    if (val instanceof Object) {
      const isExpire = this.jwtHelper.isTokenExpired(val[`access`]);
      if (isExpire) {
        this.logout();
      }
      return !isExpire;
    }
    return false;
  }
  get token(): string {
    return localStorage.getItem('token');
  }

  public get decodedToken(): any {
    const token = this.jwtHelper.decodeToken(this.token);
    return token;
  }





}