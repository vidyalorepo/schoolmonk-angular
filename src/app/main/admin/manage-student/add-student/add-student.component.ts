import { emailValidator } from 'src/app/_validators/Generic.validator';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng-lts/api';
// import { v1 as uuidv1 } from 'uuid';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
})
export class AddStudentComponent implements OnInit {
  public submitted: boolean = false;
  _schoolID = '';
  addUserForm: FormGroup;
  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) {}

  addSchoolForm = new FormGroup({});
  stateList = [{ id: '', stateName: '' }];
  _districtList = [{ id: '', districtName: '' }];
  ngOnInit(): void {
    this.initAddSchoolForm();
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
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      phoneCountryCode: ['+91', Validators.compose([Validators.required])],
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
  getStateList() {
    this.stateList = [];
    this._authService
      .request('get', 'commonMaster/getStateList')
      .subscribe((response) => {
        if (response.status == 200) {
          response.result.forEach((element: any) => {
            this.stateList.push(element);
          });
        }
      });
  }
  onState() {
    if (this.addSchoolForm.value.state) {
      this._districtList = [];
      this._authService
        .request(
          'get',
          'commonMaster/getDistrictListByState?stateId=' +
            this.addSchoolForm.value.state
        )
        .subscribe((response) => {
          if (response.status == 200) {
            response.result.forEach((element: any) => {
              this._districtList.push(element);
            });
          }
        });
    } else {
      this.addSchoolForm.patchValue({ district: '' });
    }
  }
  callSchoolByID(id: any) {
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService.request('get', 'schooluser/school/' + id).subscribe(
      (response) => {
        this.closeLoader();
        if (response) {
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
    this.addSchoolForm.patchValue({
      schoolName: details.schoolName,
      schoolId: details.schoolId,
      schoolAddress: details.schoolAddress,
      phoneCountryCode: details.phoneCountryCode,
      contactPhone: details.contactPhone,
      contactEmail: details.contactEmail,
      contactPersonFirstName: details.contactUser['firstName'],
      contactPersonLastName: details.contactUser['lastName'],
      uploadDoc: details.uploadDoc,
      customAdmissionForm: details.customAdmissionForm,
      landMark: details.landMark,
      addressLineTwo: details.addressLineTwo,
      city: details.city,
      state: details.state,
      district: details.district,
      postalCode: details.postalCode,
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
              // this.openSnackBar(
              //   'An activation link is sent to the school administrator’s email. Click on the activation like to activate the account'
              // );
        this.messageService.clear();
        this.messageService.add({severity:'success', summary:'', detail:"An activation link is sent to the email. Click on the activation like to activate the account"});
              this.router.navigate(['/manage-student/student-list']);
            }
          },
          (error) => {
            this.messageService.clear();
            this.messageService.add({severity:'error', summary:'', detail:"This Email Or Phone Already In Use."});
          //  this.errorSnackBar("This Email Or Phone Already In Use.");
            this.closeLoader();
          }
        );
    }
  }

  submitUpdateSchoolRecord() {
    console.log('Update Call');
    console.log(this.addSchoolForm.status);
    console.log(this.addSchoolForm.value);
    this.submitted = true;
    if (this.addSchoolForm.status == 'VALID') {
    }
  }
  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
  }
  errorSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 4000,
      panelClass: ['error-snackbar'],
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
