import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-class-details',
  templateUrl: './add-class-details.component.html',
  styleUrls: ['./add-class-details.component.css'],
  providers: [DatePipe]
})
export class AddClassDetailsComponent implements OnInit {

  isSubmit: boolean = false;
  _userDetails: any;
  _schoolsDetails: any;
  _schoolForm = new FormGroup({});
  _academicYr: any;

  _eligibilityForm = new FormGroup({});
  _tempDetails: { academicYear: any; admissionEndDate: any; admissionStartDate: any; classRange: any; classStream: any; feesAmount: any; feesEndDate: any; feesStartDate: any; id: any; publishStatus: string; boardName: any}[] = [];
  allClassList: any;

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.generateAcademicYear();
    this.inItForm();
    this.addBlankParameterList();
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    if (this._userDetails) {
      this.callSchoolByID(this._userDetails.schoolId)
    }
  }

  generateAcademicYear() {
    var currentYear = this.datePipe.transform(new Date(), 'yyyy');
    var currentMnt = (new Date().getMonth()) + 1;
    this._academicYr = (currentMnt > 3 ? (currentYear + '-' + (+currentYear + 1)) : ((+currentYear - 1) + '-' + (currentYear)))
  }

  inItForm() {
    this._schoolForm = this.formBuilder.group({
      schoolAdmissionDtlVo: this.formBuilder.array([]),
    })

    this._eligibilityForm = this.formBuilder.group({
      academicYear: [''],
      classRange: [''],
      classStream: [''],
      boardName:[''],
      dOBStartDate: ['', Validators.compose([Validators.required])],
      dOBEndDate: ['', Validators.compose([Validators.required])],
      eligibilityMarks: ['', Validators.compose([Validators.required])]
    })
  }

  callSchoolByID(id: any) {
    this.openLoader()
    this._authService.request('get', 'schooluser/school/' + id).subscribe((res) => {
      this.closeLoader();
      if (res) {
        this._schoolsDetails = res;
        console.log("_schoolsDetails :", this._schoolsDetails.schoolAdmissionDtlVo);
        this.addparameterList(this._schoolsDetails.schoolAdmissionDtlVo.length, this._schoolsDetails.schoolAdmissionDtlVo)

      }

    }, error => { this.closeLoader() })
  }

  get parameterListArray(): FormArray {
    return this._schoolForm.get('schoolAdmissionDtlVo') as FormArray;
  }



  addBlankParameterList(size?: any, value?: any): void {
    if (this.parameterListArray.length > 1) {
      this.parameterListArray.push(this.fetchBlankParameterList());
    }
  }

  fetchBlankParameterList(i?: any, value?: any): FormGroup {
    return this.formBuilder.group({
      academicYear: [''],
      boardName:[''],
      admissionEndDate: ['', Validators.compose([Validators.required])],
      admissionStartDate: ['', Validators.compose([Validators.required])],
      classRange: ['', Validators.compose([Validators.required])],
      classStream: [''],
      feesAmount: ['', Validators.compose([Validators.required])],
      feesEndDate: [''],
      feesStartDate: [''],
      id: [''],
      publishStatus: ['']
    })
  }


  addparameterList(size?: any, value?: any): void {
    for (let i = 0; i < size; i++) {
      this.parameterListArray.push(this.fetchParameterList(i, value));
    }
  }



  fetchParameterList(i?: any, value?: any): FormGroup {
    return this.formBuilder.group({
      academicYear: value[i].academicYear,
      boardName:value[i].boardName,
      admissionEndDate: [(value[i].admissionEndDate ? (value[i].admissionEndDate).split('T')[0] : ''), Validators.compose([Validators.required])],
      admissionStartDate: [(value[i].admissionStartDate ? (value[i].admissionStartDate).split('T')[0] : ''), Validators.compose([Validators.required])],
      classRange: value[i].classRange,
      classStream: [value[i].classStream],
      feesAmount: [value[i].feesAmount, Validators.compose([Validators.required])],
      feesEndDate: value[i].feesEndDate,
      feesStartDate: value[i].feesStartDate,
      id: value[i].id,
      publishStatus: (value[i].publishStatus == 'Y' ? true : false)
    })
  }



  admissionDetailsSave() {
    this.isSubmit = true;
    console.log(this._schoolForm.status);
    if (this._schoolForm.status != 'VALID') {
      const data = { ...this._schoolForm.value };
      data.id = this._schoolsDetails.id;

      data.schoolAdmissionDtlVo.forEach((element: any) => {
        this._tempDetails.push({
          academicYear: element.academicYear || '',
          boardName:element.boardName || '',
          admissionEndDate: element.admissionEndDate || '',
          admissionStartDate: element.admissionStartDate || '',
          classRange: element.classRange || '',
          classStream: (element.classStream ? element.classStream : ''),
          feesAmount: element.feesAmount || '',
          feesEndDate: (element.feesEndDate ? element.feesEndDate : ''),
          feesStartDate: (element.feesStartDate ? element.feesStartDate : ''),
          id: element.id,
          publishStatus: (element.publishStatus == true ? 'Y' : 'N'),

        })
      });
      data.schoolAdmissionDtlVo = this._tempDetails;
      console.log(data);

      this.openLoader();
      this._authService.request('post', `schooluser/saveSchoolAdmissionDtl`, data).subscribe(res => {
        this.closeLoader()
        console.log(res);
        if (res.status == 200) {
          this.openSnackBar(res.message);
          this.router.navigate(['/admission/admission-requirements'])

        }

      }, error => { this.closeLoader() })
    }



  }

  EligibilityModal(data?: any) {
    console.log(data);
    
    this.isSubmit = false;
    this._eligibilityForm.reset();
    this._eligibilityForm.patchValue({ academicYear: this._academicYr, classRange: data.classRange , boardName: data.boardName,classStream: data.classStream})

  }

  submitEligibility() {
    this.isSubmit = true;

    if (this._eligibilityForm.status == 'VALID') {
      const data = { schoolStudentEligibilityDtlVo: [{}], id: '' };

      data.schoolStudentEligibilityDtlVo = []
      data.schoolStudentEligibilityDtlVo.push(this._eligibilityForm.value)
      data.id = this._schoolsDetails.id;
      console.log(data);

      this.openLoader();
      this._authService.request('post', `schooluser/saveSchoolStudentEligibilityDtl`, data).subscribe(res => {
        this.closeLoader()
        console.log(res);
        if (res.status == 200) {
          this.isSubmit = false;
          this.openSnackBar(res.message);
          document.getElementById('myModal').click()
        }

      }, error => { this.closeLoader() })

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
  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true })
    this._authService._adminHeader.next({ show: true })
    this._authService._adminFooter.next({ show: true })
  }

}
