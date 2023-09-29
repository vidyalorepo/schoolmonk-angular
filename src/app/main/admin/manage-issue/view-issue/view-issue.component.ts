import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MessageService } from 'primeng-lts/api';

@Component({
  selector: 'app-view-issue',
  templateUrl: './view-issue.component.html',
  styleUrls: ['./view-issue.component.css'],
  providers: [
    DatePipe,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class ViewIssueComponent implements OnInit {
  issueViewForm: FormGroup;
  _issueId: string;
  _issuePhotoUrl: any = [];
  _userDetails: any;
  routerState: string;

  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {}

  addSchoolForm = new FormGroup({});
  contactForm = new FormGroup({});

  // Timing School
  _schoolForm = new FormGroup({});
  _schoolLevelInfoListTime: any;
  errMsg: string = '';

  // Academic Performance

  _schoolAcademicList: any;
  _academicForm = new FormGroup({});

  ngOnInit(): void {
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    console.log(this._userDetails?.userType);

    this._issueId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.routerState = this.activatedRoute.routeConfig?.path?.split('/')[0];

    this.initIssueDetailsForm();
    this.getIsssueDetails();
  }

  initIssueDetailsForm = () => {
    this.issueViewForm = this.formBuilder.group({
      issueDesc: [''],
      issuerName:[''],
      issuerFirstName: [''],
      issuerLastName: [''],
      issuerEmail: [''],
      issueState: [''],
      ticketId: [''],
      createdOn: [''],
      issueSubject:['']
    });
  };

  getIsssueDetails() {
    this._authService
      .request('get', `helpdesk/getIssueDetails/${this._issueId}`)
      .subscribe((res: any) => {
        console.log('Issue Details: ', res.result);
        const response = res.result;
        this.patchForm(res.result);

        if (response.docList.length > 0) {
          response.docList.forEach((item: any) => {
            this._issuePhotoUrl.push(item);
          });
        }
        console.log('Issue Media: ', this._issuePhotoUrl);
      });
  }

  patchForm(details: any) {
    this.issueViewForm.patchValue({
      issueDesc: details.issueDesc,
      issuerName:details?.issuerName,
      issuerEmail: details.issuerEmail,
      issueState: details.issueState,
      ticketId: details.ticketId,
      issueSubject:details.issueSubject,
      createdOn: this.datePipe.transform(details.createdOn),
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

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
}
