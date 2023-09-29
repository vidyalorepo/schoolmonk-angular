import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-headers',
  templateUrl: './admin-headers.component.html',
  styleUrls: ['./admin-headers.component.css']
})
export class AdminHeadersComponent implements OnInit {

  isLoader : boolean = true;
  userDetails: any;
  constructor(private router: Router, private _authService: AuthService,private snackbar:MatSnackBar) { }

  ngOnInit(): void {
    this._authService.loader.subscribe((response) => {
      this.isLoader = response.load;
    });

    this.userDetails = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails'))
      : '';
  }


  logout(){
    localStorage.clear();
    // this.displayLogInStatus = true;
    this._authService._adminSideNavBar.next({show: false})
    this._authService._adminHeader.next({show: false})
    this._authService._adminFooter.next({show: false})
    this.router.navigate(['/auth/home']).then(() => {
      window.location.reload()
      // this.openSnackBar("Logout Sucessfully.");
  });
  }

  openSnackBar(message: any) {
    this.snackbar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  openSnackBarError(message: any) {
    this.snackbar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
