import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  cardNoValidator,
  emailValidator,
  phoneNoValidator,
} from 'src/app/_validators/Generic.validator';

@Component({
  selector: 'app-apply-now',
  templateUrl: './apply-now.component.html',
  styleUrls: ['./apply-now.component.css']
})
export class ApplyNowComponent implements OnInit {

  userDetails: any;
  studentDetails: any;
  dynaId: any;
  currentIndex: any;
  tempGuardianName: any;
  tempGuardianId: any;
  tempAddressId: any;
  studentDetailsFromLogInCheck: any;
  siblingDisplay = false;
  iputCardData: any;
  displayCardNo = false;
  tempSiblingId: any;
  dataIndex: any;
  strPlaceHolder = '';
  _studentPhotoUrl = { fileId: 0, filePath: '' };
  _guardianPhotoUrl = { fileId: 0, filePath: '' };
  _birthCertificateUrl = { fileId: 0, filePath: '' };
  _lastCertificateUrl = { fileId: 0, filePath: '' };
  _isSubmitted: boolean = false;
  _formValidityTracker: any;
  routerState: any;
  editBtn: boolean = false;
  checkIndia: boolean = false;
  checkIndiaTwo: boolean = false;
  permanentAddNo: boolean;
  permanentAddYes: boolean;

  constructor(
    private _authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  addStudentForm = new FormGroup({});
  _wizardForm = 1;
  activeTab1 = 'active';
  activeTab2: any;
  activeTab3: any;
  activeTab4: any;
  activeTab5: any;
  activeTab6: any;
  countryList: any = [];
  stateListOne: any = [];
  stateListTwo: any = [];
  _districtList = [{ id: '', districtName: '' }];
  indexOneDist = [{ id: '', districtName: '' }];
  indexTwoDist = [{ id: '', districtName: '' }];
  showRadioYesSibling = false;
  displayAdmissionId = false;

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    if (
      localStorage.getItem('token') &&
      this.userDetails.userType != 'STUDENT_USER'
    ) {
      let url = this._authService.canNavigate();
      this.router.navigate([url]);
    }
    this.initStudentForm();
    this.getStudentDetailsFromLogIn(this.userDetails.studentId);
    this.getCountryList();
    // this.getStateList();
  }

  getCountryList() {
    this.countryList = [];
    this._authService
      .request('get', 'commonMaster/getAllCountries')
      .subscribe((response) => {
        if (response.status == 200) {
          response.result.forEach((element: any) => {
            this.countryList.push(element);
          });
          console.log('this.countryList--> ', this.countryList);
        }
      });
  }

  selectCountry(index:any){
    let countryCode = ((this.addStudentForm.get('addressVo') as FormArray).at(index) as FormGroup).get('country').value;
    
    if(countryCode){
    this._authService
      .request('get', `commonMaster/getStatesByCountries?countryCode=${countryCode}`)
      .subscribe((response) => {
        if (response.status == 200) {
          if(index === 0){
            if(countryCode === '101'){
              this.checkIndia = true;
            }else{
              this.checkIndia = false;
            }
            this.stateListOne = [];
            response.result.forEach((element: any) => {
              this.stateListOne.push(element);
            });
          }else{
            if(countryCode === '101'){
              this.checkIndiaTwo = true;
            }else{
              this.checkIndiaTwo = false;
            }
            this.stateListTwo = [];
            response.result.forEach((element: any) => {
              this.stateListTwo.push(element);
            });
          }
          console.log('this.stateListOne--> ', this.stateListOne);
          console.log('this.stateListTwo--> ', this.stateListTwo);
        }
      });
    }
  }

  // getStateList() {
  //   this.stateList = [];
  //   this._authService
  //     .request('get', 'commonMaster/getStateList')
  //     .subscribe((response) => {
  //       if (response.status == 200) {
  //         response.result.forEach((element: any) => {
  //           this.stateList.push(element);
  //         });
  //         console.log('this.stateList--> ', this.stateList);
  //       }
  //     });
  // }

  onState(stateName: any, index: any) {
    console.log('state code-->> ', stateName);
    console.log('Index code-->> ', index);
    if (stateName) {
      // this._districtList = [];
      this._authService
        .request(
          'get',
          'commonMaster/getDistrictListByState?stateName=' + stateName
        )
        .subscribe((response) => {
          if (response.status == 200) {
            this._districtList = [];
            if (index === 0) {
              this.indexOneDist = [];
              response.result.forEach((element: any) => {
                this.indexOneDist.push(element);
              });
              console.log('this._districtList1--> ', this.indexOneDist);
              // this._districtList = this.indexOneDist;
            } else if (index === 1) {
              this.indexTwoDist = [];
              response.result.forEach((element: any) => {
                this.indexTwoDist.push(element);
              });
              // this._districtList = this.indexTwoDist;
              console.log('this._districtList2--> ', this.indexTwoDist);
            }

            // console.log("this._districtList--> ",this._districtList);
          }
        });
    } else {
      this._districtList = [];
      if (index === 0) {
        this.indexOneDist = [];
      } else {
        this.indexTwoDist = [];
      }
      this.addStudentForm.patchValue({ district: '' });
    }
  }

