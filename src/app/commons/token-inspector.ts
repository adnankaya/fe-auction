/**
 * We do not need to add Authorization Token headers for every request.
 * This class helps us to put the token on every request
 */
 import { Injectable } from '@angular/core';
 import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
 import { Observable } from 'rxjs';
 
 @Injectable()
 export class TokenInterceptor implements HttpInterceptor {
 
     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
         const userToken = localStorage.getItem('token');
         const modifiedReq = req.clone({
             headers: req.headers.set('Authorization', `Token ${userToken}`),
         });
         return next.handle(modifiedReq);
     }
 }