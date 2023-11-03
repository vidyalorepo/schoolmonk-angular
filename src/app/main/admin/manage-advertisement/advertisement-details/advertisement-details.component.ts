import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
@Component({
  selector: 'app-advertisement-details',
  templateUrl: './advertisement-details.component.html',
  styleUrls: ['./advertisement-details.component.css'],
  providers: [DatePipe, CurrencyPipe]
})
export class AdvertisementDetailsComponent implements OnInit {

  userId: any = '';
  addAdvertisementDetailsForm: FormGroup;
  paymentDetailsForm: FormGroup;
  imageURL: string = ''; 
  user: any = {};
  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _datePipe: DatePipe,
    private _currencyPipe: CurrencyPipe
    ) { }

  ngOnInit(): void {
    this.initAddAdvertisementForm();
    this.userId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.getCustomerDetails(this.userId);
    this.initPaymentDetailsForm();
    this.getPaymentDetails(this.userId);
  }

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true });
    this._authService._adminHeader.next({ show: true });
    this._authService._adminFooter.next({ show: true });
  }

  initAddAdvertisementForm = () => {
    this.addAdvertisementDetailsForm = this.formBuilder.group({
      fileName: [''],
      startDate: [''],
      endDate: [''],
      amount: [],
      qty: [''],
      zoneName: [''],
    });
  };

  initPaymentDetailsForm = () => {
    this.paymentDetailsForm = this.formBuilder.group({
      orderId: [''],
      bankRefNo: [''],
      currency: [''],
      amount: [],
      paymentMode: [''],
      cardName: [''],
    });
  };


  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }

  getCustomerDetails(id: any) {
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService.request('get', 'adsvertisement/fetchByAdd/' + id).subscribe(
      (response) => {
        this.closeLoader();
        if (response && response.result) {
          console.log(response);
          this.user = response; 
          this.patchForm(response.result);
          // this.setImageURL(response.result);
        }
      },
      (error) => {
        this.closeLoader();
      }
    );
  }

  patchForm(details: any) {
    this.addAdvertisementDetailsForm.patchValue({
      filePath: details.attachmentVo[0]?.filePath,
      startDate: this._datePipe.transform( details.startDate, "d MMM y") ,
      endDate: this._datePipe.transform(details.endDate,  "d MMM y") ,
      amount:this._currencyPipe.transform(details?.transactionId?.amount, "INR"),
      qty: details.qty,
      zoneName: details.zoneId?.zoneName,
    });
  }

  // setImageURL(details: any) {
  //   if (details.attachmentVo&& details.attachmentVo.length > 0) {
  //     const firstAttachment = details.attachmentVo[0];
  //     this.imageURL = firstAttachment.filePath;
  //   }
  // }

  getPaymentDetails(id: any) {
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService.request('get', 'adsvertisement/fetchByAdd/' + id).subscribe(
      (response) => {
        this.closeLoader();
        if (response && response.result) {
          console.log(response);
          this.user = response; 
          this.patchPaymentForm(response.result);
        }
      },
      (error) => {
        this.closeLoader();
      }
    );
  }

  patchPaymentForm(details: any) {
    this.paymentDetailsForm.patchValue({
      orderId: details?.transactionId?.orderId,
      bankRefNo: details?.transactionId?.bankRefNo,
      currency: details?.transactionId?.currency,
      amount: this._currencyPipe.transform(details?.transactionId?.amount, "INR"),
      paymentMode: details?.transactionId?.paymentMode,
      cardName: details?.transactionId?.cardName,
    });
  }
  
}
