import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { Location } from '@angular/common';
import { filter, pairwise } from 'rxjs/operators';
import { MainheaderComponent } from 'src/app/layout/main-layout/mainheader/mainheader.component';
import { usernameValidator } from 'src/app/_validators/Generic.validator';
import { EncrDecrService } from 'src/app/EncrDecrService.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng-lts/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[MessageService]
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({});
  public submitted: boolean = false;
  _responseMsg: string = '';
  userDetails: any;
  mode: any;
  prevUrlPath: any = '';
  schlId: any = '';

  constructor(
    private _formBuilder: FormBuilder,
    public router: Router,
    private _authService: AuthService,
    private location: Location,
    private mainheaderComponent: MainheaderComponent,
    private EncrDecr: EncrDecrService,
    private snackbar:MatSnackBar,
    private messageService: MessageService
  ) {
    this.router.events
      .pipe(
        filter((e) => e instanceof RoutesRecognized),
        pairwise() // check it's second route load
      )
      .subscribe((e: any[]) => {
        console.log(e);

        this.prevUrlPath = e[0].urlAfterRedirects.substring(1);
        this.schlId = this.prevUrlPath.split('search-school-details/')[1];
        // this.prevUrlPath = this.prevUrlPath.split('search-school-details/')[0];
        console.log(this.schlId);
      });
  }

  ngOnInit(): void {
    
    // var decrypted = this.EncrDecr.get('123456$#@$^@1ERF', encrypted);
   
    // console.log('Encrypted :' + encrypted);
    // console.log('decrypted :' + decrypted);

    this.userDetails = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails') || '')
      : '';
    // console.log(this.location.path());
    this.mode = this.location.path().split('login/')[1];
    console.log(this.mode);

    this._authService.searchSchool.next({ search: true });
    if (
      localStorage.getItem('token') &&
      this.userDetails.userType != 'STUDENT_USER'
    ) {
      let url = this._authService.canNavigate();
      this.router.navigate([url]);
    } else if (
      localStorage.getItem('token') &&
      this.userDetails.userType == 'STUDENT_USER'
    ) {
      this.router.navigate(['/auth/home']);
    }
    // else if (localStorage.getItem('token') && this.userDetails.userType == 'STUDENT_USER') {
    //   console.log("in back condition");
    //   this.location.back();
    // };

    this.initLoginForm();
  }

  initLoginForm = () => {
    this.loginForm = this._formBuilder.group({
      username: [
        '',
        Validators.compose([Validators.required, usernameValidator]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
        ]),
      ],
    });
  };

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
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

  submitLoginForm() {
    this._authService._userName.next({ name: true });
    this._responseMsg = '';
    const data = this.loginForm.value;
    data.password = this.EncrDecr.set('123456$#@$^@1ERF', this.loginForm.value.password);
    // this.loginForm.patchValue({
    //   password: this.EncrDecr.set('123456$#@$^@1ERF', this.loginForm.value.password)
    // })
    console.log('Login Form: ', data);

    // return;
    if (this.loginForm.status == 'VALID') {
      let data = { ...this.loginForm.value };
      this.openLoader();
      this._authService.authRequest('post', `users/login`, data).subscribe(
        (res) => {
          this.closeLoader();
          console.log(res);
          if (res.code == 'Login_Success') {
            localStorage.setItem('logInStatus', JSON.stringify(true));
            localStorage.setItem('userDetails', JSON.stringify(res.result));
            localStorage.setItem('token', res.result.jwtToken);
            this._authService._userName.next({ show: true });

            if (res.result['userType'] == 'SCHOOL_USER') {
              console.log(' school user location...');
              this.router.navigate([
                '/manage-school/school-list/school-profile-edit/' +
                  res.result.schoolId,
              ]);
              // this.router.navigate(['/main/manage-school/school-profile-edit/'+res.result.schoolId])
              this.openSnackBar("Login Sucessfully😊");
            }
            if (res.result['userType'] == 'ADMIN_USER') {
              console.log(' Admin location...');
              this.router.navigate(['dashboard/admin-dashboard']);
              // this.router.navigate(['/main/dashboard/admin-dashboard'])
              // this.openSnackBar("Login Sucessfully");
            }
            if (res.result['userType'] == 'STUDENT_USER' && +this.mode === 0) {
              console.log(' in mode 0...');
              this.router.navigate(['/auth/home']).then(() => {
                this.openSnackBar("Login Sucessfully😊");
                window.location.reload();
              });
            }
            if (res.result['userType'] == 'STUDENT_USER' && +this.mode === 1) {
              console.log(' in back location...');
              // this.router.navigateByUrl();
              // this.mainheaderComponent.refreshHeader();
              this.location.back();
              // this.router.navigateByUrl(`${this.prevUrlPath}`);
              // console.log(this.schlId);
              // return
              // this.router.navigate(['/auth/search-details/search-school-details/', this.schlId]).then(() => {
              //   window.location.reload()
              // });
            }
            if (res.result['userType'] == 'STUDENT_USER' && +this.mode === 2) {
              console.log(' in back location...');
              this.location.back();
            }
          } else {
            this._responseMsg = 'Incorrect email address or password.';
            // this.openSnackBarError(this._responseMsg);
            this.messageService.clear();
            this.messageService.add({severity:'error', summary:'message ', detail:this._responseMsg});
            
          }
        },
        (error) => {
          this.closeLoader();
          if (error.status == 401) {
            this._responseMsg = error.error.message;
            // this.openSnackBarError(this._responseMsg);
            this.messageService.clear();
            this.messageService.add({severity:'error', summary:'', detail:this._responseMsg});
          }else{
            // this.openSnackBarError("Internal Server Error.");
            this.messageService.clear();
            this.messageService.add({severity:'error', summary:'', detail:"Internal server error."});
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

  getSchIdPrevUrl() {
    this.router.events
      .pipe(
        filter((e) => e instanceof RoutesRecognized),
        pairwise() // check it's second route load
      )
      .subscribe((e: any[]) => {
        console.log(e);

        this.prevUrlPath = e[0].urlAfterRedirects.substring(1);
        this.schlId = this.prevUrlPath.split('search-school-details/')[1];
        // this.prevUrlPath = this.prevUrlPath.split('search-school-details/')[0];
        console.log(this.schlId);
        this.schlId;
        
      });
      
  }
}
