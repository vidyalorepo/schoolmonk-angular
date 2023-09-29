import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-timing-list',
  templateUrl: './timing-list.component.html',
  styleUrls: ['./timing-list.component.css']
})
export class TimingListComponent implements OnInit {

  _userDetails: any;
  _schoolsTimeList: any;

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
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
        this._schoolsTimeList = res.schoolTimingDtlVo;
        console.log("_schoolsTimeList :", this._schoolsTimeList);
      }

    }, error => { this.closeLoader() })
  }

  deleteSchoolTime(id?: any) {
    console.log(id);

    let data = { id: '' };
    data.id = id;

    this.openLoader();
    this._authService.request('post', `schooluser/deleteSchoolTimingDtl`, data)
      .subscribe(res => {
        this.closeLoader();
        console.log(res);
        if (res.status == 200) {
        this.messageService.clear();
        this.messageService.add({severity:'success', summary:'', detail:"School timing details has been deleted."});
          // this.openSnackBar('Data deleted successfully');
          this.callSchoolByID(this._userDetails.schoolId);
        }


      }, error => {
        this.closeLoader();
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

}
