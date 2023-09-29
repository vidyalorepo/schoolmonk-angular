import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-admission-list-comp',
  templateUrl: './admission-list-comp.component.html',
  styleUrls: ['./admission-list-comp.component.css']
})
export class AdmissionListCompComponent implements OnInit {


  public submitted: boolean = false;
  checkReadonlyClass = 'lightgear';
  _userDetails: any;

  _schooladmissionRecords: any;
  currentPage = 1;
  itemsPerPage = 10;
  _schooladmissionRecordssize: number;
  isEmpty = false;
  currentPageStartingIndex: any;
  currentPageEndingIndex: any;
  totalnumberofdata: number;
  schoolid: any;
  data = {
    "page": 1,
    "size": 10
  }
  constructor(private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  _schoolsList: any[] = [];
  schoolSearchForm = new FormGroup({})


  // isEmpty = false;

  _schoolBoardCount: any[] = [];

  ngOnInit(): void {
    this.getBoardSchoolCount();

    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    console.log(this._userDetails);
    this.schoolid = this._userDetails.schoolId;

    if (this._userDetails) {
      this.callSchoolByID(this._userDetails.schoolId)
    }

  }


  // callSchoolByID(id: any) {
  //   this.openLoader()
  //   this._authService.request('get', 'schooluser/school/' + id).subscribe((res) => {
  //     this.closeLoader();
  //     if (res.schoolLevelDtlVo !== null) {
  //       this.arraySend = [];
  //       this.selectedAll = false;
  //       console.log('School :', res);
  //       this._schooladmissionRecords = res.schoolAdmissionDtlVo;
  //       console.log("this._schooladmissionRecords--> ", this._schooladmissionRecords);

  //     }

  //   }, error => { this.closeLoader() })
  // }

  callSchoolByID(id: any) {

    this.openLoader();

    this._authService.loader.next({ load: true });
    this._authService
      .request('post', `schooluser/school?schoolId=${id}`, this.data)
      .subscribe(
        (response) => {
          console.log(response);

          if (response.status === 200) {
            this._schooladmissionRecords = response.result;


            console.log('this._schoolsList -->> ', this._schoolsList);
            this._schooladmissionRecordssize = response.noOfData;

            if (this.itemsPerPage >= this._schooladmissionRecordssize) {
              this.itemsPerPage = this._schooladmissionRecordssize;
            } else {
              this.itemsPerPage = +this.data.size;
            }

            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._schooladmissionRecordssize) {
              this.currentPageEndingIndex = this._schooladmissionRecordssize;
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
      .request('post', `schooluser/school?schoolId=${this.schoolid}`, data)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this._schooladmissionRecords = response.result;
            this._schooladmissionRecordssize = response.noOfData;

            if (this.itemsPerPage >= this._schooladmissionRecordssize) {
              this.itemsPerPage = this._schooladmissionRecordssize;
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

            if (this.currentPageEndingIndex > this._schooladmissionRecordssize) {
              this.currentPageEndingIndex = this._schooladmissionRecordssize;
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

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true })
    this._authService._adminHeader.next({ show: true })
    this._authService._adminFooter.next({ show: true })
  }





  getBoardSchoolCount() {
    this._authService.request('get', 'dashboard/schoolBoardCount').subscribe(res => {
      if (res.status == 200) {
        this._schoolBoardCount = res.result;
      }

    }, (error) => {
      console.error(error);
    })
  }


  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }
  viewSchoolDetails(id: any) {
    this.router.navigate(['/manage-school/school-list/view-school/' + id])
  }
  editSchool(id: any) {
    this.router.navigate(['/manage-school/school-list/edit-school/' + id])
  }





  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }



  arraySend: any = [];
  selectCheck(event: any, data: any) {
    console.log(event.target.checked);

    if (event.target.checked) {
      console.log("index Id-->> ", data);
      this.arraySend.push(data);
    } else {
      let index = this.arraySend.findIndex((d: { id: any; }) => d.id === data); //find index in your array
      this.arraySend.splice(index, 1);
    }
    if (this.arraySend.length > 0) {
      this.checkReadonlyClass = 'deepgear';
    } else {
      this.checkReadonlyClass = 'lightgear';
    }
    console.log("this.arraySend ", this.arraySend);
  }


  isShown: boolean = false; // hidden by default
  toggleShow() {
    this.isShown = !this.isShown;
    console.log(this.isShown);

  }
  selectedAll: any;
  selectAll(event: any) {
    this.arraySend = [];
    for (var i = 0; i < this._schooladmissionRecords.length; i++) {
      if (event.target.checked) {
        console.log("index Id-->> ", this._schooladmissionRecords[i].id);
        this.arraySend.push(this._schooladmissionRecords[i].id);

      } else {
        let index = this.arraySend.findIndex((d: { id: any; }) => d.id === this._schooladmissionRecords[i].id); //find index in your array
        this.arraySend.splice(index, 1);
      }
      this._schooladmissionRecords[i].selected = this.selectedAll;
    }
    console.log(this.arraySend.length);
    console.log(this.arraySend);
    if (this.arraySend.length > 0) {
      this.checkReadonlyClass = 'deepgear';
    } else {
      this.checkReadonlyClass = 'lightgear';
    }

  }

  checkIfAllSelected() {
    this.selectedAll = this._schooladmissionRecords.every(function (item: any) {
      return item.selected == true;
    })
  }

  changePublish(publishStatus: any) {
    const data = {
      idList: this.arraySend,
      publishStatus: publishStatus
    }
    console.log("IDS data--> ", data);
    // return
    this.openLoader();
    this._authService.request('post', `schooluser/publishBulk`, data).subscribe(
      response => {
        console.log('value', response);
        if (response.status === 200) {
          this.openSnackBar(`Admission Published Successfully`)
          this.ngOnInit();
          this.closeLoader();
        }
      },
      error => {
        this.closeLoader();
        console.log(error)
      }
    );
  }





}
