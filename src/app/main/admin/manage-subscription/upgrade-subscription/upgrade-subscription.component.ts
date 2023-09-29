import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-upgrade-subscription',
  templateUrl: './upgrade-subscription.component.html',
  styleUrls: ['./upgrade-subscription.component.css']
})
export class UpgradeSubscriptionComponent implements OnInit {

  _userDetails: any;
  subscriptionDtl: any = [];

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
      this._authService.request('get', `subscription/getSubscriptionFeaturedList`).subscribe((response) => {
        console.log(response);
  
        if (response.status == 200) {
          this.subscriptionDtl= response.result
        }
        this.closeLoader()
        console.log(this.subscriptionDtl);
        
      })
    }
  }

  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }

}
