import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { minYearValidator } from 'src/app/_validators/Generic.validator';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  AdminReportFrom!:FormGroup;
  constructor(
    private _authService : AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.initReportFrom();
   }

  ngOnInit(): void {
    this.hideShowCall();
  }

  initReportFrom(){
     this.AdminReportFrom=this.formBuilder.group({
      orderDateFrom:['',Validators.required],
      orderDateTo:['',Validators.required]
     })
  } 

  hideShowCall(){
    // this._authService.loader.next({ load: false})
    this._authService._adminSideNavBar.next({show: true})
    this._authService._adminHeader.next({show: true})
    this._authService._adminFooter.next({show: true})
  }

}
