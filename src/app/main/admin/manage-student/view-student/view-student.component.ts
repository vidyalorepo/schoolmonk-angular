import { emailValidator } from 'src/app/_validators/Generic.validator';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { v1 as uuidv1 } from 'uuid';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css'],
})
export class ViewStudentComponent implements OnInit {
  _userId: any = '';
  addUserForm: FormGroup;
  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initAddUserForm();
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

  initAddUserForm = () => {
    this.addUserForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      phoneCountryCode: [''],
      phone: [],
      email: [''],
      userType: [''],
      password: [''],
    });
  };

  getUserDetails(id: any) {
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService.request('get', 'schooluser/user/' + id).subscribe(
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
    this.addUserForm.patchValue({
      firstName: details.firstName,
      lastName: details.lastName,
      phoneCountryCode: details.phoneCountryCode,
      phone: details.phone,
      email: details.email,
      userType: details.userType.split('_')[0],
    });
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }
}
