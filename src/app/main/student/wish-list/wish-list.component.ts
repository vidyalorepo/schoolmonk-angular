import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  userDetails: any;
  favSchoolList: any = [];

  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails')) || '';
    this.getFavouriteSchool(this.userDetails.userId);
  }

  getFavouriteSchool(userId: any) {
    if(userId){
      this.openLoader()
      this._authService
      .request('get', `schooluser/findFavourieSchools?userId=${userId}`)
      .subscribe((response) => {
        if (response.status == 200) {
          this.closeLoader()
          this.favSchoolList = response.result;
          console.log('this.favSchoolList--> ', this.favSchoolList);
        }
      },(error) =>{
        this.closeLoader()
        console.log(error);
        
      });
    }
  }

  removeFavouriteSchool(schoolId: any) {
    if(schoolId){
      this.openLoader()
      this._authService
      .request('get', `schooluser/removeFavourieSchools?schoolId=${schoolId}&userId=${this.userDetails.userId}`)
      .subscribe((response) => {
        if (response.status == 200) {
          this.favSchoolList = this.favSchoolList.filter((item: { code: any; }) => item.code !== schoolId);
          this.openSnackBar("Favourite school removed")
          this.closeLoader()
          console.log('this.favSchoolList--> ', this.favSchoolList);
        }
      },(error) =>{ 
        this.closeLoader()
        console.log(error);
        
      });
    }
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

}
