import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabBody } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent implements OnInit {
  noticeList: any[] = [];
  _userDetails: any;
  currentPage = 1;
  itemsPerPage = 10;
  _noticeListSize: number;
  isEmpty = false;
  currentPageStartingIndex: any;
  currentPageEndingIndex: any;
  totalnumberofdata: number;
  data = {

    "page": 1,
    "size": 10
  }
  // totalength=12;
  // page:number=1;

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    this.fetchListApi();
  }

  fetchListApi() {

    this.openLoader();

    this._authService.loader.next({ load: true });
    this._authService
      .request('post', `noticeboard/getNoticeBySchoolId?schoolId=${this._userDetails.schoolId}`, this.data)
      .subscribe(
        (response) => {
          console.log(response);

          if (response.status === 200) {
            this.noticeList = response.result;


            console.log('this._schoolsList -->> ', this.noticeList);
            this._noticeListSize = response.noOfData;

            if (this.itemsPerPage >= this._noticeListSize) {
              this.itemsPerPage = this._noticeListSize;
            } else {
              this.itemsPerPage = +this.data.size;
            }

            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._noticeListSize) {
              this.currentPageEndingIndex = this._noticeListSize;
            }
            this.closeLoader();
          }
        },
        (error) => {
          console.error();
        }
      );
  }


  handlePageChange(event: any) {
    let data = this.data;
    data.page = +event;
    console.log(event);
    console.log(data);
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', `noticeboard/getNoticeBySchoolId?schoolId=${this._userDetails.schoolId}`, data)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this.noticeList = response.result;
            this._noticeListSize = response.noOfData;

            if (this.itemsPerPage >= this._noticeListSize) {
              this.itemsPerPage = this._noticeListSize;
            }
            else {
              this.itemsPerPage = +data.size;
            }
            console.log(this.itemsPerPage);

            this.currentPage = event;
            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;

            if (this.currentPageEndingIndex > this._noticeListSize) {
              this.currentPageEndingIndex = this._noticeListSize;
            }
            this.closeLoader();
          }
        },
        (error) => {
          this.closeLoader();
          console.error();
        }
      );
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }

}
