import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  isLoader : boolean = true;
  constructor(private router: Router, private _authService: AuthService,private snackbar:MatSnackBar) { }

  ngOnInit(): void {
    this._authService.loader.subscribe((response) => {
      this.isLoader = response.load;
    });
  }


  logout(){
    localStorage.clear();
    // this.displayLogInStatus = true;
    this._authService._adminSideNavBar.next({show: false})
    this._authService._adminHeader.next({show: false})
    this._authService._adminFooter.next({show: false})
    // this.openSnackBar("Logout Sucessfully.");
    this.router.navigate(['/home']).then(() => {
      window.location.reload()
     
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
}
