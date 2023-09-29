import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EncrDecrService } from 'src/app/EncrDecrService.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.css'],
})
export class CreateRegistrationComponent implements OnInit {
  pwdPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,25}$';
  mobilePattern = '^((\\+91-?)|0)?[0-9]{10}$';
  createLoginForm = new FormGroup({});
  regDetails: any;
  public _regComplete: boolean = false;
  // public _regComplete: boolean = true;
  _responseMsg: string = '';
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private EncrDecr: EncrDecrService,
    private snackbar:MatSnackBar
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      let url = this._authService.canNavigate();
      this.router.navigate([url]);
    }
    this.initLoginForm();
    this.regDetails = JSON.parse(localStorage.getItem('regDetails') || '{}');
    console.log(this.regDetails.email);
    this.createLoginForm.patchValue({ email: this.regDetails.email ,phone:this.regDetails?.phone});
  }

  hideShowCall() {
    // false is for hide
    this._authService._adminSideNavBar.next({ show: false });
    this._authService._adminHeader.next({ show: false });
    this._authService._adminFooter.next({ show: false });
  }
  initLoginForm = () => {
    this.createLoginForm = this._formBuilder.group(
      {
        firstName: ['', Validators.compose([Validators.required])],
        lastName: ['', Validators.compose([Validators.required])],
        email: [''],
        username: [''],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        // phoneCountryCode:['+91'],
        phoneCountryCode: ['+91', Validators.compose([Validators.required])],
        pincode: ['', Validators.compose([Validators.required])],
        // dateOfBirth: ['', Validators.compose([Validators.required])],
        // fatherName: ['', Validators.compose([Validators.required])],

        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(this.pwdPattern),
          ]),
        ],
        cnfPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
          ]),
        ],
      },
      {
        validator: this.MustMatch('password', 'cnfPassword'),
      }
    );
  };

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  createLogin() {
    this._responseMsg = '';
    this._regComplete = false;
    // this._regComplete = true
    if (this.createLoginForm.status == 'VALID') {
      const data = { ...this.createLoginForm.value };
      data.password = this.EncrDecr.set('123456$#@$^@1ERF', data.password);
      this.openLoader();
      this._authService.authRequest('post', `users/signup`, data).subscribe(
        (res) => {
          this.closeLoader();
          console.log(res);
          if (res.code == 'success') {
            this._regComplete = true;
            this._responseMsg = res.message;
          } else if (res.code == 'duplicate_entry') {
            this._responseMsg = res.message;
          }
        },
        (error) => {
          this.closeLoader();
          console.log(error);
          if (error.status == 406) {
            this._responseMsg = error.error.message;
          }
        }
      );
    }
  }

  passwordHide(id?: any) {
    var x: any;
    x = document.getElementById(id);
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
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
  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }
}
