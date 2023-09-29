import { BreadcrumbService } from './../../../_services/breadcrumb.service';
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
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
})
export class StudentProfileComponent implements OnInit {
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
  _studentPhotoUrl : string | ArrayBuffer;
  _guardianPhotoUrl : string | ArrayBuffer;
  _birthCertificateUrl : string | ArrayBuffer;
  _lastCertificateUrl : string | ArrayBuffer;

  _selectedFile1: any;
  _selectedFile2: any;
  _selectedFile3: any;
  _selectedFile4: any;

  _formData1!: FormData;
  _formData2!: FormData;
  _formData3!: FormData;
  _formData4!: FormData;

  _isSubmitted: boolean = false;
  _formValidityTracker: any;
  routerState: any;
  editBtn: boolean = false;
  checkIndia: boolean = false;
  checkIndiaTwo: boolean = false;
  permanentAddNo: boolean;
  permanentAddYes: boolean;
  _prevUrl: string = '';
  message: string;
  _studentPhotoId: any = '';
  _guardianPhotoId: any = '';
  _birthCertificateId: any = '';
  _lastCertificateId: any = '';
  favSchoolList: any;

  constructor(
    private _authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private breadcrumbService: BreadcrumbService
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
    // this._dueDate = this.activatedRoute.snapshot.paramMap.get('dt');
    // this.getStudentDetailsFromLogIn(this.userDetails.studentId);
    this.getStudentDetailsFromLogIn(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
    this.getCountryList();
    // this.getStateList();
    this.buildBredcrumb();
    
  }
  
  isPageRefreshed() {
    if (
      this.breadcrumbService.getPreviousUrl() ===
      this.breadcrumbService.getCurrentUrl()
    )
      return true;
    return false;
  }
  buildBredcrumb() {
    if (
      this._prevUrl === '' &&
      localStorage.getItem('student-profile-prev-url') === null
    ) {
      this._prevUrl = this.breadcrumbService.getPreviousUrl();
      localStorage.setItem('student-profile-prev-url', this._prevUrl);
    }

    // for preventing clearing of prev url, while refreshing
    if (this.isPageRefreshed())
      this._prevUrl = localStorage.getItem('student-profile-prev-url');
    console.log('Previous url: ', this._prevUrl);
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

  selectCountry(index: any) {
    let countryCode = (
      (this.addStudentForm.get('addressVo') as FormArray).at(index) as FormGroup
    ).get('country').value;

    if (countryCode) {
      this._authService
        .request(
          'get',
          `commonMaster/getStatesByCountries?countryCode=${countryCode}`
        )
        .subscribe((response) => {
          if (response.status == 200) {
            if (index === 0) {
              if (countryCode === '101') {
                this.checkIndia = true;
              } else {
                this.checkIndia = false;
              }
              this.stateListOne = [];
              response.result.forEach((element: any) => {
                this.stateListOne.push(element);
              });
            } else {
              if (countryCode === '101') {
                this.checkIndiaTwo = true;
              } else {
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
                  this._studentPhotoUrl = element.filePath;
                  this._studentPhotoId = element.fileId;
                } else if (element.docType == 'guardian_photo') {
                  this._guardianPhotoUrl = element.filePath;
                  this._guardianPhotoId = element.fileId;
                } else if (element.docType == 'birth_certificate') {
                  this._birthCertificateUrl = element.filePath;
                  this._birthCertificateId = element.fileId;
                } else if (element.docType == 'last_marksheet') {
                  this._lastCertificateUrl = element.filePath;
                  this._lastCertificateId = element.fileId;
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
    if (studentDetails.addressVo.length > 1) {
      this.permanentAddNo = true;
      this.permanentAddYes = false;
    } else if (studentDetails.addressVo.length == 0) {
      this.radioYes('Yes');
      this.permanentAddNo = false;
      this.permanentAddYes = true;
    } else {
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
  onFileChanged(event: any, doc: any) {
    const files = event.target.files;
    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
    }
    if (doc == 'student_photo') {
      let targetElement = event.target as HTMLInputElement;
      this._selectedFile1 = targetElement.files;
      this._formData1 = new FormData();
      for (let i = 0; i < this._selectedFile1.length; i++) {
        this._formData1.append('file', this._selectedFile1[i]);
      }
    }else if (doc == 'guardian_photo') {
      let targetElement = event.target as HTMLInputElement;
      this._selectedFile2 = targetElement.files;
      this._formData2 = new FormData();
      for (let i = 0; i < this._selectedFile2.length; i++) {
        this._formData2.append('file', this._selectedFile2[i]);
      }
    }else if (doc == 'birth_certificate') {
      let targetElement = event.target as HTMLInputElement;
      this._selectedFile3 = targetElement.files;
      this._formData3 = new FormData();
      for (let i = 0; i < this._selectedFile3.length; i++) {
        this._formData3.append('file', this._selectedFile3[i]);
      }
    } else if (doc == 'last_marksheet') {
      let targetElement = event.target as HTMLInputElement;
      this._selectedFile4 = targetElement.files;
      this._formData4 = new FormData();
      for (let i = 0; i < this._selectedFile4.length; i++) {
        this._formData4.append('file', this._selectedFile4[i]);
      }
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      if (doc == 'student_photo') {
        this._studentPhotoUrl =  reader.result;
      } else if (doc == 'guardian_photo') {
        this._guardianPhotoUrl = reader.result;
      } else if (doc == 'birth_certificate') {
        this._birthCertificateUrl = reader.result;
      } else if (doc == 'last_marksheet') {
        this._lastCertificateUrl = reader.result;
      }
    }
}

saveImages(){
  this.openLoader();
  if (this._formData1 != null) {
    this.uploadSingleFile(this._formData1,'student_photo', this._studentPhotoId);
  }
  if (this._formData2 != null) {
    this.uploadSingleFile(this._formData2,'guardian_photo', this._guardianPhotoId);
  }
  if (this._formData3 != null) {
    this.uploadSingleFile(this._formData3,'birth_certificate', this._birthCertificateId);
  }
  if (this._formData4 != null) {
    this.uploadSingleFile(this._formData4,'last_marksheet', this._lastCertificateId);
  }
  this.openSnackBar('Image uploaded sucessfully.')
  this.closeLoader()
}

//Documents Upload Section
uploadSingleFile(formData: FormData, doc: any, id?: any) {
  console.log(id);
  // this.openLoader();
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
          if (doc == 'student_photo') {
            this._studentPhotoUrl = fileRes.filePath;
            this._studentPhotoId = fileRes.fileId;
          } else if (doc == 'guardian_photo') {
            this._guardianPhotoUrl = fileRes.filePath;
            this._guardianPhotoId = fileRes.fileId;
          } else if (doc == 'birth_certificate') {
            this._birthCertificateUrl = fileRes.filePath;
            this._birthCertificateId = fileRes.fileId;
          } else if (doc == 'last_marksheet') {
            this._lastCertificateUrl = fileRes.filePath;
            this._lastCertificateId = fileRes.fileId;
          }
        }
      },
      (error) => {
        // this.closeLoader();
      }
    );
}

  //Documents Upload Section
  // uploadSingleFile(event: any, doc: any, id?: any) {
  //   console.log(id);

  //   let files = event.target.files[0];
  //   let formData = new FormData();
  //   formData.append('file', files, files.name);
  //   this.openLoader();
  //   this._authService
  //     .fileRequest(
  //       'post',
  //       `fe/uploadSingleFileInFolder?formCode=student_media&txId=${this.studentDetails.id}&docType=${doc}&fileId=${id}`,
  //       formData
  //     )
  //     .subscribe(
  //       (fileRes) => {
  //         this.closeLoader();
  //         if (fileRes) {
  //           console.log(fileRes);
  //           console.log(fileRes.filePath);
  //           if (doc == 'student_photo') {
  //             this._studentPhotoUrl = fileRes.filePath;
  //           } else if (doc == 'guardian_photo') {
  //             this._guardianPhotoUrl = fileRes.filePath;
  //           } else if (doc == 'birth_certificate') {
  //             this._birthCertificateUrl = fileRes.filePath;
  //           } else if (doc == 'last_marksheet') {
  //             this._lastCertificateUrl = fileRes.filePath;
  //           }
  //         }
  //       },
  //       (error) => {
  //         this.closeLoader();
  //       }
  //     );
  // }
  //delete picture
  deleteImageFile(id: any, data: any) {
    console.log(id);
    
    if(id){
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
              this._studentPhotoUrl = '';
            }
            if (data === 'guardian_photo') {
              this._guardianPhotoUrl= '';
            }
            if (data === 'birth_certificate') {
              this._birthCertificateUrl = '';
            }
            if (data === 'last_marksheet') {
              this._lastCertificateUrl = '';
            }
          }
        },
        (error) => {
          this.closeLoader();
          this.openSnackBar('File Deleted Unsuccessfully');
        }
      );
    }else{
      this.openLoader();
      if (data === 'student_photo') {
        this._studentPhotoUrl = '';
      }
      if (data === 'guardian_photo') {
        this._guardianPhotoUrl= '';
      }
      if (data === 'birth_certificate') {
        this._birthCertificateUrl = '';
      }
      if (data === 'last_marksheet') {
        this._lastCertificateUrl = '';
      }
      this.closeLoader();
    }
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
    const parentUserJson = JSON.parse(localStorage.getItem('userDetails'));
    data['parentUser'] = parentUserJson;

    console.log(parentUserJson);

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
    } else {
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
      this.editBtn = true;
    } else this.editBtn = false;
  }

  checkLen(event: any, type: any) {
    // console.log(event.target.value.length);
    if (event.target.value.length > 9 && type === 'PHONE') {
      return false;
    } else if (event.target.value.length > 5 && type === 'POSTAL') {
      return false;
    }
    // if(this.value.length > 9) return false;
  }
  ngOnDestroy() {
    localStorage.removeItem('student-profile-prev-url');
  }
}
