import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { ADD_NEWS_ENDPOINT, DELETE_NEWS_BYID_ENDPOINT, NEWS_FIND_BY_ID_ENDPOINT, UPDATE_NEWS_BY_ID_ENDPOINT, UPDATE_STATUS_BY_ID } from 'src/app/-shared/const';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';



@Component({
  selector: 'app-newsarticles-list',
  templateUrl: './newsarticles-list.component.html',
  styleUrls: ['./newsarticles-list.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class NewsarticlesListComponent implements OnInit {
  addNewsForm: FormGroup;
  editNewsForm:FormGroup;
  newsSearchForm:FormGroup;
  itemsPerPage=25;
  currentPage=1;
  isEmpty=false;
  selectedsize=25;
  _feedbacksListSize=0;
  currentPageStartingIndex:any;
  currentPageEndingIndex:any;
  checked:any;
  sizeArr=[10,20,30];
  displayResponsive1=false;
  displayResponsive=false;
  
  data = {
    "page": this.currentPage,
    "size": this.itemsPerPage
  }
  _newsList:any;
  addNewsLoading: boolean =false;
  newsDetails: any;
  newsId: any;
  constructor(private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _loader:LoaderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { 
      this.inintAddForm();
      this.initEditForm();
      this.initSearchForm();
    }

  ngOnInit(): void {
     this.getallNewslist(this.itemsPerPage);
  }
  inintAddForm(){
    this.addNewsForm=this.formBuilder.group({
      subject:['',Validators.required],
      noticeBody:['',Validators.required],
      status:[true,Validators.required]
    })
  }
  initEditForm(){
    this.editNewsForm=this.formBuilder.group({
      subject:['',Validators.required],
      noticeBody:['',Validators.required],
      status:[false,Validators.required]
    })
  }
  initSearchForm(){
    this.newsSearchForm=this.formBuilder.group({
       subject:[''],
       newsdate:[''],
       noticeBody:[''],
       status:[''],
       size:[this.itemsPerPage],
       page:[this.currentPage],
       sortBy:[''],
       sortDir:['']
    })
  }
  addnews(){
    this._loader.openLoader();
    this.addNewsLoading=true;
     this._authService.request('post',ADD_NEWS_ENDPOINT,this.addNewsForm.value).subscribe((res)=>{
      this.addNewsForm.reset();
      this.displayResponsive=false;
      this.messageService.clear();
      this.messageService.add({severity:'success', summary:'' ,detail:"News artical has been saved."});
      this.getallNewslist(this.itemsPerPage);
      this.addNewsLoading=false;
      this._loader.closeLoader();
     },
     (error) => {
      console.error();
      this.addNewsLoading=false;
      this._loader.closeLoader();
    })
  }
  editNews(id:any){
    this.newsId=id;
    this.displayResponsive1=true;
    this.editNewsForm.reset();
    this._authService.request('get',NEWS_FIND_BY_ID_ENDPOINT+id).subscribe((res)=>{
      this.newsDetails=res.result;
      this.editNewsForm.patchValue({
        subject:this.newsDetails?.subject,
        noticeBody:this.newsDetails?.noticeBody,
        status:this.newsDetails?.status
      })
    })
  }
  sortData(sort: Sort){
    const data = this.newsSearchForm.value;
    data.page=this.currentPage;
    data.sortBy= sort.active;
    data.sortDir = sort.direction;
    this._authService.request('post','newsarticlescontroller/getallnewsartical',data).subscribe((res)=>{
      this._newsList = res.result;
      this._feedbacksListSize = res.noOfData;
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
    },(error) => {
      this._loader.closeLoader();
      console.error();
    })
  }
  getallNewslist(size:any){
    this.data.size=size;
    console.log(this.data);
    this._loader.openLoader();
    this._authService.request('post','newsarticlescontroller/getallnewsartical',this.data).subscribe((res)=>{
      this._loader.closeLoader();
      this._newsList = res.result;
      this._feedbacksListSize = res.noOfData;
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
    },
    (error) => {
      this._loader.closeLoader();
      console.error();
    })
  }
  updateNewsArtical(){
    this._loader.openLoader();
    this._authService.request('post',UPDATE_NEWS_BY_ID_ENDPOINT+this.newsId,this.editNewsForm.value).subscribe((res)=>{
      this.displayResponsive1=false;
      this.messageService.clear();
      this.messageService.add({severity:'success', summary:'' ,detail:"News artical has been updated."});
      this.editNewsForm.reset();
      this._loader.closeLoader();
      this.getallNewslist(this.itemsPerPage);
    },(error) => {
      this._loader.closeLoader();
      console.error();
      this.getallNewslist(this.itemsPerPage);
    })
  }
  handlePageChange(event: any) {
    let data = this.data;
    data.page = +event;
    console.log(event);
    console.log(data);
    this._loader.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'newsarticlescontroller/getallnewsartical', data)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this._newsList = response.result;
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
            this._loader.closeLoader();
          }
        },
        (error) => {
          this._loader.closeLoader();
          console.error();
        }
      );
  }

  updateStatus(id:any,status:any){
    this._loader.openLoader();
   console.log("Id + Status",id,status);
   this._authService.request('get',UPDATE_STATUS_BY_ID+id+'&status='+status).subscribe((res)=>{
    this.messageService.clear();
      this.messageService.add({severity:'success', summary:'' ,detail:"News artical status has been updated."});
      this.getallNewslist(this.itemsPerPage);
      this._loader.closeLoader();
   },(error) => {
    console.error();
    this._loader.closeLoader();
  })
  }

  confirm(ev:any,id:any){
    console.log("confirm called");
    this.confirmationService.confirm({
      target: ev.target,
      message: 'Are you sure you want to delete this record?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._loader.openLoader();
          this._authService.request('get',DELETE_NEWS_BYID_ENDPOINT+id).subscribe((res)=>{
            this.messageService.clear();
            this.messageService.add({severity:'success', summary:'' ,detail:"News artical has been deleted."});
            this.getallNewslist(this.itemsPerPage);
            this._loader.closeLoader();
          },(error) => {
            console.error();
            this._loader.closeLoader();
          }
          )
      },
      reject: () => {
        
      }
  });
  }
}
