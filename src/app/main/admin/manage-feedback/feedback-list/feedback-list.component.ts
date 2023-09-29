import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {

  _schoolsList: any[] = [];
  schoolSearchForm = new FormGroup({});
  currentPage = 1;
  itemsPerPage = 25;
  _feedbacksListSize: number;
  isEmpty = false;
  currentPageStartingIndex: any;
  currentPageEndingIndex: any;
  totalnumberofdata: number;
  data = {
    page: this.currentPage,
    size: this.itemsPerPage,
    orderByColName:'',
    orderBy:''
  }
  constructor(private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private messageService: MessageService) { }

  checkReadonlyClass = 'lightgear';
  _feedbackList: any[] = [];
  ngOnInit(): void {
    this.fetchListApi(this.itemsPerPage);
    // this.handlePageChange();
  }

  fetchListApi(size:any) {

    this.openLoader();
   this.data.size=size;
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'commonMaster/getFeedBack', this.data)
      .subscribe(
        (response) => {
          console.log(response);

          if (response.status === 200) {
            this._schoolsList = response.result;


            console.log('this._schoolsList -->> ', this._schoolsList);
            this._feedbacksListSize = response.noOfData;

            if (this.itemsPerPage >= this._feedbacksListSize) {
              this.itemsPerPage = this._feedbacksListSize;
            } else {
              this.itemsPerPage = +this.data.size;
            }

            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._feedbacksListSize) {
              this.currentPageEndingIndex = this._feedbacksListSize;
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
      .request('post', 'commonMaster/getFeedBack', data)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this._schoolsList = response.result;
            this._feedbacksListSize = response.noOfData;

            if (this.itemsPerPage >= this._feedbacksListSize) {
              this.itemsPerPage = this._feedbacksListSize;
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

            if (this.currentPageEndingIndex > this._feedbacksListSize) {
              this.currentPageEndingIndex = this._feedbacksListSize;
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
  selectAllFeedback(event: any) {
    console.log(event.target);
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
    this.selectedAll = this._feedbackList.every(function (item: any) {
      return item.selected == true;
    });
  }

  changeSelectedStatus(schoolStatus: any) {
    const data = {
      idLists: this.arraySend,
      feedbackStatus: schoolStatus,
    };
    console.log('Activate data--> ', data);
    // return
    this.openLoader();
    this._authService
      .request('post', `commonMaster/updateFeedbackStatus`, data)
      .subscribe(
        (response) => {
          console.log('value', response);
          if (response.status === 200) {
            this.messageService.clear();
            // this.openSnackBar(`Feedback status updated Successfully`);
            this.messageService.add({severity:'success', summary:'', detail:'Feedback status updated Successfull'});
            this.arraySend = []
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

  _modalData = '';
  modalOpen(data: any) {
    console.log(data);
    this._modalData = ''
    this._modalData = data
  }


  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }
  sortData(sort: Sort){
    this.data.orderByColName = sort.active;
    this.data.orderBy = sort.direction;
    this._authService
    .request('post', 'commonMaster/getFeedBack', this.data)
    .subscribe(
      (response) => {
        console.log(response);

        if (response.status === 200) {
          this._schoolsList = response.result;


          console.log('this._schoolsList -->> ', this._schoolsList);
          this._feedbacksListSize = response.noOfData;

          if (this.itemsPerPage >= this._feedbacksListSize) {
            this.itemsPerPage = this._feedbacksListSize;
          } else {
            this.itemsPerPage = +this.data.size;
          }

          this.currentPageStartingIndex =
            (this.currentPage - 1) * this.itemsPerPage + 1;
          this.currentPageEndingIndex =
            this.currentPageStartingIndex + this.itemsPerPage - 1;
          if (this.currentPageEndingIndex > this._feedbacksListSize) {
            this.currentPageEndingIndex = this._feedbacksListSize;
          }
          this.closeLoader();
        }
      },
      (error) => {
        console.error();
      }
    );
  }
  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

}
