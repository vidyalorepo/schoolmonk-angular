import { HelperService } from './../../../../_services/helper.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MessageService } from 'primeng-lts/api';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css'],
})
export class SchoolListComponent implements OnInit {
  public submitted: boolean = false;
  checkReadonlyClass = 'lightgear';
  _schoolLevelCount: any;
  schoolStatusList:any = ['Active', 'In-Active'];
  schoolStatus: string;
  constructor(
    private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public helperService: HelperService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  _schoolsList: any[] = [];
  schoolSearchForm = new FormGroup({});

  currentPage = 1;
  itemsPerPage = 25;
  _schoolsListSize: number;
  currentPageStartingIndex: any;
  currentPageEndingIndex: any;
  isEmpty = false;

  _schoolBoardCount: any[] = [];
  sizearr=[25,50,100];
  ngOnInit(): void {
    this.schoolStatus = this.route.snapshot.paramMap.get('status');
    this.initSchoolSearchForm();
    this.getBoardSchoolCount();
    this.getLevelSchoolCount();
    this.fetchListApi(25);
  }

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true });
    this._authService._adminHeader.next({ show: true });
    this._authService._adminFooter.next({ show: true });
  }

  pageReset() {
    this.schoolSearchForm.reset();
    this.initSchoolSearchForm();
    this.currentPage = 1;
    this.itemsPerPage = 25;

    this.fetchListApi(25);
  }

  initSchoolSearchForm = () => {
    this.schoolSearchForm = this.formBuilder.group({
      // schoolName:['', Validators.compose([Validators.required])],
      schoolName: [''],
      schoolAddress: [''],
      contactEmail: [''],
      contactPhone: [''],
      contactPersonFirstName: [''],
      page: [1],
      size: [this.itemsPerPage],
      orderByColName: [''],
      orderBy: [''],
      schoolStatus: [''],
    });
  };

  getBoardSchoolCount() {
    this._authService.request('get', 'dashboard/schoolBoardCount').subscribe(
      (res) => {
        if (res.status == 200) {
          this._schoolBoardCount = res.result;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getLevelSchoolCount() {
    this._authService.request('get', 'dashboard/schoolLevelCount').subscribe(
      (res) => {
        if (res.status == 200) {
          this._schoolLevelCount = res.result;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchListApi(size: any) {
    const data = this.schoolSearchForm.value;
    this.itemsPerPage = +size;
    data.size = +size;
    this.openLoader();
    console.log(size);

    console.log(data);
    if (this.schoolStatus == "in-active") {
      data.schoolStatus="In-Active"
    }
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'schooluser/getSchoolByInput', data)
      .subscribe(
        (response) => {
          console.log(response);

          if (response.status === 200) {
            this._schoolsList = response.result;

            console.log('this._schoolsList -->> ', this._schoolsList);
            this._schoolsListSize = response.noOfData;

            if (this.itemsPerPage >= this._schoolsListSize) {
              this.itemsPerPage = this._schoolsListSize;
            } else {
              this.itemsPerPage = +data.size;
            }

            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._schoolsListSize) {
              this.currentPageEndingIndex = this._schoolsListSize;
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
    const data = this.schoolSearchForm.value;
    data.page = +event;
    console.log(event);
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'schooluser/getSchoolByInput', data)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this._schoolsList = response.result;
            this._schoolsListSize = response.noOfData;

            if (this.itemsPerPage >= this._schoolsListSize) {
              this.itemsPerPage = this._schoolsListSize;
            } else {
              this.itemsPerPage = +data.size;
            }
            console.log(this.itemsPerPage);

            this.currentPage = event;
            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;

            if (this.currentPageEndingIndex > this._schoolsListSize) {
              this.currentPageEndingIndex = this._schoolsListSize;
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

  searchSchoolList() {
    const data = this.schoolSearchForm.value;
    data.page = 1;
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'schooluser/getSchoolByInput', data)
      .subscribe(
        (response) => {
          console.log('response ==>> ', response);

          if (response.status === 200) {
            this._schoolsList = response.result;
            this._schoolsListSize = response.noOfData;

            if (this.itemsPerPage >= this._schoolsListSize) {
              this.itemsPerPage = this._schoolsListSize;
            } else {
              this.itemsPerPage = +data.size;
            }

            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._schoolsListSize) {
              this.currentPageEndingIndex = this._schoolsListSize;
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
  viewSchoolDetails(id: any) {
    this.router.navigate(['/manage-school/school-list/view-school/' + id]);
  }
  editSchool(id: any) {
    this.router.navigate(['/manage-school/school-list/edit-school/' + id]);
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
    const data = this.schoolSearchForm.value;
    data.orderByColName = sort.active;
    data.orderBy = sort.direction;
    this._authService
      .request('post', 'schooluser/getSchoolByInput', data)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this._schoolsList = response.result;
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
    console.log(event.target)
    this.arraySend = [];
    for (var i = 0; i < this._schoolsList.length; i++) {
      if (event.target.checked) {
        console.log('index Id-->> ', this._schoolsList[i].id);
        this.arraySend.push(this._schoolsList[i].id);
      } else {
        let index = this.arraySend.findIndex(
          (d: { id: any }) => d.id === this._schoolsList[i].id
        ); //find index in your array
        this.arraySend.splice(index, 1);
      }
      this._schoolsList[i].selected = this.selectedAll;
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
    this.selectedAll = this._schoolsList.every(function (item: any) {
      return item.selected == true;
    });
  }
  changeSelectedStatus(schoolStatus: any) {
    let idListString: any = [];
    // let schoolStatus, msgString = '';
    // if(id === 0){
    //   schoolStatus = "Active";
    //   msgString = 'Schools Activated Successfully';
    //   for (let i = 0; i < this.arraySend.length; i++) {
    //     idListString[i] = this.arraySend[i].id
    //   }
    // }else{
    //   schoolStatus = "In-Active";
    //   idListString[0] = id;
    //   msgString = 'School In-Activated Successfully';
    // }
    const data = {
      idList: this.arraySend,
      schoolStatus: schoolStatus,
    };
    console.log('Activate data--> ', data);
    // return
    this.openLoader();
    this._authService
      .request('post', `schooluser/updateSchoolStatus`, data)
      .subscribe(
        (response) => {
          console.log('value', response);
          if (response.status === 200) {
            // this.openSnackBar(`Schools ${schoolStatus} Successfully`);
            this.messageService.clear();
            this.messageService.add({severity:'success', summary:'', detail:`Schools ${schoolStatus} Successfully`});
            this.ngOnInit();
            this.closeLoader();
          }
        },
        (error) => {
          this.closeLoader();
          console.log(error);
        }
      );
  }

  _modalData:number;
  modalOpen(data:any){
    console.log(data);
    this._modalData = 0
    this._modalData = +data
  }
}
