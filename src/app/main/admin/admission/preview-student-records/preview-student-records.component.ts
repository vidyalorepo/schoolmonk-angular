import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-preview-student-records',
  templateUrl: './preview-student-records.component.html',
  styleUrls: ['./preview-student-records.component.css'],
  providers: [DatePipe]
})
export class PreviewStudentRecordsComponent implements OnInit {
  _viewID: string;
  studentApplicationVo: any;
  schoolDtl: any;

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe) { }
    
    _academicYr: any;
    _academicYrArr: any=[];
    private _userDetails: any;
    studentApplication: any;

    ngOnInit(): void {
      this.hideShowCall();
      this._viewID = this.activatedRoute.snapshot.paramMap.get('id') || '';
      this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
      console.log(this._userDetails);
      this.callStudentApplication(this._viewID)

      // console.log(this.router.url);
      
    }
    callStudentApplication(id:any){
      const data = {
        registrationToken: id
      }
      this.openLoader()
      this._authService.request('post', `studentcontroller/previewStudentApplication`, data).subscribe((res) => {
        this.closeLoader();
        if (res) {
          console.log(res);
          this.studentApplication = res.result;
          this.studentApplicationVo = res.result.studentMstVo;
          this.schoolDtl = res.result.schoolMstVo; 
        }else{
          console.log("No records found!!");
          
        }
  
      }, error => { this.closeLoader() })
    }
    printReport() {
      document.title = 'applicant_form'
      window.print();
    }
    hideShowCall(){
      // this._authService.loader.next({ load: false})
      this._authService._adminSideNavBar.next({show: true})
      this._authService._adminHeader.next({show: true})
      this._authService._adminFooter.next({show: true})
    }
    openLoader() { this._authService.loader.next({ load: true, }) }
  
    closeLoader() { this._authService.loader.next({ load: false }) }


    backRoute(){
      if(this.router.url.includes('auth')){
        this.router.navigate(['/auth/student/student-list'])
      }else{
        this.router.navigate(['/admission/admission-records'])
      }
    }

}
