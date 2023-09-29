import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  userDetails: any;
  constructor(
    private router: Router,
    private _authService: AuthService,
  ) { }

  canActivate(): boolean {
    this.userDetails = (localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails') || '') : '');
    if (this._authService.getToken() !== null && (this.userDetails.userType == 'SCHOOL_USER' || this.userDetails.userType == 'ADMIN_USER')) {
      
        this._authService.request('get','users/validate').subscribe(res => {
          // console.log(res);
          
        }, (err) => {
          if(err.status === 401){
            localStorage.clear();
            this.router.navigate(['/auth/home']);
          }
          // console.log(err);
          
        })
      return true;
    }
    else {
      if (this.router.url === '/auth/home') {

      }
      this.router.navigate(['/auth/home']);
      return false;
    }

  }
}
