import { Component, OnInit } from '@angular/core';
import { ElementRef,  ViewChild } from '@angular/core';
import { emailValidator } from 'src/app/_validators/Generic.validator';
import { MessageService } from 'primeng-lts/api';
import { LoaderService } from 'src/app/_services/loader.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';

import {
  FormBuilder,
  ValidatorFn,
  Validators,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';


@Component({
  selector: 'app-buyers-details',
  templateUrl: './buyers-details.component.html',
  styleUrls: ['./buyers-details.component.css'],
  providers: [MessageService]
})
export class BuyersDetailsComponent implements OnInit {
  @ViewChild('closeBtnBuyersDetails') closeBtnBuyersDetails: ElementRef;
  isHuman: boolean = false;
  isAgreeChecked: boolean = false;
  _addBuyersDetails: FormGroup;
  advertisementlist: any;
  selectedAds: any;
  duration: any="";
  quantity: any="";
  totalPrice: any=0;
  route: any;
  qty: any;
  quantityValidationMessage: string;
  durationValidationMessage: string;
  item: any;

  constructor(private formBuilder: FormBuilder,
    private reactiveForm: ReactiveFormsModule,
    private messageService: MessageService,
    private _loader:LoaderService,
    private authService: AuthService,
    private router: Router
    ) {}

  ngOnInit(): void {
    const storedData = localStorage.getItem('selectedAds');
    this.selectedAds = JSON.parse(storedData);
    this.initBuyersDetailsForm();
  }

 
  gettotalprice(){
    console.log(this.selectedAds);
    this.totalPrice=(this.selectedAds[0].price * parseInt(this.quantity)) * parseInt(this.duration);
    console.log("Total Price",this.selectedAds[0].price); 
  }

  initBuyersDetailsForm() {
    this._addBuyersDetails = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required,emailValidator]),],
      phone: [null, Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      qty: [this.quantity],
      zone: [this.selectedAds[0]?.adId],
      isAgree:[this.isAgreeChecked],
      duration:[this.duration]
    });
  }

  showResponse(event:any){
    console.log(event);
    this.isHuman=true;
}

  isAgree(event:any){
    this.isAgreeChecked=event.target.checked;
    console.log(event.target.checked);
  }

  openLoader() {
    this.authService.loader.next({ load: true });
  }

  closeLoader() {
    this.authService.loader.next({ load: false });
  }

submitBuyersData(){
  console.log(this._addBuyersDetails.value);
  if (!this._addBuyersDetails.valid) return;
    this._loader.openLoader();
    const data ={... this._addBuyersDetails.value,qty:this.quantity,duration:this.duration}
    console.log('submitData', data);
    this.authService
      .request('post', 'adsvertisement/saveorder', data)
      .subscribe((response: any) => {
        if (response.status === 200) {
        this._addBuyersDetails.reset();
          console.log('Submit Response: ', response);
          this._loader.closeLoader();
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:'Buyers Details has been submitted.'});
          this.router.navigate(['/auth/advertisements/advertisement-details'])
        }
      },(err) =>{
        this._loader.closeLoader();
        this.messageService.clear();
        this.messageService.add({severity:'error', summary:'', detail:'Buyers Details submitted failed.'});
        console.log(err);
      });
}



getAvailableOptions(isavailable: number): number[] {
  return Array.from({ length: isavailable }, (_, i) => i + 1);
}

backModalAdvertisementDetails(){
  this.router.navigate(['/auth/advertisements/advertisement-details']);
}

}
