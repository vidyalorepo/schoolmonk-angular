import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-short-list',
  templateUrl: './short-list.component.html',
  styleUrls: ['./short-list.component.css'],
})
export class ShortListComponent implements OnInit {
  userDetails: any;
  _shortListDetails: any;
  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userDetails = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails') || '')
      : '';
    if (
      localStorage.getItem('token') &&
      this.userDetails.userType != 'STUDENT_USER'
    ) {
      let url = this._authService.canNavigate();
      this.router.navigate([url]);
    }
    this.getShortListDetails(this.userDetails['studentId']);
  }

  getShortListDetails(id?: any) {
    this.openLoader();
    this._shortListDetails = [];
    this._authService
      .request('get', 'studentcontroller/sortlistedByStudent?studentId=' + id)
      .subscribe(
        (response) => {
          this.closeLoader();
          if (response.status == 200) {
            this._shortListDetails = response['result'];
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
      if (
        sclId != null &&
        admissionEndDate != null &&
        admissionForClass != null &&
        token != null
      ) {
        const redirectUrl = `auth/search-details/apply-school/${sclId}/${admissionEndDate}/${admissionForClass}/${token}`;
        this.router.navigate([redirectUrl]);
      } else {
        console.log('Data missing!!');
      }
    }
  }

  schoolNameClickHandler(currentApplicationDetails: any) {
    const sclId = currentApplicationDetails.schoolMstVo['id'];
    this.router.navigate([
      `auth/search-details/search-school-details/${sclId}`,
    ]);
  }

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: false });
    this._authService._adminHeader.next({ show: false });
    this._authService._adminFooter.next({ show: false });
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }
}
