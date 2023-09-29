import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.css']
})
export class SubscriptionDetailsComponent implements OnInit {

  _userDetails: any;
  subscriptionDtl: any = [];
  _featureAssociatedSub:any = []

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    console.log(this._userDetails);
    this.callSubscriptionPlanDtl(this._userDetails.userId);
  }
  callSubscriptionPlanDtl(userId: any) {
    if (userId) {
      this.openLoader()
      this._authService.request('get', `subscription/getAllFeaturedList`).subscribe((response) => {
        console.log(response);
  
        if (response.status == 200) {
          this.subscriptionDtl= response.result
          // this.addFeatureData(this.subscriptionDtl)
          // this._featureAssociatedSub = this.subscriptionDtl[this.subscriptionDtl.length-1].subscriptionFeaturesDtlVo
        }
        this.closeLoader()
        console.log(this._featureAssociatedSub);
        
      })
    }
  }
  // addFeatureData(subscriptionDtl: any) {
  //   throw new Error('Method not implemented.');
  // }

  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }

}
