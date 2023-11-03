import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';

@Component({
  selector: 'app-list-progressive-programs',
  templateUrl: './list-progressive-programs.component.html',
  styleUrls: ['./list-progressive-programs.component.css'],
  providers:[ConfirmationService,MessageService]
})
export class ListProgressiveProgramsComponent implements OnInit {
  itemsPerPage=25;
  currentPage=1;
  _blogListSize=0;
  currentPageStartingIndex:any;
  currentPageEndingIndex:any;
  _blogList!:any;
  data = {
    "page": this.currentPage,
    "size": this.itemsPerPage,
    "sortBy":"id",
    "sortDir":"DESC",
    "status":true,
    "blogCategory":"Scholarships Programs"
  }
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private _loader:LoaderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _authService: AuthService) { }

  ngOnInit(): void {
    this.getallBloglist(this.itemsPerPage);
  }

  getallBloglist(size:any){
    this.data.size=size;
    console.log(this.data);
    this._loader.openLoader();
    this._authService.openRequest('post','blog/fetchallblog',this.data).subscribe((res)=>{
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
      .request('post', 'newsarticlescontroller/getallnewsartical', data)
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
}
