import { emailValidator } from 'src/app/_validators/Generic.validator';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng-lts/api';
// import { v1 as uuidv1 } from 'uuid';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css'],
})
export class EditStudentComponent implements OnInit {
  public submitted: boolean = false;
  addUserForm: FormGroup;
  private _userDetails: any;
  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) {}

  _userId: any;
  ngOnInit(): void {
    this.initAddSchoolForm();
    this._userId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.getUserDetails(this._userId);
  }
  ngAfterViewInit() {}
  ngAfterViewChecked() {
    this.changeDedectionRef.detectChanges();
  }

  hideShowCall() {
    // this._authService.loader.next({ load: false})
    this._authService._adminSideNavBar.next({ show: true });
    this._authService._adminHeader.next({ show: true });
    this._authService._adminFooter.next({ show: true });
  }

  initAddSchoolForm = () => {
    this.addUserForm = this.formBuilder.group({
      userId: [''],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      phoneCountryCode: ['', Validators.compose([Validators.required])],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      email: ['', Validators.compose([Validators.required, emailValidator])],
    });
  };

  getUserDetails(id: any) {
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService.request('get', 'schooluser/user/' + id).subscribe(
      (response) => {
        this.closeLoader();
        if (response) {
          this._userDetails = response;
          console.log(response);
          this.patchForm(response);
        }
      },
      (error) => {
        this.closeLoader();
      }
    );
  }
  patchForm(details: any) {
    this.addUserForm.patchValue({
      userId: details.userId,
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      phoneCountryCode: details.phoneCountryCode,
      phone: details.phone,
      userType: details.userType,
    });
  }

  submitUserData() {
    this.submitted = true;
    if (this.addUserForm.status == 'VALID') {
      const data = this.addUserForm.value;

      console.log('Submit form data -->> ', data);

      // return;
      this.openLoader();
      this._authService
        .request('post', 'users/registerAdminUser', data)
        .subscribe(
          (res) => {
            console.log(res);
            this.closeLoader();
            if (res.status == 200) {
              // this.openSnackBar('User has been successfully Updated');
              this.messageService.clear();
              this.messageService.add({severity:'success', summary:'', detail:"User has been successfully Updated"});
              this.router.navigate(['/manage-student/student-list']);
            }
          },
          (error) => {
            this.closeLoader();
            this.messageService.clear();
            this.messageService.add({severity:'error', summary:'', detail:"User has been Updated failed."});
          }
        );
    }
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
  }
  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
