import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';

@Component({
  selector: 'app-list-header-tag',
  templateUrl: './list-header-tag.component.html',
  styleUrls: ['./list-header-tag.component.css']
})
export class ListHeaderTagComponent implements OnInit {
  itemsPerPage = 25;
  currentPage = 1;
  isPublish = true;
  displayMaximizable=false;
  data = {
    "page": this.currentPage,
    "size": this.itemsPerPage
  }
  _tagsList: any;
  _feedbacksListSize: any;
  currentPageStartingIndex: number;
  currentPageEndingIndex: any;
  isEmpty = false;
  headertagDTl:any='';
  constructor(private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _loader: LoaderService,
    private messageService: MessageService) { }
  ngOnInit(): void {
    this.getallTagslist(this.itemsPerPage);
  }

  getallTagslist(size: any) {
    this.data.size = size;
    console.log(this.data);
    this._loader.openLoader();
    this._authService.request('post', 'headertagcontroller/getallheadertag', this.data).subscribe((response) => {
      this._loader.closeLoader();
      this._tagsList = response.result;
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
    }, (error) => {
      this._loader.closeLoader();
      console.error();
    })
  }

  updateStatus(id: any, status: any) {
    this._loader.openLoader();
    console.log("Id + Status", id, status);
    this._authService.request('get', 'headertagcontroller/updateStatusByid?id=' + id + '&status=' + status).subscribe((response) => {
      this.getallTagslist(this.itemsPerPage);
      this.messageService.clear();
      this.messageService.add({ severity: 'success', summary: '', detail: "Tags status has been updated." });
      this._loader.closeLoader();
    }, (error) => {
      console.error();
      this._loader.closeLoader();
    })
  }

  handlePageChange(event: any) {
    let data = this.data;
    data.page = +event - 1;
    console.log(event);
    console.log(data);
    this._loader.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'headertagcontroller/getallheadertag', data)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this._tagsList = response.result;
            this._feedbacksListSize = response.noOfData;
            if (this.itemsPerPage >= this._feedbacksListSize) {
              this.itemsPerPage = this._feedbacksListSize;
            } else {
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
            this._loader.closeLoader();
          }
        }, (error) => {
          this._loader.closeLoader();
          console.error();
        }
      );
  }

  openDialog(data:any){
    this.displayMaximizable=true;
    this.headertagDTl=data;
  }
}
