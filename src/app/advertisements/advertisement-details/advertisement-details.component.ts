import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { emailValidator } from 'src/app/_validators/Generic.validator';
import { MessageService } from 'primeng-lts/api';
import { ElementRef,  ViewChild } from '@angular/core';
import { LoaderService } from 'src/app/_services/loader.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  ValidatorFn,
  Validators,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-advertisement-details',
  templateUrl: './advertisement-details.component.html',
  styleUrls: ['./advertisement-details.component.css']
})
export class AdvertisementDetailsComponent implements OnInit {
  
  @ViewChild('closeBtnBuyersDetails') closeBtnBuyersDetails: ElementRef;
  advertisementlist: any;
  isHuman: boolean = false;
  isAgreeChecked: any = false;
  _addBuyersDetails: FormGroup;
  selectedAds: any[] = [];
  quantity: any;
  duration: any;
  selectedQuantity: number = 1;
  

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private reactiveForm: ReactiveFormsModule,
    private _loader:LoaderService,
    private router: Router) { }

  ngOnInit(): void {
    this.getalladvertisementslist();
    // this.initBuyersDetailsForm();
  }

  getalladvertisementslist() {
    this._loader.closeLoader();
    this.authService.openRequest("get", "adsvertisement/getallads").subscribe((res) => {
      console.log(res);
      this._loader.closeLoader();
      this.advertisementlist = res.result;
      console.log(this.advertisementlist);
    },(e)=>{
      this._loader.closeLoader();
    })
  }

  getAvailableOptions(isavailable: number): number[] {
    return Array.from({ length: isavailable }, (_, i) => i + 1);
  }

orderNow(selectedAd: any) {
  // selectedAd.quantity = parseInt(selectedAd.quantity, 10);
  // localStorage.setItem('selectedQuantity', this.selectedQuantity.toString());
  // console.log(selectedAd.quantity);
  // selectedAd.duration = parseInt(selectedAd.duration, 10);
  // selectedAd.price = parseInt(selectedAd.price);
  // selectedAd.totalPrice = selectedAd.selectedQuantity * (selectedAd.duration / 30) * selectedAd.price;
  // console.log("Price",selectedAd.totalPrice);
  console.log(selectedAd);
  this.selectedAds.push(selectedAd);
  localStorage.setItem('selectedAds', JSON.stringify(this.selectedAds));
  this.router.navigate(['/auth/advertisements/buyers-details']);
}

 FetchDuration(duration:any){
    console.log(duration);
 }
}
