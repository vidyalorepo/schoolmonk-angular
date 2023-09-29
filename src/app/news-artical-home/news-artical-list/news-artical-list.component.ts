import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';

@Component({
  selector: 'app-news-artical-list',
  templateUrl: './news-artical-list.component.html',
  styleUrls: ['./news-artical-list.component.css'],
  providers:[ConfirmationService,MessageService]
})
export class NewsArticalListComponent implements OnInit {
  itemsPerPage=25;
  currentPage=1;
  _newsListSize=0;
  currentPageStartingIndex:any;
  currentPageEndingIndex:any;
  isEmpty:any;
  _newsList: any;
  data = {
    "page": this.currentPage,
    "size": this.itemsPerPage,
    "sortBy":"news_date",
    "sortDir":"DESC",
    "status":true
  }
  constructor(private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _loader:LoaderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getallNewslist(this.itemsPerPage);
  }

  getallNewslist(size:any){
    this.data.size=size;
    console.log(this.data);
    this._loader.openLoader();
    this._authService.request('post','newsarticlescontroller/getallnewsartical',this.data).subscribe((res)=>{
      this._loader.closeLoader();
      this._newsList = res.result;
      this._newsListSize = res.noOfData;
      if (this.itemsPerPage >= this._newsListSize) {
        this.itemsPerPage = this._newsListSize;
      } else {
        this.itemsPerPage = +this.data.size;
      }

      this.currentPageStartingIndex =
        (this.currentPage - 1) * this.itemsPerPage + 1;
      this.currentPageEndingIndex =
        this.currentPageStartingIndex + this.itemsPerPage - 1;
      if (this.currentPageEndingIndex > this._newsListSize) {
        this.currentPageEndingIndex = this._newsListSize;
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
            this._newsList = response.result;
            this._newsListSize = response.noOfData;

            if (this.itemsPerPage >= this._newsListSize) {
              this.itemsPerPage = this._newsListSize;
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

            if (this.currentPageEndingIndex > this._newsListSize) {
              this.currentPageEndingIndex = this._newsListSize;
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
