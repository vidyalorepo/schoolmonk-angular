import { HelperService } from './../../../../_services/helper.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MessageService } from 'primeng-lts/api';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css'],
})
export class IssueListComponent implements OnInit {
  public submitted: boolean = false;
  checkReadonlyClass = 'lightgear';
  _schoolLevelCount: any;
  _issueList: any;
  _issueListSize: any;
  _issuesCount: any;
  constructor(
    private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public helperService: HelperService,
    private messageService: MessageService
  ) {}

  _schoolsList: any[] = [];
  issueSearchForm = new FormGroup({});

  currentPage = 1;
  itemsPerPage = 25;
  _schoolsListSize: number;
  currentPageStartingIndex: any;
  currentPageEndingIndex: any;
  isEmpty = false;

  _schoolBoardCount: any[] = [];

  ngOnInit(): void {
    this.initIssueSearchForm();
    this.getIssuesCount();

    this.fetchListApi(this.itemsPerPage);
  }

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true });
    this._authService._adminHeader.next({ show: true });
    this._authService._adminFooter.next({ show: true });
  }

  pageReset() {
    this.issueSearchForm.reset();
    this.currentPage = 1;
    this.itemsPerPage = 25;

    this.fetchListApi(25);
  }

  initIssueSearchForm = () => {
    this.issueSearchForm = this.formBuilder.group({
      // schoolName:['', Validators.compose([Validators.required])],
      issuerName: [''],
      issuerFirstName: [''],
      issuerLastName: [''],
      issuerEmail: [''],
      issueState: [''],
      ticketId: [''],
      page: [1],
      size: [this.itemsPerPage],
      orderByColumn: [''],
      sort: [''],
    });
  };

  getIssuesCount() {
    this._authService.request('get', 'dashboard/issueCount').subscribe(
      (res) => {
        if (res.status == 200) {
          this._issuesCount = res.result;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchListApi(size: any) {
    const data = this.issueSearchForm.value;
    data.size = +size;
    this.getPaginatedAndSortedData(data);
  }
  handlePageChange(event: any) {
    const data = this.issueSearchForm.value;
    data.page = +event;
    data.size = this.itemsPerPage;
    this.currentPage = event;
    console.log(event);
    this.getPaginatedAndSortedData(data);
  }
  searchIssueList() {
    const data = this.issueSearchForm.value;
    console.log('Search Parameters: ', data);
    data.page = 1;
    this.currentPage = 1;
    this.getPaginatedAndSortedData(data);
  }
  getPaginatedAndSortedData(data: any) {
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService.request('post', 'helpdesk/getIssues', data).subscribe(
      (response) => {
        console.log(response);

        if (response.status === 200) {
          this._issueList = response.result;

          console.log('this._issueList -->> ', this._issueList);
          this._issueListSize = response.noOfData;

          if (this.itemsPerPage >= this._issueListSize) {
            this.itemsPerPage = this._issueListSize;
          } else {
            this.itemsPerPage = +data.size;
          }
          console.log('items per page: ', this.itemsPerPage);

          this.currentPageStartingIndex =
            (this.currentPage - 1) * this.itemsPerPage + 1;

          this.currentPageEndingIndex =
            this.currentPageStartingIndex + this.itemsPerPage - 1;
          if (this.currentPageEndingIndex > this._issueListSize) {
            this.currentPageEndingIndex = this._issueListSize;
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
  viewIssueDetails(id: any) {
    this.router.navigate(['/manage-issues/issue-list/view-issue/' + id]);
  }
  editSchool(id: any) {
    // this.router.navigate(['/manage-school/school-list/edit-school/' + id]);
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
    const data = this.issueSearchForm.value;
    data.orderByColumn = sort.active;
    data.sort = sort.direction;
    this._authService.request('post', 'helpdesk/getIssues', data).subscribe(
      (response) => {
        if (response.status === 200) {
          this._issueList = response.result;
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
      let index = this.arraySend.findIndex((d: { issueId: any }) => d.issueId === data); //find index in your array
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
    for (var i = 0; i < this._issueList.length; i++) {
      if (event.target.checked) {
        console.log('index Id-->> ', this._issueList[i].issueId);
        this.arraySend.push(this._issueList[i].issueId);
      } else {
        let index = this.arraySend.findIndex(
          (d: { id: any }) => d.id === this._issueList[i].issueId
        ); //find index in your array
        this.arraySend.splice(index, 1);
      }
      this._issueList[i].selected = this.selectedAll;
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
    this.selectedAll = this._issueList.every(function (item: any) {
      return item.selected == true;
    });
  }
  changeSelectedStatus(issueStatus: any) {
    let idListString: any = [];
    const data = {
      issueIdList: this.arraySend,
      issueState: issueStatus,
    };
    console.log('Activate data--> ', data);
    // return;
    this.openLoader();
    this._authService
      .request('post', `helpdesk/updateIssueState`, data)
      .subscribe(
        (response) => {
          console.log('value', response);
          if (response.status === 200) {
            this.messageService.clear();
            this.messageService.add({severity:'success', summary:'', detail:`Issues ${issueStatus} Successfully`});
            // this.openSnackBar(`Issues ${issueStatus} Successfully`);
            this.ngOnInit();
            this.arraySend = [];
            this.closeLoader();
          }
        },
        (error) => {
          this.closeLoader();
          console.log(error);
        }
      );
  }
}
