import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { EncrDecrService } from 'src/app/EncrDecrService.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private activatedRout: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private EncrDecr: EncrDecrService
  ) { }

  resetPasswordForm = new FormGroup({});
  isSubmitted = false;
  errorMessage: string = '';
  validToken: any;
  errorMessageToken = '';
  passwordResetErrorMessage = '';
  successMsg = '';
  ngOnInit(): void {

    console.log(window.location.href.split('password/')[1]);
    this._authService.getValidResetPasswordToken(window.location.href.split('password/')[1]).subscribe((response) => {
      console.log(response);
      if (response.status === 200) {
      // if (response) {
        console.log("working...");
        
        this.validToken = true;
        this.errorMessageToken = '';
        // this.spinner.hide();
      } else {
        this.errorMessageToken = response.message;
        // this.spinner.hide();
      }
    }, (error) => {
      this.errorMessageToken = 'Sorry the link/token has been expired';
      this.passwordResetErrorMessage = '';
      // this.spinner.hide();
    });
    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ['',
        [Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,25}$')]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  resetPassword() {
    console.log("click submit...");
    
    this.isSubmitted = true;
    if (this.checkPassword()) {
      // this.spinner.show();
      console.log('reset password');
      console.log(this.resetPasswordForm.value);
      let data = {
        'password':'',
        'email': '',
        'token': ''
      };
      data['password'] = this.resetPasswordForm.get('newPassword').value;
      data['email'] = ''; 
      // data['token'] = window.location.href.split('=')[1];
      data['token'] = window.location.href.split('password/')[1];
      data.password = this.EncrDecr.set('123456$#@$^@1ERF', data.password);
      console.log(data);
      // return
      this._authService.setNewPassword(data).subscribe((response) => {
        if(response.status === 200){
          // this.errorMessage = '';
          // this.successMsg = 'Password Set Successfully.';
          // this.resetPasswordForm.reset();
          this.openSnackBar('Password set successfully. Log in to continue..');
          this.router.navigate(['/auth/login/0']);
        }
      }, (error) => {
        this.passwordResetErrorMessage = 'Something went wrong. Please try again later!';
        // this.spinner.hide();
        console.log(error);
      });
    } else {
      console.log('something went wrong');
    }
  }

  get passwordControl() {
    return this.resetPasswordForm.controls;
  }

  checkPassword() {
    if (this.resetPasswordForm.get('newPassword').value === this.resetPasswordForm.get('confirmPassword').value) {
      this.errorMessage = '';
      return true;
    } else {
      this.errorMessage = 'Password and confirm Password not matched, Please try again';
      return false;
    }
  }


  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  errorSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['danger-snackbar']
    });
  }

}
