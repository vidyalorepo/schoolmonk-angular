import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './_services/auth.service';
import { tokenName } from '@angular/compiler';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor(private authservice:AuthService) {}

 
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event:any) => {
          if (event instanceof HttpResponse) {
            // Request was successful, you can handle the response here
          }
        },
        (error) => {
         const token=  localStorage.getItem('token');
          if (error instanceof HttpErrorResponse && error.status === 401 && token != null) {
            confirm("Your session had been expired. Login to Continue.")
             this.authservice.logout();
          }
        }
    )
  );
  }
}
