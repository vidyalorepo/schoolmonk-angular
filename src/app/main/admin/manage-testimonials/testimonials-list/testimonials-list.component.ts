import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import { HelperService } from 'src/app/_services/helper.service';

@Component({
  selector: 'app-testimonials-list',
  templateUrl: './testimonials-list.component.html',
  styleUrls: ['./testimonials-list.component.css'],
})
export class TestimonialsListComponent implements OnInit {
  checkReadonlyClass = 'lightgear';
  _testimonialList: any = [];
  _testimonialListSize: any;
  testimonialSearchForm: FormGroup;
  _activeUsersCount: any = [];
  _publishData: any = {
    ids: [],
    code: 0,
  };
  constructor(
    private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public helperService: HelperService,
    private messageService: MessageService
  ) {}

  currentPage = 1;
  itemsPerPage = 25;
  _schoolsListSize: number;
  currentPageStartingIndex: any;
  currentPageEndingIndex: any;
  isEmpty = false;

  ngOnInit(): void {
    this.initUserSearchForm();
    this.fetchListApi(this.itemsPerPage);
  }

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true });
    this._authService._adminHeader.next({ show: true });
    this._authService._adminFooter.next({ show: true });
  }

  pageReset() {
    this.testimonialSearchForm.reset();
    this.initUserSearchForm();
    this.currentPage = 1;
    this.itemsPerPage = 25;
    this.fetchListApi(25);
  }

  initUserSearchForm = () => {
    this.testimonialSearchForm = this.formBuilder.group({
      // schoolName:['', Validators.compose([Validators.required])],
      name: [''],
      designation: [''],
      institution: [''],
      page: [1],
      size: [this.itemsPerPage],
      orderByColumn: [''],
      sort: [''],
    });
  };
  getActiveUsersCount() {
    this._authService.request('get', 'dashboard/activeUsersCount').subscribe(
      (res) => {
        res.result.map((item: any) => {
          if (item.userType) {
            this._activeUsersCount.push(item);
          }
        });
        console.log('Active users count: ', this._activeUsersCount);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  fetchListApi(size: any) {
    const data = this.testimonialSearchForm.value;
    data.size = +size;
    this.getPaginatedAndSortedData(data);
  }

  handlePageChange(event: any) {
    const data = this.testimonialSearchForm.value;
    data.page = +event;
    data.size = this.itemsPerPage;
    console.log(event);
    this.getPaginatedAndSortedData(data);
  }

  searchTestimonialList() {
    const data = this.testimonialSearchForm.value;
    console.log('Search Parameters: ', data);
    data.page = 1;
    this.getPaginatedAndSortedData(data);
  }

  getPaginatedAndSortedData(data: any) {
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'testimonials/gettestimonials', data)
      .subscribe(
        (response) => {
          console.log(response);

          if (response.status === 200) {
            this._testimonialList = response.result;

            console.log('this._testimonialList -->> ', this._testimonialList);
            this._testimonialListSize = response.noOfData;

            if (this.itemsPerPage >= this._testimonialListSize) {
              this.itemsPerPage = this._testimonialListSize;
            } else {
              this.itemsPerPage = +data.size;
            }
            console.log('items per page: ', this.itemsPerPage);

            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._testimonialListSize) {
              this.currentPageEndingIndex = this._testimonialListSize;
            }

            this.closeLoader();
          }
        },
        (error) => {
          console.error();
        }
      );
  }
  onCheckBoxClick(id: any) {
    this.arraySend.push(id);
    console.log('this.arraySend : ', this.arraySend);
  }

  makePublishCall(_status: number) {
    this._publishData['ids'] = this.arraySend;
    this._publishData['code'] = _status;
    this.openLoader();
    this._authService
      .request('post', 'testimonials/togglePublish', this._publishData)
      .subscribe((res) => {
        if (res.code === 200) {
          this.arraySend = [];
          this._publishData = [];
          // this.openSnackBar('Testimonials Published');
        }
        this.messageService.clear();
        this.messageService.add({severity:'success', summary:'', detail:(_status == 1)? "Testimonials has been published":"Testimonials has been unpublised"});
        this.fetchListApi(this.itemsPerPage);
        this.closeLoader();
      });
  }
  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }
  viewUserDetails(id: any) {
    this.router.navigate(['/manage-student/student-list/view-student/' + id]);
  }
  editSchool(id: any) {
    // this.router.navigate(['/manage-stata: 1udent/student-list/edit-student/' + id]);
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  sortData(sort: Sort) {
    console.log('sorting call');
    console.log(sort);
    const data = this.testimonialSearchForm.value;
    data.orderByColumn = sort.active;
    data.sort = sort.direction;
    this._authService
      .request('post', 'testimonials/gettestimonials', data)
      .subscribe(
        (response) => {
          console.log('sort response: ', response);

          if (response.status === 200) {
            this._testimonialList = response.result;
          } else {
            console.log('Error while fetching...');
          }
        },
        (error) => {
          console.error();
        }
      );
  }

  arraySend: any = [];
  selectCheck(event: any, data: any) {
    console.log(event.target.checked);

    if (event.target.checked) {
      console.log('index Id-->> ', data);
      this.arraySend.push(data);
    } else {
      let index = this.arraySend.findIndex((d: { id: any }) => d.id === data); //find index in your array
      this.arraySend.splice(index, 1);
    }
    if (this.arraySend.length > 0) {
      this.checkReadonlyClass = 'deepgear';
    } else {
      this.checkReadonlyClass = 'lightgear';
    }
    console.log('this.arraySend ', this.arraySend);
  }

  isShown: boolean = false; // hidden by default
  toggleShow() {
    this.isShown = !this.isShown;
    console.log(this.isShown);
  }
  selectedAll: any;
  selectAll(event: any) {
    this.arraySend = [];
    for (var i = 0; i < this._testimonialList.length; i++) {
      if (event.target.checked) {
        console.log('index Id-->> ', this._testimonialList[i].id);
        this.arraySend.push(this._testimonialList[i].id);
      } else {
        let index = this.arraySend.findIndex(
          (d: { id: any }) => d.id === this._testimonialList[i].id
        ); //find index in your array
        this.arraySend.splice(index, 1);
      }
      this._testimonialList[i].selected = this.selectedAll;
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
    this.selectedAll = this._testimonialList.every(function (item: any) {
      return item.selected == true;
    });
  }
  // changeSelectedStatus(schoolStatus: any) {
  //   let idListString: any = [];
  //   // let schoolStatus, msgString = '';
  //   // if(id === 0){
  //   //   schoolStatus = "Active";
  //   //   msgString = 'Schools Activated Successfully';
  //   //   for (let i = 0; i < this.arraySend.length; i++) {
  //   //     idListString[i] = this.arraySend[i].id
  //   //   }
  //   // }else{
  //   //   schoolStatus = "In-Active";
  //   //   idListString[0] = id;
  //   //   msgString = 'School In-Activated Successfully';
  //   // }
  //   const data = {
  //     idList: this.arraySend,
  //     schoolStatus: schoolStatus,
  //   };
  //   console.log('Activate data--> ', data);
  //   // return
  //   this.openLoader();
  //   this._authService
  //     .request('post', `schooluser/updateSchoolStatus`, data)
  //     .subscribe(
  //       (response) => {
  //         console.log('value', response);
  //         if (response.status === 200) {
  //           this.openSnackBar(`Schools ${schoolStatus} Successfully`);
  //           this.ngOnInit();
  //           this.closeLoader();
  //         }
  //       },
  //       (error) => {
  //         this.closeLoader();
  //         console.log(error);
  //       }
  //     );
  // }
}
