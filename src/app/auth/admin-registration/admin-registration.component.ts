import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrDecrService } from 'src/app/EncrDecrService.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-admin-registration',
  templateUrl: './admin-registration.component.html',
  styleUrls: ['./admin-registration.component.css']
})
export class AdminRegistrationComponent implements OnInit {

  pwdPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,25}$';
  mobilePattern = "^((\\+91-?)|0)?[0-9]{10}$"
  createLoginForm = new FormGroup({});
  regDetails: any;
  public submitted: boolean = false;
  isReadOnly: boolean = false;
  regToken: any;
  _responseMsg: string = '';
  _successResponseMsg: string = '';
  registrationMode: string = '';
  _isSubmitBtn: boolean = true;
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private active: ActivatedRoute,
    private EncrDecr: EncrDecrService
  ) { }

  ngOnInit(): void {
    this._isSubmitBtn = true;
    this.initLoginForm();
    this.registrationMode = this.active.snapshot.params.mode;


    if (this.registrationMode == 'new') {
      // For Ist time new resigtration
      this.isReadOnly = false;
    }
    else {
      // When redirect via Link for Password Update
      this.isReadOnly = true;
      this.passwordValidation()
      this.regToken = this.active.snapshot.params.token;
      this.getRegDetailsByToken(this.regToken)
    }

  }

  hideShowCall() {
    // false is for hide
    this._authService._adminSideNavBar.next({ show: false })
    this._authService._adminHeader.next({ show: false })
    this._authService._adminFooter.next({ show: false })
  }
  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }

  initLoginForm = () => {
    this.createLoginForm = this._formBuilder.group({
      schoolName: ['', Validators.compose([Validators.required])],
      // schoolAddress: ['', Validators.compose([Validators.required])],
      contactPersonFirstName: ['', Validators.compose([Validators.required])],
      contactPersonLastName: ['', Validators.compose([Validators.required])],
      contactEmail: ['', Validators.compose([Validators.required, Validators.email])],
      phoneCountryCode: ['', Validators.compose([Validators.required])],
      contactPhone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      schoolId: ['', Validators.compose([Validators.required])],
      otp: [''],
      password: [''],
      cnfPassword: [''],
    }, {
      validator: this.MustMatch('password', 'cnfPassword')
    });

  }

  passwordValidation() {
    this.createLoginForm.controls.otp.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
    this.createLoginForm.controls.otp.updateValueAndValidity();
    this.createLoginForm.controls.password.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(this.pwdPattern)]);
    this.createLoginForm.controls.password.updateValueAndValidity();
    this.createLoginForm.controls.cnfPassword.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(20)]);
    this.createLoginForm.controls.cnfPassword.updateValueAndValidity();
  }
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
    }
  }

  //Form Patching
  getRegDetailsByToken(token: string) {
    this.openLoader()
    this._authService.getAuthRequest('schooluser/getByToken/' + token).subscribe(res => {
      this.closeLoader()
      console.log(res);
      if (res.status == 200) {

        this.createLoginForm.patchValue({
          schoolName: res.result['schoolName'],
          schoolAddress: res.result['schoolAddress'],
          contactPersonFirstName: res.result.contactUser['firstName'],
          contactPersonLastName: res.result.contactUser['lastName'],
          contactEmail: res.result.contactUser['email'],
          phoneCountryCode: res.result.contactUser['phoneCountryCode'],
          contactPhone: res.result.contactUser['phone'],
          schoolId: res.result['schoolId'],
          otp: '',
          password: '',
          cnfPassword: '',
        })
      }
      else {
        this._isSubmitBtn = false;
        this._responseMsg = 'Your token has expired.';
      }

    }, error => {
      this._responseMsg = 'Your token has expired.';
      this._isSubmitBtn = false
      this.closeLoader()
    })
  }

  createLogin2() {
    this._responseMsg = 'Registration Successful. Password activation link and OTP has been sent to your email.';
    this._isSubmitBtn = false;
  }

  createLogin() {
    this.submitted = true;
    this._responseMsg = '';
    if (this.createLoginForm.status == 'VALID') {
      const data = { ...this.createLoginForm.value };
      data.password = this.EncrDecr.set('123456$#@$^@1ERF', data.password);
      //1st time admin registration...
      this.openLoader();
      if (this.registrationMode == 'new') {
        delete data.otp;
        delete data.password;
        delete data.cnfPassword;
        this.finalRegistrationSubmit('schooluser/register', data)
      }
      else {
        
        this.passwordUpdate('users/updatePwd', data)
        // When redirect via Link for Password Update
      }

    }

  }

  finalRegistrationSubmit(url?: any, data?: any) {

    this._authService.authRequest('post', url, data)
      .subscribe(res => {
        console.log(res);
        this.closeLoader()
        if (res.code == 'registration initialized') {

          this._responseMsg = 'Registration Successful. Password activation link and OTP has been sent to your email.';
        }
        else if (res.code == 'duplicate_entry') {
          this._responseMsg = res.message;
        }

      }, error => {
        this.closeLoader()
        console.log(error);
        if (error.status == 406) {
          this._responseMsg = error.error.message;
        }

      })


  }

  passwordUpdate(url?: any, data?: any) {
    this._responseMsg = '';
    this._successResponseMsg = '';
    console.log(url);
    data.email = data.contactEmail;
    delete data.contactEmail
    delete data.contactPersonFirstName;
    delete data.contactPersonLastName;
    delete data.contactPhone;
    delete data.phoneCountryCode;
    delete data.schoolAddress;
    delete data.schoolId;
    delete data.schoolName;
    delete data.cnfPassword

    console.log('Password Update :', data);
    this._authService.authRequest('post', url, data)
      .subscribe(res => {
        this.closeLoader()
        console.log(res);
        if (res.status == 200) {
          this._isSubmitBtn = false;
          this._successResponseMsg = 'Your School Admission account is activated. Now you can manage your details.'
        }
        else {
          this._responseMsg = res.message;
        }

      }, error => {
        this.closeLoader()
        console.log(error);
        if (error.status == 406) {
          this._responseMsg = error.error.message;
        }

      })
  }
  passwordHide(id?: any) {
    var x: any;
    x = document.getElementById(id);
    if (x.type === "password") {
      x.type = "text";
    }
    else {
      x.type = "password";
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
