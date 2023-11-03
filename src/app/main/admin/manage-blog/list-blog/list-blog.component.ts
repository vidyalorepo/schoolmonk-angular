import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { LoaderService } from 'src/app/_services/loader.service';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-list-blog',
  templateUrl: './list-blog.component.html',
  styleUrls: ['./list-blog.component.css'],
  providers:[ConfirmationService]
})
export class ListBlogComponent implements OnInit {
  blogsSearchForm:FormGroup;
  _blogList:any=[];
  itemsPerPage=25;
  currentPage=1;
  sizeArr=[10,20,30];
  currentPageStartingIndex:any;
  currentPageEndingIndex:any;
  _blogListSize=0;
  data = {
    "page": this.currentPage,
    "size": this.itemsPerPage
  }

  submitted: boolean;
  blogCategoryList: any;
  constructor(private formBuilder: FormBuilder,
    private _authService: AuthService,
    private messageService: MessageService,
    private _loader:LoaderService,
    private router: Router,
    private confirmationService: ConfirmationService) {
     }

  ngOnInit(): void {
    this.initSearchForm();
    this.getallBlogslist(this.itemsPerPage);
    this.fetchAllBlogCategory();
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }

  initSearchForm(){
    this.blogsSearchForm=this.formBuilder.group({
       title: [''],
       status: [''],
       size:[this.itemsPerPage],
       page:[this.currentPage],
       blogCategory:['']
    })
  }

  searchBlogList(){
    const data=this.blogsSearchForm.value;
    const payload = {
      size: this.data.size,
      page: this.data.page,
      title: this.blogsSearchForm?.get('title')?.value,
      status: this.blogsSearchForm?.get('status')?.value
    };
    data.page = 1;
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'blog/fetchallblog', data)
      .subscribe(
        (response) => {
          console.log('response ==>> ', response);

          if (response.status === 200) {
            this._blogList = response.result;
            this._blogListSize = response.noOfData;

            if (this.itemsPerPage >= this._blogListSize) {
              this.itemsPerPage = this._blogListSize;
            } else {
              this.itemsPerPage = +this.data.size;
            }
      
            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._blogListSize) {
              this.currentPageEndingIndex = this._blogListSize;
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
  
  getallBlogslist(size: any){
    this.data.size=size;
    console.log(this.data);
    this._loader.openLoader();
    this._authService.request('post','blog/fetchallblog',this.data).subscribe((res)=>{
      this._loader.closeLoader();
      this._blogList = res.result;
      this._blogListSize = res.noOfData;
      if (this.itemsPerPage >= this._blogListSize) {
        this.itemsPerPage = this._blogListSize;
      } else {
        this.itemsPerPage = +this.data.size;
      }

      this.currentPageStartingIndex =
        (this.currentPage - 1) * this.itemsPerPage + 1;
      this.currentPageEndingIndex =
        this.currentPageStartingIndex + this.itemsPerPage - 1;
      if (this.currentPageEndingIndex > this._blogListSize) {
        this.currentPageEndingIndex = this._blogListSize;
      }
    },
    (error) => {
      this._loader.closeLoader();
      console.error();
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
      .request('post','blog/fetchallblog', data)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this._blogList = response.result;
            this._blogListSize = response.noOfData;

            if (this.itemsPerPage >= this._blogListSize) {
              this.itemsPerPage = this._blogListSize;
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

            if (this.currentPageEndingIndex > this._blogListSize) {
              this.currentPageEndingIndex = this._blogListSize;
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

  fetchAllBlogCategory(){
    this._authService.openRequest('get','commonMaster/fetchAllBlogCategory').subscribe((res)=>{
      this.blogCategoryList=res.result;
    })
  }
  updateBlogStatus(ev:any,id:any,status:any){
     this.confirmationService.confirm({
      target: ev.target,
      message: 'Are you sure you want to update the status?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._loader.openLoader();
        this._authService.request('get',`blog/updateBlogStatusByid?id=${id}&status=${status}`).subscribe((res)=>{
         this.getallBlogslist(this.itemsPerPage);
        },(e)=>{
           this._loader.closeLoader();
        })
      },
      reject: () => {
        }
    });
  }
  
}
