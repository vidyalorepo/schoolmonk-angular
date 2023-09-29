import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  reviewsList:any;
  _statusList:any = [
    {isApprove: true, value:'Active'},
  {isApprove: false, value: 'In-Active'}
];
  reviewsSearchForm = new FormGroup({});
  checkReadonlyClass = 'lightgear';
  arraySend: any = [];
  itemsPerPage = 10;
  currentPage = 1;
  selectedsize=25;
  currentPageStartingIndex: any;
  currentPageEndingIndex: any;
  isEmpty = false;
  sizearr=[10,20,30];
  data = {
    "page": this.currentPage,
    "size": this.itemsPerPage
  };
  reviewListSize:number;
  displayMaximizable=false;
  reviewDTl: any;
  constructor(private formBuilder: FormBuilder,
    private _authService: AuthService,
    private messageService: MessageService,
    private _loader:LoaderService,) { }

  ngOnInit(): void {

    this.initReviewsSearchForm();
    this.getallReviewslist(this.itemsPerPage);
    
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }

  initReviewsSearchForm(){
    this.reviewsSearchForm = this.formBuilder.group({
      schoolName:[''],
      reviewerName:[''],
      isApproved:[''],
      page:[''],
      size:['']
    });
  };

  searchReviewList(){
    const data=this.reviewsSearchForm.value;
    const payload = {
      size: this.data.size,
      page: this.data.page,
      schoolName: this.reviewsSearchForm?.get('schoolName')?.value,
      reviewerName: this.reviewsSearchForm?.get('reviewerName')?.value, 
      isApproved: this.reviewsSearchForm?.get('isApproved')?.value
    };
    data.page = 1;
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'reviewcontroller/getallreview', data)
      .subscribe(
        (response) => {
          console.log('response ==>> ', response);

          if (response.status === 200) {
            this.reviewsList = response.result;
            this.reviewListSize = response.noOfData;

            if (this.itemsPerPage >= this.reviewListSize) {
              this.itemsPerPage = this.reviewListSize;
            } else {
              this.itemsPerPage = +this.data.size;
            }
      
            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this.reviewListSize) {
              this.currentPageEndingIndex = this.reviewListSize;
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

  isShown: boolean = false;
  toggleShow() {
    this.isShown = !this.isShown;
    console.log(this.isShown);
  }

  selectedAll: any;
  selectAll(event: any) {
    console.log(event.target)
    this.arraySend = [];
    for (var i = 0; i < this.reviewsList.length; i++) {
      if (event.target.checked) {
        console.log('index Id-->> ', this.reviewsList[i].id);
        this.arraySend.push(this.reviewsList[i].id);
      } else {
        let index = this.arraySend.findIndex(
          (d: { id: any }) => d.id === this.reviewsList[i].id
        ); //find index in your array
        this.arraySend.splice(index, 1);
      }
      this.reviewsList[i].selected = this.selectedAll;
    }
    console.log(this.arraySend.length);
    console.log(this.arraySend);
    if (this.arraySend.length > 0) {
      this.checkReadonlyClass = 'deepgear';
    } else {
      this.checkReadonlyClass = 'lightgear';
    }
  }

  changeSelectedStatus(schoolStatus: any) {
    let idListString: any = [];
    const data = {
      idList: this.arraySend,
      schoolStatus: schoolStatus,
    };
    console.log('Activate data--> ', data);
    // return
    this.openLoader();
    this._authService
      .request('post', `reviewcontroller/getallreview`, data)
      .subscribe(
        (response) => {
          console.log('value', response);
          if (response.status === 200) {
            // this.openSnackBar(Schools ${schoolStatus} Successfully);
            this.messageService.clear();
            //this.messageService.add({severity:'success', summary:'', detail:Schools ${isApproved} Successfully});
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

 
  handlePageChange(event: any) {
    let data = this.data;
    data.page = +event;
    console.log(event);
    console.log(data);
    this._loader.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'reviewcontroller/getallreview', data)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this.reviewsList = response.result;
            this.reviewListSize = response.noOfData;

            if (this.itemsPerPage >= this.reviewListSize) {
              this.itemsPerPage = this.reviewListSize;
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

            if (this.currentPageEndingIndex > this.reviewListSize) {
              this.currentPageEndingIndex = this.reviewListSize;
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


  getallReviewslist(size:any){
    this.data.size=size;
    console.log(this.data);
    this._loader.openLoader();
    this._authService.request('post','reviewcontroller/getallreview',this.data).subscribe((res)=>{
      this._loader.closeLoader();
      this.reviewsList = res.result;
      this.reviewListSize = res.noOfData;
      if (this.itemsPerPage >= this.reviewListSize) {
        this.itemsPerPage = this.reviewListSize;
      } else {
        this.itemsPerPage = +this.data.size;
      }

      this.currentPageStartingIndex =
        (this.currentPage - 1) * this.itemsPerPage + 1;
      this.currentPageEndingIndex =
        this.currentPageStartingIndex + this.itemsPerPage - 1;
      if (this.currentPageEndingIndex > this.reviewListSize) {
        this.currentPageEndingIndex = this.reviewListSize;
      }
    },
    (error) => {
      this._loader.closeLoader();
      console.error();
    })
  }

  updateStatus(id:any,statusCheck:any){
    this._loader.openLoader();
    console.log('Id + Status', id, statusCheck);
    this._authService
      .request('get', 'reviewcontroller/updateStatusByid?id=' + id + '&status=' + statusCheck)
      .subscribe(
        (res) => {
          if(res.success){
            this.messageService.clear();
            this.messageService.add({
            severity: 'success',
            summary: '',
            detail: 'Review status has been updated.',
          });
          this.getallReviewslist(this.itemsPerPage);
          this._loader.closeLoader();
          }
          // this.messageService.clear();
          // this.messageService.add({
          //   severity: 'success',
          //   summary: '',
          //   detail: 'Review status has been updated.',
          // });
          // this.getallReviewslist(this.itemsPerPage);
          this._loader.closeLoader();
        },
        (error) => {
          console.error();
          this._loader.closeLoader();
        }
    );
}
showPositionDialog(position:any,reviewDetails:any){
  this.reviewDTl=reviewDetails;
  this.displayMaximizable=true;
 }

}
