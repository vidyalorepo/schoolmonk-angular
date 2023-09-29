import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-infrastructure-list',
  templateUrl: './infrastructure-list.component.html',
  styleUrls: ['./infrastructure-list.component.css']
})
export class InfrastructureListComponent implements OnInit {

  _userDetails: any;
  _schoolsInfraStList: any;

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    if (this._userDetails) {
      this.callSchoolByID(this._userDetails.schoolId)
    }
  }

  callSchoolByID(id: any) {
    this.openLoader()
    this._authService.request('get', 'schooluser/school/' + id).subscribe((res) => {
      this.closeLoader();
      if (res) {
        this._schoolsInfraStList = res.schoolInfraDtlVo;
        console.log("_schoolsDetails :", this._schoolsInfraStList);
      }

    }, error => { this.closeLoader() })
  }

  deleteInfraSt(id?:any){
    let data = {id:''};
    data.id = id;
    
    this._authService.request('post', `schooluser/deleteSchoolInfraDtl`, data)
    .subscribe(res => {
      console.log(res);
      if(res.status == 200){
        this.openSnackBar('Infrastructure deleted successfully');
        this.callSchoolByID(this._userDetails.schoolId);
      }
      

    })
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true })
    this._authService._adminHeader.next({ show: true })
    this._authService._adminFooter.next({ show: true })
  }
}
