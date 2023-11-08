import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { error } from 'console';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  _userDetailes: any;
  _schoolActiveCount: any;
  _schoolInActiveCount: any;
  _activeUsersCount: any;
  _totalUsersCount: any;
  _activeTestimonialsCount: any;
  _totalTestimonialsCount: any;
  _activeIssuesCount: any;
  _totalIssuesCount: any;
  _activeFeedbackCount: any;
  _totalFeedbackCount: any;
  _activeNewsCount: any;
  _totalNewsCount: any;
  _activeBlogsCount: any;
  _totalBlogsCount: any;
  _activeReviewsCount: any;
  _totalReviewssCount: any;
  _activeGuardianEnquiryCount: any;
  _totalGuardianEnquiryCount: any;
  constructor(
    private _formBuilder: FormBuilder,
    // private router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this._userDetailes = JSON.parse(localStorage.getItem('userDetails') || '');
    console.log(this._userDetailes);
    if (this._userDetailes['userType'] == 'SCHOOL_USER') {
      this._authService.searchSchool.next({ search: false });
    }
    this.hideShowCall();

    this.getSchoolActiveCount('Active');
    this.getSchoolInActiveCount('In-Active');
    this.getActiveUsersCount();
    this.getActiveTestimonialsCount();
    this.getActiveIssuesCount();
    this.getActiveFeedbackCount();
    this.getActiveNewsCount();
    this.getActiveBlogCount();
    this.getActiveReviewsCount();
    this.getActiveGuardianEnquiryCount();
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }

  hideShowCall() {
    // this._authService.loader.next({ load: false})
    this._authService._adminSideNavBar.next({ show: true });
    this._authService._adminHeader.next({ show: true });
    this._authService._adminFooter.next({ show: true });
  }

  getSchoolActiveCount(stat?: any) {
    this.openLoader();
    const data: any = {};
    data.schoolStatus = stat;
    this._authService
      .request('post', 'dashboard/getSchoolCountByStatus', data)
      .subscribe(
        (res) => {
          this.closeLoader();
          console.log(res);
          if (res.status == 200) {
            this._schoolActiveCount = res.result;
          }
        },
        (error) => {
          this.closeLoader();
        }
      );
  }

  getSchoolInActiveCount(stat?: any) {
    this.openLoader();
    const data: any = {};
    data.schoolStatus = stat;
    this._authService
      .request('post', 'dashboard/getSchoolCountByStatus', data)
      .subscribe(
        (res) => {
          this.closeLoader();
          console.log(res);
          if (res.status == 200) {
            this._schoolInActiveCount = res.result;
          }
        },
        (error) => {
          this.closeLoader();
        }
      );
  }
  getActiveUsersCount() {
    this._totalUsersCount = 0;
    this._authService.request('get', 'dashboard/activeUsersCount').subscribe(
      (res) => {
        res.result.map((item: any) => {
          if (item.userType) {
            this._totalUsersCount += item.typeCount;
          }
        });
        console.log('Active users count: ', this._activeUsersCount);
      },
      (error) => {
        console.error(error);
      }
    );
    console.log('total users: ', this._totalUsersCount);
  }

  getActiveTestimonialsCount() {
    this._totalTestimonialsCount = 0;
    this._authService.request('get', 'dashboard/testimonialcount').subscribe(
      (res) => {
        if (res.result) {
          this._totalTestimonialsCount = res.result;
        }
        console.log('Active testimonials count: ', this._activeTestimonialsCount);
      },
      (error) => {
        console.error(error);
      }
    );
    console.log('total testimonials: ', this._totalTestimonialsCount);
  } 
  
  getActiveIssuesCount(){
    this._totalIssuesCount = 0;
    this._authService.request('get', 'dashboard/issueCount').subscribe(
      (res) => {
        res.result.map((item: any) => {
          if (item.issueState == 'Resolved') {
            this._totalIssuesCount += item.typeCount;
          }
        });
        console.log('Active issues count: ', this._activeIssuesCount);
      },
      (error) => {
        console.error(error);
      }
    );
    console.log('total issues: ', this._totalIssuesCount);
  }

  getActiveFeedbackCount(){
    this._totalFeedbackCount = 0;
    this._authService.request('get', 'dashboard/feedbackcount').subscribe(
      (res) => {
        if (res.result) {
          this._totalFeedbackCount = res.result;
        }
        console.log('Active testimonials count: ', this._activeFeedbackCount);
      },
      (error) => {
        console.error(error);
      }
    );
    console.log('total testimonials: ', this._totalFeedbackCount);
  }

  getActiveNewsCount(){
    this._totalNewsCount = 0;
    this._authService.request('get', 'dashboard/newscount').subscribe(
      (res) => {
        if (res.result) {
          this._totalNewsCount = res.result;
        }
        console.log('Active news count: ', this._activeNewsCount);
      },
      (error) => {
        console.error(error);
      }
    );
    console.log('total news: ', this._totalNewsCount);
  }

  getActiveBlogCount(){
    this._totalBlogsCount = 0;
    this._authService.request('get', 'dashboard/blogcount').subscribe(
      (res) => {
        if (res.result) {
          this._totalBlogsCount = res.result;
        }
        console.log('Active blogs count: ', this._activeBlogsCount);
      },
      (error) => {
        console.error(error);
      }
    );
    console.log('total blogs: ', this._totalBlogsCount);
  }

  getActiveReviewsCount(){
    this._totalReviewssCount = 0;
    this._authService.request('get', 'dashboard/reviewcount').subscribe(
      (res) => {
        if (res.result) {
          this._totalReviewssCount = res.result;
        }
        console.log('Active reviews count: ', this._activeReviewsCount);
      },
      (error) => {
        console.error(error);
      }
    );
    console.log('total reviews: ', this._totalReviewssCount);
  }

  getActiveGuardianEnquiryCount(){
    this._totalGuardianEnquiryCount = 0;
    this._authService.request('get', 'dashboard/guardianenquirycount').subscribe(
      (res) => {
        if (res.result) {
          this._totalGuardianEnquiryCount = res.result;
        }
        console.log('Active enquiry count: ', this._activeGuardianEnquiryCount);
      },
      (error) => {
        console.error(error);
      }
    );
    console.log('total enquiry: ', this._totalGuardianEnquiryCount);
  }
}
