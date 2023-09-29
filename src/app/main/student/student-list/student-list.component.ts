import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  userDetails: any;
  _shortListDetails: any;
  _applicantDetails: any[];
  _shortListArray: any = [[]];
  favSchoolList: any;
  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails')) || '';
    console.log(this.userDetails);
    this.getStudentList();
    this.getFavouriteSchool(this.userDetails.userId);
  }

  getFavouriteSchool(userId: any) {
    if(userId){
      this._authService
      .request('get', `schooluser/findFavourieSchools?userId=${userId}`)
      .subscribe((response) => {
        if (response.status == 200) {
          this.favSchoolList = response.result;
          console.log('this.favSchoolList--> ', this.favSchoolList);
        }
      },(error) =>{
        console.log(error);
        
      });
    }
  }
  getStudentList() {
    this._applicantDetails = [];
    this.openLoader();
    var id: any = this.userDetails.userId;
    this._authService
      .request(
        'get',
        'studentcontroller/getStudentApplicant?studentUserId=' + id
      )
      .subscribe(
        (response) => {
          console.log(response);

          this.closeLoader();
          if (response.status == 200) {
            this._applicantDetails = response['result'];
            // this.callShortListApi(this._applicantDetails );
            console.log('_applicantDetails Details: ', this._applicantDetails);
          }
        },
        (error) => {
          this.closeLoader();
        }
      );
  }
  // callShortListApi(_applicantDetails: any[]) {
  //   _applicantDetails.forEach(element => {
  //     this.getShortListDetails(element.code)
  //   });
  //   console.log('this._shortListArray',this._shortListArray);

  // }

  getShortListDetails(id?: any, index?: any) {
    this.openLoader();
    this._shortListDetails = [];
    this._authService
      .request('get', 'studentcontroller/sortlistedByStudent?studentId=' + id)
      .subscribe(
        (response) => {
          this.closeLoader();
          if (response.status == 200) {
            this._shortListDetails = response['result'];
            // this._shortListArray.push(this._shortListDetails);
            console.log('Short List Details: ', this._shortListDetails);
          }
        },
        (error) => {
          this.closeLoader();
        }
      );
  }

  applicationStatusClickHandler(currentApplicationDetails: any) {
    console.log('current application details:  ', currentApplicationDetails);

    // return
    const sclId = currentApplicationDetails.schoolMstVo['id'];
    const token = currentApplicationDetails.registrationToken;

    if (
      currentApplicationDetails.admissionStatus.toLowerCase() ===
        'payment completed' ||
      currentApplicationDetails.admissionStatus.toLowerCase() === 'denied' ||
      currentApplicationDetails.admissionStatus.toLowerCase() ===
        'interview pending' ||
      currentApplicationDetails.admissionStatus.toLowerCase() ===
        'admission offered'
    )
      this.router.navigate(['auth/admission/preview-records/' + token]);
    else {
      const admissionEndDate = currentApplicationDetails.admissionEndDate;
      const admissionForClass = currentApplicationDetails.admissionForClass;
      const studentId = currentApplicationDetails.studentMstVo.id;
      const _dateOfBirthApplicant =
        currentApplicationDetails.studentMstVo.dateOfBirth;
      const _selectedBoard = currentApplicationDetails.admissionForBoard;
      const _academicYr = currentApplicationDetails.academicYear;
      if (
        sclId != null &&
        admissionEndDate != null &&
        admissionForClass != null &&
        token != null
      ) {
        const redirectUrl = `auth/search-details/apply-school/${sclId}/${admissionEndDate}/${admissionForClass}/${studentId}/${_dateOfBirthApplicant}/${_selectedBoard}/${_academicYr}`;
        this.router.navigate([redirectUrl]);
      } else {
        console.log('Data missing!!');
      }
    }
  }
  downloadRecipt(admissionId:any){
    this.openLoader();
    this._authService.fileDownloadRequest(`/pdfcontroller/downloadPaymentPDF/?admissionId=${admissionId}`).subscribe((res:any)=>{
      const blob = new Blob([res], {
        type: 'application/pdf',
      });
      this.closeLoader();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      console.log("link href...>>",link.href);
      link.download = 'Invoice_' + admissionId;
      link.click();
    },(e)=>{
      console.log(e);
      this.closeLoader();
    })
  }
  schoolNameClickHandler(currentApplicationDetails: any) {
    const sclId = currentApplicationDetails.schoolMstVo['schoolNameSlug'];
    this.router.navigate([
      `auth/search-details/search-school-details/${sclId}`,
    ]);
  }
  schoolNameClickHandler1(schoolNameSlug: any) {
    this.router.navigate([
      `auth/search-details/search-school-details/${schoolNameSlug}`,
    ]);
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }
}
