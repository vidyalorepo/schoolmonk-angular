import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  checkType = 'email';
  isChecked1 = true;
  isChecked2 = false;

  constructor(
    private router: Router,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private activatedRout: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  forgetPasswordForm = new FormGroup ({});

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      let url = this._authService.canNavigate();
      this.router.navigate([url]);
    }
    this.initForgetForm();
  }

  initForgetForm = () => {
    this.forgetPasswordForm = this._formBuilder.group({
      email: [''],
      phone: [''],
    });
  }

  checkPhnEmail(event:any){
    this.checkType = '';
    console.log(event.target.value);
    this.checkType = event.target.value;
    if(this.checkType === 'email'){
      this.isChecked1 = true;
      this.isChecked2 = false;
    }else{
      this.isChecked1 = false;
      this.isChecked2 = true;
    }
  }

  sendResetPassLink(){ 
    const data = this.forgetPasswordForm.value;
    data.email = this.forgetPasswordForm.get('email').value;
    // this.spinner.show();
    console.log("clicking.............", data);
    // return
    this.openLoader()
    if(data.email !== ''){
      this._authService.resetPassword(data).subscribe(
        (response) => {
          console.log(response);
          this.openSnackBar(`Reset password link sent to your mail.`);
          this.forgetPasswordForm.reset();
          this.closeLoader()
        }, (err) => {
          this.closeLoader()
          console.log(err);
          this.openSnackBarErr(`${err.error.message}`)
          
        }
      )
    }else{
      this.closeLoader()
      // this._responseMsg = 'Please enter email first.'
      this.openSnackBarErr(`Please enter email Or Phone.`)
    }
    
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
  openSnackBarErr(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }

}
