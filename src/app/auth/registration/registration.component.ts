import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { emailValidator } from 'src/app/_validators/Generic.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registrationForm = new FormGroup({});
  public submitted: boolean = false;
  _responseMsg: string = '';
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private snackbar:MatSnackBar
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      let url = this._authService.canNavigate();
      this.router.navigate([url]);
    }
    this.initLoginForm();
  }

  initLoginForm = () => {
    this.registrationForm = this._formBuilder.group({
      countryCode: ['+91', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone:['',Validators.compose([Validators.required])]
    });
  };
  sendOtp() {
    this._responseMsg = '';
    if (this.registrationForm.status == 'VALID') {
      console.log(this.registrationForm.status);
      const data = { ...this.registrationForm.value };
      console.log(data);
      this.openLoader();
      this._authService.authRequest('post', `users/register`, data).subscribe(
        (res) => {
          this.closeLoader();
          console.log(res);
          if (res.code == 'registration initialized' || res.code == 'registration re-initialized') {
            localStorage.removeItem('regDetails');
            localStorage.setItem('regDetails', JSON.stringify(data));
            this.openSnackBar("Please Check Your Mail For Submit Otp.");
            this.router.navigate(['..']);
           
          }
        },
        (error) => {
          this.closeLoader();
          console.log(error);
            this._responseMsg = error.error.message;
            this.openSnackBarError(this._responseMsg);
        }
      );
    }
  }

  openSnackBar(message: any) {
    this.snackbar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }
  
  openSnackBarError(message: any) {
    this.snackbar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }
}
