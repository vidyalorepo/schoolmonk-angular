import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['./enter-otp.component.css']
})
export class EnterOtpComponent implements OnInit {


  userPath: any;
  _responseMsg: string = '';
  otpForm = new FormGroup({});
  regDetails: any;
  public submitted: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private active: ActivatedRoute,
    private snackbar:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userPath = this.active.snapshot.params.user;

    this.initLoginForm();
    this.regDetails = JSON.parse(localStorage.getItem('regDetails') || '{}')
    console.log(this.regDetails.email);

    this.otpForm.patchValue({ email: this.regDetails.email })
  }

  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }
  initLoginForm = () => {
    this.otpForm = this._formBuilder.group({
      otp: ['', Validators.compose([Validators.required])],
      email: [''],
    });
  }

  resendOtp() {
    console.log('resend for otp');
    this._responseMsg = '';
    const data = { ...this.regDetails };
    console.log(data);
    this._authService.authRequest('post', `users/register`, data)
      .subscribe(res => {
        console.log(res);
        if (res.code == 'registration initialized' || res.code == 'registration re-initialized') {
          // this._responseMsg = "OTP Resend successfully"
           this.openSnackBar("OTP Resend successfully");
        }

      }, error => {
        console.log(error);

      })
  }
  submitOtp() {
    this.submitted = true;
    this._responseMsg = '';
    if (this.otpForm.status == 'VALID') {
      console.log(this.otpForm.status);
      const data = { ...this.otpForm.value };
      console.log(data);
      this.openLoader();
      this._authService.authRequest('post', `users/validate`, data)
        .subscribe(res => {
          this.closeLoader();
          console.log(res);
          if (res.code == 'OTP_VALID') {
            this._responseMsg = res.message;
            this.openSnackBar(this._responseMsg);
            if (this.userPath == 'student') { this.router.navigate(['/auth/create-registration']) }

          }

        }, error => {
          this.closeLoader();
          console.log(error);
          if (error.status == 406) {
            this._responseMsg = error.error.message;
            this.openSnackBarError(this._responseMsg);
          }

        })
    }


  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  openSnackBarError(message: any) {
    this.snackbar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
  openSnackBar(message: any) {
    this.snackbar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }
}
