import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {
  userDetails: any;

  constructor(
    private router: Router,
    private _authService: AuthService,
  ) { }

  public canActivate(route: ActivatedRouteSnapshot){
    this.userDetails = (localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails') || '') : '');
    if (this._authService.getToken() !== null && (this.userDetails.userType == 'SCHOOL_USER' || this.userDetails.userType == 'ADMIN_USER')) {
        return true;
    }else{
        return false;
    }
  }
}