  getStudentDetailsFromLogIn(studentId: any) {
    this._authService
      .request('get', `studentcontroller/student/${studentId}`)
      .subscribe(
        (response) => {
          console.log(response);

          if (response) {
            console.log('getByStudentId', response);
            this.studentDetails = response;
            this.getStudentDetails(this.studentDetails);
            const data = this.addStudentForm.value;
            console.log(
              'data.studentGuardianVo.length--> ',
              data.studentGuardianVo.length
            );
            console.log('data.addressVo.length--> ', data.addressVo.length);
            if (data.studentGuardianVo.length == 0) {
              this.addGuardianItemDetailsVo(
                this.studentDetails.studentGuardianVo.length
              );
            }
            if (
              data.studentGuardianVo.length > 0 &&
              data.addressVo.length === 0
            ) {
              this.addressItemDetailsVo(this.studentDetails.addressVo.length);
            }
            if (response.docList.length > 0) {
              response.docList.reverse().forEach((element: any) => {
                if (element.docType == 'student_photo') {
                  this._studentPhotoUrl = element;
                } else if (element.docType == 'guardian_photo') {
                  this._guardianPhotoUrl = element;
                } else if (element.docType == 'birth_certificate') {
                  this._birthCertificateUrl = element;
                } else if (element.docType == 'last_marksheet') {
                  this._lastCertificateUrl = element;
                }
              });
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getStudentDetails(studentDetails: any) {
    this.addStudentForm.patchValue({
      id: studentDetails.id,
      studentName: studentDetails.studentName,
      dateOfBirth: studentDetails.dateOfBirth,
      gender: studentDetails.gender,
      religion: studentDetails.religion,
      bloodGroup: studentDetails.bloodGroup,
      nationallity: studentDetails.nationallity,
      firstLanguage: studentDetails.firstLanguage,
      lastSchoolAttempt: studentDetails.lastSchoolAttempt,
      admissionForClass: studentDetails.admissionForClass,
      studentUser: studentDetails.studentUser,
      studentGuardianVo: studentDetails.studentGuardianVo,
      addressVo: studentDetails.addressVo,
    });

    this.patchGuardianDetails(
      studentDetails.studentGuardianVo.length,
      studentDetails.studentGuardianVo
    );
    this.patchAddressDetails(
      studentDetails.addressVo.length,
      studentDetails.addressVo
    );
    if(studentDetails.addressVo.length > 1){
      this.permanentAddNo = true; 
      this.permanentAddYes = false;
    }else if(studentDetails.addressVo.length == 0){
      this.radioYes('Yes');
      this.permanentAddNo = false;
      this.permanentAddYes = true;
    }else{
      this.permanentAddNo = false;
      this.permanentAddYes = true;
    }
    this.setCardValidator();
  }
  setCardValidator() {
    if (this.studentGuardianVoFormArray.controls.length != 0) {
      this.studentGuardianVoFormArray?.controls[0]
        .get('iDProofType')
        .valueChanges.subscribe((val) => {
          this.studentGuardianVoFormArray.controls[0]
            .get('guardianIDProof')
            .setValidators(cardNoValidator(val));
        });
    }
  }
  segregateFormStatusByFormGroup() {
    const allFormControls = this.addStudentForm.controls;
    console.log('Controls: ', allFormControls);

    const studentDetailsValidityControls = [
      allFormControls.gender,
      allFormControls.religion,
      allFormControls.nationallity,
      allFormControls.firstLanguage,
    ];
    let isStudentDetailsValid: boolean = true;
    studentDetailsValidityControls.map((item: any) => {
      if (item.status.toLowerCase() === 'invalid')
        isStudentDetailsValid = false;
    });

    let isGuardianDetailsValid: boolean =
      allFormControls.studentGuardianVo.status.toLowerCase() === 'valid'
        ? true
        : false;
    let isAddressDetailsValid: boolean =
      allFormControls.addressVo.status.toLowerCase() === 'valid' ? true : false;

    this._formValidityTracker = {
      1: isStudentDetailsValid,
      3: isAddressDetailsValid,

      2: isGuardianDetailsValid,
    };
    console.log('Form Validator Object: ', this._formValidityTracker);
  }
  patchAddressDetails(sizeVo: any, val: any) {
    if (sizeVo >= 1) {
      for (let i = 0; i < sizeVo; i++) {
        this.studentAddressVoFormArray.push(this.patchValueAddress(i, val));
        this.selectCountry(i);
      }
    }
  }

  patchValueAddress(i: number, value: any): FormGroup {
    
    this.onState(value[i].state, i);
    
    return this.formBuilder.group({
      addressId: value[i].addressId,
      addrLineOne: [value[i].addrLineOne, Validators.required],
      addrLineTwo: value[i].addrLineTwo,
      country: [value[i].country, Validators.required],
      state: [value[i].state, Validators.required],
      city: [value[i].city, Validators.required],
      district: [value[i].district],
      pin: [value[i].pin, Validators.required],
      addressType: value[i].addressType,
    });
  }

  patchGuardianDetails(sizeVo: any, val: any) {
    if (sizeVo >= 1) {
      for (let i = 0; i < sizeVo; i++) {
        this.studentGuardianVoFormArray.push(this.patchValueguardian(i, val));
      }
    }
  }

  patchValueguardian(i: number, value: any): FormGroup {
    return this.formBuilder.group({
      id: value[i].id,
      guardianName: value[i].guardianName,
      guardianEmail: [
        value[i].guardianEmail,
        Validators.compose([Validators.required, emailValidator]),
      ],
      guardianPhone: [
        value[i].guardianPhone,
        Validators.compose([Validators.required, phoneNoValidator]),
      ],
      guardianQualification: [
        value[i].guardianQualification,
        Validators.required,
      ],
      guardianOccupation: [value[i].guardianOccupation, Validators.required],
      guardianDesignation: value[i].guardianDesignation,
      guardianBusinessName: value[i].guardianBusinessName,
      guardianAnnualIncome: [
        value[i].guardianAnnualIncome,
        Validators.required,
      ],
      guardianIDProof: [value[i].guardianIDProof, Validators.required],
      guardianRelationWithStudent: [
        value[i].guardianRelationWithStudent,
        Validators.required,
      ],
      iDProofType: [value[i].iDProofType, Validators.required],
    });
  }

  initStudentForm = () => {
    this.addStudentForm = this.formBuilder.group({
      id: [this.userDetails.studentId],
      studentName: [
        this.userDetails.firstName + ' ' + this.userDetails.lastName,
      ],
      dateOfBirth: [this.userDetails.dateOfBirth],
      gender: ['', Validators.compose([Validators.required])],
      religion: ['', Validators.compose([Validators.required])],
      bloodGroup: [''],
      nationallity: ['', Validators.compose([Validators.required])],
      firstLanguage: ['', Validators.compose([Validators.required])],
      lastSchoolAttempt: [''],
      admissionForClass: [''],
      studentUser: {
        userId: this.userDetails.userId,
      },
      studentGuardianVo: this.formBuilder.array([]),
      addressVo: this.formBuilder.array([]),
    });
  };

  //Address Controls
  get studentAddressVoFormArray(): FormArray {
    return this.addStudentForm.get('addressVo') as FormArray;
  }

  addressItemDetailsVo(value: any): void {
    const data = this.addStudentForm.value;
    console.log('Initial time address-->> ', data.addressVo.length);

    if (data.addressVo.length === 0) {
      this.studentAddressVoFormArray.push(
        this.createAddressItemDetailsVoForm(value)
      );
    }
  }
  createAddressItemDetailsVoForm(value?: any): FormGroup {
    if (this.studentDetails) {
    } else if (
      this.studentDetails.addressVo &&
      this.studentDetails.addressVo.length === 1
    ) {
      this.tempAddressId = this.studentDetails.addressVo[0].addressId;
    } else {
      this.tempAddressId = '';
    }
    const form = this.formBuilder.group({
      addressId: [this.tempAddressId],
      addrLineOne: [''],
      addrLineTwo: [''],
      country: [''],
      state: [''],
      city: [''],
      district: [''],
      pin: [''],
      addressType: [''],
    });
    return form;
  }

  //Gardian Controls
  get studentGuardianVoFormArray(): FormArray {
    return this.addStudentForm.get('studentGuardianVo') as FormArray;
  }

  addGuardianItemDetailsVo(value: any): void {
    const data = this.addStudentForm.value;
    if (data.studentGuardianVo.length === 0) {
      this.studentGuardianVoFormArray.push(this.createItemDetailsVoForm(value));
    }
    // console.log("obj-->>", this.createItemDetailsVoForm(value));
  }

  createItemDetailsVoForm(value?: any): FormGroup {
    if (this.studentDetails) {
      this.tempGuardianName = this.userDetails.fatherName;
    } else if (
      this.studentDetails &&
      this.studentDetails.studentGuardianVo.length > 0
    ) {
      this.tempGuardianId = this.studentDetails.studentGuardianVo[0].id;
    } else {
      this.tempGuardianName = '';
      this.tempGuardianId = '';
    }
    const form = this.formBuilder.group({
      id: [this.tempGuardianId],
      guardianName: [this.tempGuardianName],
      guardianEmail: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      guardianPhone: [''],
      guardianQualification: [''],
      guardianOccupation: [''],
      guardianDesignation: [''],
      guardianBusinessName: [''],
      guardianAnnualIncome: [''],
      guardianIDProof: [''],
      guardianRelationWithStudent: [''],
      iDProofType: [''],
    });
    return form;
  }

  //Documents Upload Section
  uploadSingleFile(event: any, doc: any, id?: any) {
    console.log(id);

    let files = event.target.files[0];
    let formData = new FormData();
    formData.append('file', files, files.name);
    this.openLoader();
    this._authService
      .fileRequest(
        'post',
        `fe/uploadSingleFileInFolder?formCode=student_media&txId=${this.studentDetails.id}&docType=${doc}&fileId=${id}`,
        formData
      )
      .subscribe(
        (fileRes) => {
          this.closeLoader();
          if (fileRes) {
            console.log(fileRes);
            console.log(fileRes.filePath);
            if (doc == 'student_photo') {
              this._studentPhotoUrl = fileRes;
            } else if (doc == 'guardian_photo') {
              this._guardianPhotoUrl = fileRes;
            } else if (doc == 'birth_certificate') {
              this._birthCertificateUrl = fileRes;
            } else if (doc == 'last_marksheet') {
              this._lastCertificateUrl = fileRes;
            }
          }
        },
        (error) => {
          this.closeLoader();
        }
      );
  }
  //delete picture
  deleteImageFile(id: any, data: any) {
    console.log(id);
    this.openLoader();
    this._authService.request('delete', 'fe/attachment?fileId=' + id).subscribe(
      (res) => {
        console.log(res);
        this.closeLoader();
        if (res.status == 200) {
          this.openSnackBar('File Deleted Successfully');
          // this.getStudentDetailsFromLogIn(this.studentDetails.id);
          // this._studentPhotoUrl.filePath = null;
          if (data === 'student_photo') {
            this._studentPhotoUrl.filePath = '';
          }
          if (data === 'guardian_photo') {
            this._guardianPhotoUrl.filePath = '';
          }
          if (data === 'birth_certificate') {
            this._birthCertificateUrl.filePath = '';
          }
          if (data === 'last_marksheet') {
            this._lastCertificateUrl.filePath = '';
          }
        }
      },
      (error) => {
        this.closeLoader();
        this.openSnackBar('File Deleted Unsuccessfully');
      }
    );
  }

  //save and next
  saveAndNextHandler(wizardForm: any) {
    this.segregateFormStatusByFormGroup();
    if (this._formValidityTracker[wizardForm]) {
      console.log('_wizardForm -->> ', this._wizardForm);
      this.tabChanged(this._wizardForm);
      this.submitData();
    }
  }
  submitData() {
    const data = this.addStudentForm.value;
    console.log('Submit Data -->> ', data);
    console.log('_wizardForm -->> ', this._wizardForm);
    // this._wizardForm +=1;
    // this.patchPrevInfo();
    this._isSubmitted = true;
    console.log('Form : ', this.addStudentForm);

    // return;

    this._authService
      .request('post', 'studentcontroller/register', data)
      .subscribe(
        (res) => {
          console.log(res);
          this.closeLoader();
          if (res.status == 200) {
            this._wizardForm += 1;
            // this.studentDetails = res.result;
            // localStorage.setItem('studentDetails',JSON.stringify(res.result));
            this.tabChanged(this._wizardForm);
            this.patchPrevInfo();
          }
        },
        (error) => {
          this.closeLoader();
        }
      );
  }

  // previousData
  previousData() {
    this._wizardForm -= 1;
    console.log('_wizardForm -->> ', this._wizardForm);
    this.tabChanged(this._wizardForm);
  }
  nextHandler() {
    this._wizardForm += 1;
    console.log('_wizardForm -->> ', this._wizardForm);
    this.tabChanged(this._wizardForm);
  }
  patchPrevInfo() {
    // console.log("this.studentDetailsFromLogInCheck -->. ", this.studentDetailsFromLogInCheck);
    // const data = this.addStudentForm.value;
    // console.log("data.studentGuardianVo.length--> ",data.studentGuardianVo.length);
    // console.log("data.addressVo.length--> ",data.addressVo.length);
    this.ngOnInit();
    // if(!this.studentDetailsFromLogInCheck){
    //   this.studentDetails = JSON.parse(localStorage.getItem('studentDetails') || '');
    //   console.log("this.studentDetails -->> ", this.studentDetails);
    //   if(this.studentDetails){
    //     console.log("Working...");
    //     this.getStudentDetails(this.studentDetails);
    //     if(data.studentGuardianVo.length == 0){
    //       this.addGuardianItemDetailsVo(this.studentDetails.studentGuardianVo.length);
    //     }
    //     if(data.studentGuardianVo.length > 0 && data.addressVo.length === 0){
    //       this.addressItemDetailsVo(this.studentDetails.addressVo.length);
    //     }
    //   }
    // }else{
    //   console.log("In else part of After logIn data");
    //   if(data.studentGuardianVo.length == 0){
    //     this.addGuardianItemDetailsVo(this.studentDetails.studentGuardianVo.length);
    //   }
    //   if(data.studentGuardianVo.length > 0 && data.addressVo.length === 0){
    //     this.addressItemDetailsVo(this.studentDetails.addressVo.length);
    //   }
    // }
  }

  //MENU CLICK

  tabChanged(index: any) {
    this.currentIndex = index;
    this.activeTab1 = '';
    this.activeTab2 = '';
    this.activeTab3 = '';
    this.activeTab4 = '';
    if (index == 1) {
      this.activeTab1 = 'active';
      this.activeTab2 = '';
      this.activeTab3 = '';
      this.activeTab4 = '';
      this._wizardForm = 1;
    } else if (index == 2) {
      this.activeTab1 = '';
      this.activeTab2 = 'active';
      this.activeTab3 = '';
      this.activeTab4 = '';
      this._wizardForm = 2;
    } else if (index == 3) {
      this.activeTab1 = '';
      this.activeTab2 = '';
      this.activeTab3 = 'active';
      this.activeTab4 = '';
      this._wizardForm = 3;
    } else if (index == 4) {
      this.activeTab1 = '';
      this.activeTab2 = '';
      this.activeTab3 = '';
      this.activeTab4 = 'active';
      this._wizardForm = 4;
    }
  }

  radioYes(data: any) {
    console.log('data', data);

    if (this.studentAddressVoFormArray.controls.length > 1) {
      const secondAddressId = this.studentAddressVoFormArray
        .at(1)
        .get('addressId').value;
      if (secondAddressId) {
        // remove the address details from the database
        console.log('address Id: ', secondAddressId);

        this._authService
          .request(
            'delete',
            `studentcontroller/deleteAddress?id=${secondAddressId}`
          )
          .subscribe((res: any) => {
            console.log(res);
          });
      }
      this.studentAddressVoFormArray.removeAt(1);
    }else{
      this.addressItemDetailsVo(1);
    }
    ((this.addStudentForm.get('addressVo') as FormArray).at(0) as FormGroup)
      .get('addressType')
      .patchValue(data);
  }
  radioNo(data: any) {
    console.log('data', data);
    if (this.studentAddressVoFormArray.length <= 1) {
      this.studentAddressVoFormArray.push(
        this.createAddressItemDetailsVoForm(1)
      );
    }

    ((this.addStudentForm.get('addressVo') as FormArray).at(1) as FormGroup)
      .get('addressType')
      .patchValue(data);
    ((this.addStudentForm.get('addressVo') as FormArray).at(0) as FormGroup)
      .get('addressType')
      .patchValue('Permanent Yes');
  }

  idProof(data: any) {
    if (data === 'Voter' || data === 'Aadhar') {
      this.displayCardNo = true;
      this.iputCardData = data;
    } else {
      this.displayCardNo = false;
    }
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  handleEdit() {
    if (!this.editBtn) {
      const confirmationBox = window.confirm(
        'Are sure you want to edit your Details?'
      );
      this.editBtn = true;
    } else this.editBtn = false;
  }

  checkLen(event:any, type:any){
    // console.log(event.target.value.length);
    if(event.target.value.length > 9 && type ==='PHONE'){
      return false;
    }else if(event.target.value.length > 5 && type ==='POSTAL'){
      return false;
    }
    // if(this.value.length > 9) return false;
  }


}
