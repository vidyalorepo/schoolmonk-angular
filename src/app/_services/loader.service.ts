import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(private _snackBar: MatSnackBar,private _authService: AuthService) { }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }
}
