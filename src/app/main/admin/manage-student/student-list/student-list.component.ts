import { HelperService } from './../../../../_services/helper.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { UPDATE_USER_STATUS_ENDPOINT } from 'src/app/-shared/const';
import { ConfirmationService, MessageService } from 'primeng-lts/api';


@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
  providers:[ConfirmationService]
})
export class StudentListComponent implements OnInit {
  public submitted: boolean = false;
  checkReadonlyClass = 'lightgear';
  _userList: any;
  _userListSize: any;
  userSearchForm: FormGroup;
  _activeUsersCount: any = [];
  constructor(
    private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public helperService: HelperService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  ngOnInit(): void {
    this.initUserSearchForm();
    this.getActiveUsersCount();
    this.fetchListApi(this.itemsPerPage);
  }

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true });
    this._authService._adminHeader.next({ show: true });
    this._authService._adminFooter.next({ show: true });
  }

  pageReset() {
    this.schoolSearchForm.reset();
    this.initUserSearchForm();
    this.currentPage = 1;
    this.itemsPerPage = 25;
    this.fetchListApi(25);
  }

  initUserSearchForm = () => {
    this.userSearchForm = this.formBuilder.group({
      // schoolName:['', Validators.compose([Validators.required])],
      userName: [''],
      userEmail: [''],
      userPhone: [''],
      userType: [''],
      page: [1],
      size: [this.itemsPerPage],
      orderByColName: [''],
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
    const data = this.userSearchForm.value;
    data.size = +size;
    this.getPaginatedAndSortedData(data);
  }

  handlePageChange(event: any) {
    const data = this.userSearchForm.value;
    data.page = +event;
    data.size = this.itemsPerPage;
    console.log(event);
    this.getPaginatedAndSortedData(data);
  }

  searchUserList() {
    const data = this.userSearchForm.value;
    console.log('Search Parameters: ', data);
    data.page = 1;
    this.getPaginatedAndSortedData(data);
  }

  getPaginatedAndSortedData(data: any) {
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'schooluser/getUsersByCustomSearch', data)
      .subscribe(
        (response) => {
          console.log(response);

          if (response.status === 200) {
            this._userList = response.result;

            console.log('this._userList -->> ', this._userList);
            this._userListSize = response.noOfData;

            if (this.itemsPerPage >= this._userListSize) {
              this.itemsPerPage = this._userListSize;
            } else {
              this.itemsPerPage = +data.size;
            }
            console.log('items per page: ', this.itemsPerPage);

            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._userListSize) {
              this.currentPageEndingIndex = this._userListSize;
            }

            this.closeLoader();
          }
        },
        (error) => {
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
    const data = this.userSearchForm.value;
    data.orderByColumn = sort.active;
    data.sort = sort.direction;
    this._authService
      .request('post', 'schooluser/getUsersByCustomSearch', data)
      .subscribe(
        (response) => {
          console.log('sort response: ', response);

          if (response.status === 200) {
            this._userList = response.result;
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
            this.openSnackBar(`Schools ${schoolStatus} Successfully`);
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
  confirm(event: Event,status:any,user_id:any) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._authService.request('get',UPDATE_USER_STATUS_ENDPOINT+user_id+'&status='+status).subscribe((res)=>{
            console.log(res);
            const data = this.userSearchForm.value;
            data.size = +this.itemsPerPage;
            this.getPaginatedAndSortedData(data);
            this.messageService.clear()
            this.messageService.add({severity:'success', summary:'', detail:'User status has been updated.'});
          })
        },
        reject: () => {
          const data = this.userSearchForm.value;
          data.size = +this.itemsPerPage;
          this.getPaginatedAndSortedData(data);
        }
    });
  }
}
