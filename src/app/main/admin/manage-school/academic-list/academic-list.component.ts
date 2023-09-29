import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-academic-list',
  templateUrl: './academic-list.component.html',
  styleUrls: ['./academic-list.component.css']
})
export class AcademicListComponent implements OnInit {

  _userDetails: any;
  _schoolAcademicList: any;
  _academicForm = new FormGroup({});
  isSubmit: boolean = false;

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // this.hideShowCall();
    this.inItForm()

    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    if (this._userDetails) {
      this.callSchoolByID(this._userDetails.schoolId)
    }
  }

  inItForm() {
    this._academicForm = this.formBuilder.group({
      id: [''],
      academicYear: ['', Validators.compose([Validators.required])],
      performanceTitle: ['', Validators.compose([Validators.required])],
      academicInformation: ['', Validators.compose([Validators.required])]
    })
  }
  callSchoolByID(id: any) {
    this.openLoader();
    this._schoolAcademicList = [];
    this._authService.request('get', 'schooluser/school/' + id).subscribe((res) => {
      this.closeLoader();
      console.log(res);

      if (res) {
        this._schoolAcademicList = res.schoolAcademicDtlVo;
        console.log(this._schoolAcademicList);

      }

    }, error => { this.closeLoader() })
  }

  openEditModal(data?: any) {
    this.isSubmit = true;
    this._academicForm.patchValue({
      id: data.id,
      academicYear: data.academicYear,
      performanceTitle: data.performanceTitle,
      academicInformation: data.academicInformation
    })
  }

  updateAcademic() {
    this.isSubmit = true;

    if (this._academicForm.status == 'VALID') {
      const data = { schoolAcademicDtlVo: [{}], id: '' };
      data.schoolAcademicDtlVo = []
      data.schoolAcademicDtlVo.push(this._academicForm.value)
      data.id = this._userDetails.schoolId;

      console.log(data);

      this.openLoader();
      this._authService.request('post', `schooluser/saveSchoolAcademicDtl`, data).subscribe(res => {
        this.closeLoader();
        console.log(res);
        if (res.status == 200) {
          this.openSnackBar(res.message);
          document.getElementById('myModal').click();
          this.callSchoolByID(this._userDetails.schoolId);
        }


      }, error => { this.closeLoader() })


    }
  }

  deleteAcademic(id?: any) {
    console.log(id);

    let data = { id: '' };
    data.id = id;

    this.openLoader();
    this._authService.request('post', `schooluser/deleteSchoolAcademicDtl`, data)
      .subscribe(res => {
        this.closeLoader();
        console.log(res);
        if (res.status == 200) {
          // this.openSnackBar('Academic Details deleted successfully');
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:'Academic details has been deleted.'});
          this.callSchoolByID(this._userDetails.schoolId);
        }


      }, error => {
        this.messageService.clear();
        this.messageService.add({severity:'error', summary:'', detail:'Academic details deleted has been failed.'});
        this.closeLoader();
      })
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true })
    this._authService._adminHeader.next({ show: true })
    this._authService._adminFooter.next({ show: true })
  }

  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }
}
