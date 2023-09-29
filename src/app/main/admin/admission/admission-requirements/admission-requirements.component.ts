import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-admission-requirements',
  templateUrl: './admission-requirements.component.html',
  styleUrls: ['./admission-requirements.component.css']
})
export class AdmissionRequirementsComponent implements OnInit {

  _userDetails: any;
  _schoolsDetailsList: any;
  _eligibilityForm = new FormGroup({});
  _schoolForm = new FormGroup({});
  _eligibilityList: any;
  isSubmit: boolean = false;
  _schoolDtl: any;

  _tempDetails: { academicYear: any; admissionEndDate: any; admissionStartDate: any; classRange: any; classStream: any; feesAmount: any; feesEndDate: any; feesStartDate: any; id: any; publishStatus: string; boardName: any }[] = [];

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    if (this._userDetails) {
      this.callSchoolByID(this._userDetails.schoolId)
    }
  }

  inItForm() {
    this._eligibilityForm = this.formBuilder.group({
      id: [''],
      academicYear: [''],
      classRange: [''],
      boardName: [''],
      classStream: [''],
      dOBStartDate: ['', Validators.compose([Validators.required])],
      dOBEndDate: ['', Validators.compose([Validators.required])],
      eligibilityMarks: ['']
    })
  }

  // ******  admission Form  *****
  inItAdmissionForm() {
    this._schoolForm = this.formBuilder.group({
      schoolAdmissionDtlVo: this.formBuilder.array([]),
    })
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
      boardName: [''],
      admissionEndDate: [''],
      admissionStartDate: [''],
      classRange: [''],
      classStream: [''],
      feesAmount: [''],
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
      boardName: value[i].boardName,
      admissionEndDate: [(value[i].admissionEndDate ? (value[i].admissionEndDate).split('T')[0] : '')],
      admissionStartDate: [(value[i].admissionStartDate ? (value[i].admissionStartDate).split('T')[0] : '')],
      classRange: value[i].classRange,
      classStream: [value[i].classStream],
      feesAmount: [value[i].feesAmount],
      feesEndDate: value[i].feesEndDate,
      feesStartDate: value[i].feesStartDate,
      id: value[i].id,
      publishStatus: (value[i].publishStatus == 'Y' ? true : false)
    })
  }

  callSchoolByID(id: any) {
    this.openLoader();
    this.inItForm();
    this.inItAdmissionForm();
    this._eligibilityList = []
    this._authService.request('get', 'schooluser/school/' + id).subscribe((res) => {
      this.closeLoader();
      console.log(res);
      this._schoolDtl = res;
      if (res) {
        this._schoolsDetailsList = res.schoolAdmissionDtlVo;
        this._eligibilityList = res.schoolStudentEligibilityDtlVo;
        this.addparameterList(this._schoolsDetailsList.length, this._schoolsDetailsList)
      }

    }, error => { this.closeLoader() })
  }

  addEligibility(value?: any) {
    console.log(value);
    this.openLoader();
    const data = {
      academicYear: '', classRange: '', boardName: '', id: '',
      schoolMstVo: {
        id: this._schoolDtl.id
      },
      classStream: ''
    };
    data.academicYear = value.academicYear;
    data.classRange = value.classRange,
      data.boardName = value.boardName
    if (value.classStream !== '' && value.classStream !== null) {
      data.classStream = value.classStream
    }

    this._eligibilityForm.reset();

    this._authService.request('post', 'schooluser/findEligibility', data).subscribe((res) => {
      console.log(data);
      this.closeLoader();
      if (res.status == 200) {
        console.log(res.result);
        // if(res.result.id){
        this._eligibilityForm.patchValue({
          id: res.result.id,
          academicYear: res.result.academicYear,
          boardName: res.result.boardName,
          classRange: res.result.classRange,
          classStream: res.result.classStream || '',
          // classStream: value.classStream || '', 
          dOBStartDate: (res.result.dOBStartDate ? res.result.dOBStartDate.split('T')[0] : ''),
          dOBEndDate: (res.result.dOBEndDate ? res.result.dOBEndDate.split('T')[0] : ''),
          eligibilityMarks: res.result.eligibilityMarks || ''
        })
        // }


      }
      else {
        this.closeLoader();
        this._eligibilityForm.patchValue({ academicYear: value.academicYear, classRange: value.classRange, boardName: value.boardName, classStream: value.classStream, id: null })

      }

    }, error => {
      this.closeLoader();
      this._eligibilityForm.patchValue({ academicYear: value.academicYear, classRange: value.classRange, boardName: value.boardName, classStream: value.classStream, id: null })
    })

  }
  openEligibilityModal(data?: any) {
    console.log(data);

    this.isSubmit = false;
    this._eligibilityForm.patchValue({
      id: data.id,
      academicYear: data.academicYear,
      boardName: data.boardName,
      classRange: data.classRange,
      classStream: data.classStream || '',
      dOBStartDate: (data.dOBStartDate ? data.dOBStartDate.split('T')[0] : ''),
      dOBEndDate: (data.dOBEndDate ? data.dOBEndDate.split('T')[0] : ''),
      eligibilityMarks: data.eligibilityMarks || ''
    })


  }
  updateEligibilityEdit() {
    this.isSubmit = true;

    if (this._eligibilityForm.status == 'VALID') {
      const data = { schoolStudentEligibilityDtlVo: [{}], id: '' };

      data.schoolStudentEligibilityDtlVo = []
      data.schoolStudentEligibilityDtlVo.push(this._eligibilityForm.value)
      data.id = this._userDetails.schoolId;
      console.log(data);

      this.openLoader();
      this._authService.request('post', `schooluser/saveSchoolStudentEligibilityDtl`, data).subscribe(res => {
        this.closeLoader()
        console.log(res);
        if (res.status == 200) {
          this.openSnackBar(res.message);
          document.getElementById('myModal').click()
          this.callSchoolByID(this._userDetails.schoolId)
        }

      }, error => { this.closeLoader() })

    }


  }

  deleteAdmissionDetails(id?: any) {
    let data = { id: '' };
    data.id = id;
    this.openLoader();
    this._authService.request('post', `schooluser/deleteSchoolAdmissionDtl`, data)
      .subscribe(res => {
        this.closeLoader();
        console.log(res);
        if (res.status == 200) {
          this.openSnackBar('Admission Details deleted successfully');
          this.callSchoolByID(this._userDetails.schoolId);
        }


      }, error => {
        this.closeLoader();
      })
  }

  deleteEligibility(id?: any) {
    console.log(id);

    let data = { id: '' };
    data.id = id;

    this.openLoader();
    this._authService.request('post', `schooluser/deleteSchoolStudentEligibilityDtl`, data)
      .subscribe(res => {
        this.closeLoader();
        console.log(res);
        if (res.status == 200) {
          this.openSnackBar('Eligibility Details deleted successfully');
          this.callSchoolByID(this._userDetails.schoolId);
        }


      }, error => {
        this.closeLoader();
      })
  }

  admissionDetailsSave() {
    console.log(this._schoolForm.status);
    const data = { ...this._schoolForm.value };
    data.id = this._userDetails.schoolId;

    data.schoolAdmissionDtlVo.forEach((element: any) => {
      this._tempDetails.push({
        academicYear: element.academicYear || '',
        boardName: element.boardName || '',
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
        this.callSchoolByID(this._userDetails.schoolId)

      }

    }, error => { this.closeLoader() })



  }

  tabChange(value?: any) {
    this.callSchoolByID(this._userDetails.schoolId);

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

}
