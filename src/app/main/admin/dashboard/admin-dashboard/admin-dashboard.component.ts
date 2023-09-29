import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
}
