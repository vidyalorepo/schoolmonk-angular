import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-advertisement-list',
  templateUrl: './advertisement-list.component.html',
  styleUrls: ['./advertisement-list.component.css'],
  providers:[MessageService,ConfirmationService]
})
export class AdvertisementListComponent implements OnInit {

  customersListSize:number;
  advertisementSearchForm = new FormGroup({});
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
  customersList: any;

  constructor(private formBuilder: FormBuilder,
    private _loader:LoaderService,
    private _authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.initAdvertisementsSearchForm();
    this.getallCustomerslist(this.itemsPerPage);
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }

  initAdvertisementsSearchForm(){
    this.advertisementSearchForm = this.formBuilder.group({
      customerFirstName: [''],
      customerLastName: [''],
      customerEmail: [''],
      zone: [''],
      date: [''],
      page:[''],
      size:['']
    });
  };

  searchAdvertisementList(){
    console.log(this.advertisementSearchForm.value);
    const data=this.advertisementSearchForm.value;
    const payload = {
      size: this.data.size,
      page: this.data.page,
      customerFirstName: this.advertisementSearchForm?.get('first_name')?.value,
      customerLastName: this.advertisementSearchForm?.get('last_name')?.value, 
      customerEmail: this.advertisementSearchForm?.get('email')?.value,
      zone: this.advertisementSearchForm?.get('zone_name')?.value,
      date: this.advertisementSearchForm?.get('date')?.value,
    };
    data.page = 1;
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'adsvertisement/getallorder', data)
      .subscribe(
        (response) => {
          console.log('response ==>> ', response);

          if (response.status === 200) {
            this.customersList = response.result;
            this.customersListSize = response.noOfData;

            if (this.itemsPerPage >= this.customersListSize) {
              this.itemsPerPage = this.customersListSize;
            } else {
              this.itemsPerPage = +this.data.size;
            }
      
            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this.customersListSize) {
              this.currentPageEndingIndex = this.customersListSize;
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

  getallCustomerslist(size:any){
    this.data.size=size;
    console.log(this.data);
    this._loader.openLoader();
    this._authService.request('post','adsvertisement/getallorder',this.data).subscribe((res)=>{
      this._loader.closeLoader();
      this.customersList = res.result;
      this.customersListSize = res.noOfData;
      if (this.itemsPerPage >= this.customersListSize) {
        this.itemsPerPage = this.customersListSize;
      } else {
        this.itemsPerPage = +this.data.size;
      }

      this.currentPageStartingIndex =
        (this.currentPage - 1) * this.itemsPerPage + 1;
      this.currentPageEndingIndex =
        this.currentPageStartingIndex + this.itemsPerPage - 1;
      if (this.currentPageEndingIndex > this.customersListSize) {
        this.currentPageEndingIndex = this.customersListSize;
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
      .request('post', 'adsvertisement/getallorder', data)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this.customersList = response.result;
            this.customersListSize = response.noOfData;

            if (this.itemsPerPage >= this.customersListSize) {
              this.itemsPerPage = this.customersListSize;
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

            if (this.currentPageEndingIndex > this.customersListSize) {
              this.currentPageEndingIndex = this.customersListSize;
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
  
  getPaymentDetails() {
    this.router.navigate(['/advertisement/payment-details/']);
  }
 
  confirm(event: Event,status:any,id:any,duration:any) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to update the status?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
           this._authService.request('get',`adsvertisement/updatestatus?adsId=${id}&status=${status}&duration=${duration}`).subscribe((res)=>{
            this.getallCustomerslist(this.itemsPerPage);
            this.messageService.clear()
            this.messageService.add({severity:'success', summary:'', detail:'Advertisement status has been updated.'});
           },(e)=>{
            this.messageService.clear()
            this.messageService.add({severity:'error', summary:'', detail:'Advertisement status update failed.'});
           })
        },
        reject: () => {
          
        }
    });
  }


}
