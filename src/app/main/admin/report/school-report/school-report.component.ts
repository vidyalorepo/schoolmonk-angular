import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { minYearValidator } from 'src/app/_validators/Generic.validator';

@Component({
  selector: 'app-school-report',
  templateUrl: './school-report.component.html',
  styleUrls: ['./school-report.component.css']
})
export class SchoolReportComponent implements OnInit {

  SchoolReportForm: FormGroup;
  Submit=false;
  _Subsription: number | string;
  private _userDetails: any;
  private _user_id: any;
  private _result: any;
  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
  ) { 
    this.initReportForm();
  }

  ngOnInit(): void {
    this.hideShowCall();
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    this._user_id = this._userDetails.userId;
  }
  initReportForm() {
    this.SchoolReportForm = this.formBuilder.group({ 
      fromDate:['',Validators.compose([Validators.required, minYearValidator(1900)])],
      toDate:['',Validators.compose([Validators.required, minYearValidator(1900)])],
    
   })
  }
  getReport(){
    this.Submit=true;
  }
  hideShowCall() {
    // this._authService.loader.next({ load: false})
    this._authService._adminSideNavBar.next({ show: true })
    this._authService._adminHeader.next({ show: true })
    this._authService._adminFooter.next({ show: true })
  }

}
