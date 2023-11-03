import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-guardian-enquiry-list',
  templateUrl: './guardian-enquiry-list.component.html',
  styleUrls: ['./guardian-enquiry-list.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class GuardianEnquiryListComponent implements OnInit {

  guardianEnquirySearchForm = new FormGroup({});
  guardianEnquiryList: any[] = [];
  guardianEnquiryListSize: number;
  itemsPerPage = 25;
  currentPage = 1;
  selectedsize=25;
  currentPageStartingIndex: any;
  currentPageEndingIndex: any;
  isEmpty = false;
  sizearr=[10,20,30];
  guardianQueryid: any;
  data = {
    "page": this.currentPage,
    "size": this.itemsPerPage
  };
  constructor(private formBuilder: FormBuilder,
    private _loader:LoaderService,
    private _authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.initGuardianEnquirySearchForm();
    this.getallGuardiansEnquirylist(this.itemsPerPage);
  }

  initGuardianEnquirySearchForm(){
    this.guardianEnquirySearchForm = this.formBuilder.group({
      name: [''],
      email: [''],
      phone: [''],
      city: [''],
      page:[''],
      size:['']
    });
  };

  searchGuardianEnquiryList(){
    console.log(this.guardianEnquirySearchForm.value);
    const data=this.guardianEnquirySearchForm.value;
    const payload = {
      size: this.data.size,
      page: this.data.page,
      name: this.guardianEnquirySearchForm?.get('name')?.value, 
      email: this.guardianEnquirySearchForm?.get('email')?.value,
      phone: this.guardianEnquirySearchForm?.get('phone')?.value,
      city: this.guardianEnquirySearchForm?.get('city')?.value,
    };
    data.page = 1;
    this._loader.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'parentenquiry/getallenquiry', data)
      .subscribe(
        (response) => {
          console.log('response ==>> ', response);

          if (response.status === 200) {
            this.guardianEnquiryList = response.result;
            this.guardianEnquiryListSize = response.noOfData;

            if (this.itemsPerPage >= this.guardianEnquiryListSize) {
              this.itemsPerPage = this.guardianEnquiryListSize;
            } else {
              this.itemsPerPage = +this.data.size;
            }
      
            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this.guardianEnquiryListSize) {
              this.currentPageEndingIndex = this.guardianEnquiryListSize;
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

  getallGuardiansEnquirylist(size:any){
    this.data.size=size;
    console.log(this.data);
    this._loader.openLoader();
    this._authService.request('post','parentenquiry/getallenquiry',this.data).subscribe((res)=>{
      this._loader.closeLoader();
      this.guardianEnquiryList = res.result;
      this.guardianEnquiryListSize = res.noOfData;
      if (this.itemsPerPage >= this.guardianEnquiryListSize) {
        this.itemsPerPage = this.guardianEnquiryListSize;
      } else {
        this.itemsPerPage = +this.data.size;
      }

      this.currentPageStartingIndex =
        (this.currentPage - 1) * this.itemsPerPage + 1;
      this.currentPageEndingIndex =
        this.currentPageStartingIndex + this.itemsPerPage - 1;
      if (this.currentPageEndingIndex > this.guardianEnquiryListSize) {
        this.currentPageEndingIndex = this.guardianEnquiryListSize;
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
      .request('post', 'parentenquiry/getallenquiry', data)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this.guardianEnquiryList = response.result;
            this.guardianEnquiryListSize = response.noOfData;

            if (this.itemsPerPage >= this.guardianEnquiryListSize) {
              this.itemsPerPage = this.guardianEnquiryListSize;
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

            if (this.currentPageEndingIndex > this.guardianEnquiryListSize) {
              this.currentPageEndingIndex = this.guardianEnquiryListSize;
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

  confirm(ev:any,id:any){
    console.log("confirm called");
    this.confirmationService.confirm({
      target: ev.target,
      message: 'Are you sure you want to delete this record?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._loader.openLoader();
          this._authService.request('get','parentenquiry/deletebyid/'+id).subscribe((res)=>{
            this.messageService.clear();
            this.messageService.add({severity:'success', summary:'' ,detail:"Guardian query has been deleted."});
            this.getallGuardiansEnquirylist(this.itemsPerPage);
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
