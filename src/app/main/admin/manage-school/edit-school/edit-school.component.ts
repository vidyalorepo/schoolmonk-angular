import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HtmlEditorService, ImageService, LinkService, TableService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import axios from 'axios';
import moment from 'moment';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-edit-school',
  templateUrl: './edit-school.component.html',
  styleUrls: ['./edit-school.component.css'],
  providers: [DatePipe,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
    MessageService,
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    TableService,
  ]
})
export class EditSchoolComponent implements OnInit {


  public submitted: boolean = false;
  public isEditBtn: boolean = false;
  public _isValidBanner: boolean = false;
  public _isValidLogo: boolean = false;
  public _isValidImgRatio: boolean = false;
  _schoolID = '';
  _schoolsDetails: any;
  localFields = { text: 'value', value: 'code' };
  _schoolLogoUrl = { fileId: 0, filePath: '' };
  _schoolAdmissionFormUrl = { fileId: 0, filePath: '' };
  _schoolBannerUrl = { fileId: 0, filePath: '' };
  _schoolRegCertificateUrl = { fileId: 0, filePath: '' };
  _bussinessLicenseUrl = { fileId: 0, filePath: '' };
  _schoolBrochureUrl: any;
  _schoolGalleryUrl = [{ fileId: 0, filePath: '' }]
  _selectedMultiFiles: string[] = [];
  stateList = [{ id: '', stateName: '' }]
  _districtList = [{ id: '', districtName: '' }];

  routerState: any;
  // public _boardList = ['CBSE', 'ICSE', 'West Bengal Board', 'NA']
  public _classList = ['Kinder Garden', 'Primary School', 'Secondary School', 'Higher Secondary'];
  _classFromList: any;
  _uptoClassList: any;
  _classStreamsList: any;
  _boardList: any;
  _mediumList: any;
  _schoolTypeList: any;
  _academicYr: any;
  _boardDtl: any;
  lenDtlVo: number = 0;
  _userDetails: any;
  _schoolLevelInfoList: any[];

  _logoInvalidMsg: any = '';
  _bannerInvalidMsg: any = '';
  isSubmit: boolean;
  _schoolsInfraStList: any = [];
  maxDate:Date;
  // Steps definition
  customFormat : string = 'HH:mm';
  steps: any[] = [
    {
      title: 'Basic profile', value: '1', completed: false,
      msg: 'Basic profile added.'
    },
    {
      title: 'Address', value: '2', completed: false,
      msg: 'Address added.'
    },
    {
      title: 'Level', value: '3', completed: false,
      msg: 'Level added.'
    },
    {
      title: 'Timing', value: '4', completed: false,
      msg: 'Timing added.'
    },
    {
      title: 'Documents', value: '5', completed: false,
      msg: 'Documents added.'
    },
    {
      title: 'Academic Achievement', value: '6', completed: false,
      msg: 'Academic Achievement added.'
    },
    {
      title: 'Infrastructure', value: '7', completed: false,
      msg: 'Infrastructure added.'
    },
    // { title: 'Completed', value: '8', completed: false ,
    //   msg: 'All steps completed.'
    // },
  ];
  public tools1: object = {
    items: [
      'Undo',
      'Redo',
      '|',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      'Bold',
      'Italic',
      'Underline',
      '|',
      'OrderedList',
      'UnorderedList',
      'Outdent',
      'Indent',
      '|',
      'CreateTable',
    ],
  };
  public tools: object = {
    items: [
      'Undo',
      'Redo',
      '|',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      'Bold',
      'Italic',
      'Underline',
      '|',
      'OrderedList',
      'UnorderedList',
      'Outdent',
      'Indent',
      '|',
      'CreateTable',
    ],
  };

  public quickTools1: object = {
    image: [
      'Replace',
      'Align',
      'Caption',
      'Remove',
      'InsertLink',
      '-',
      'Display',
      'AltText',
      'Dimension',
    ],
  };
  public quickTools: object = {
    image: [
      'Replace',
      'Align',
      'Caption',
      'Remove',
      'InsertLink',
      '-',
      'Display',
      'AltText',
      'Dimension',
    ],
  };
  maxIndex: number;
  existingSteps: any = [];

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) { }

  addSchoolForm = new FormGroup({});
  contactForm = new FormGroup({})

  // Timing School
  _schoolForm = new FormGroup({});
  _schoolLevelInfoListTime: any;
  errMsg: string = '';

  // Academic Performance

  _schoolAcademicList: any[] = [];
  _academicForm = new FormGroup({});

  ngOnInit(): void {

    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    console.log(this._userDetails);

    if (this._userDetails.userType === 'ADMIN_USER') {
      this.isEditBtn = true;
    } else {
      this.isEditBtn = false;
    }
    this.generateAcademicYear()
    this.getFromClassList();
    this.getUptoClassList();
    this.getStateList();
    this.getBoardList();
    this.getMediumList();
    this.getSchoolType();
    this.initAddSchoolForm();

    this.getSchoolLevel();

    this.initContactForm();

    this._schoolID = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.routerState = this.activatedRoute.routeConfig?.path?.split('/')[1];
    console.log(this.routerState);

    if (this._schoolID != 'add') {
      this.callSchoolByID(this._schoolID);
    }
    // SChool Timing...
    this.inItForm();
    if (this._userDetails.userType === 'ADMIN_USER') {
      this.callSchoolByIDTime(this._schoolID)
    } else {
      this.callSchoolByIDTime(this._userDetails.schoolId)
    }
    // Academic Performance
    this.inItFormAcademic();

    this.getToday();

  }

  callStepsCheck(state: any) {
    const max = Math.max.apply(null, state.map((item: any) => +item));
    console.log(max);
    this.maxIndex = max - 1;
    if (state.length > 0) {
      for (let i = 0; i < this.steps.length; i++) {
        const str = (i + 1).toString();
        if (state.includes(str)) {
          this.steps[i].completed = true;
        } else {
          this.steps[i].completed = false;
        }
      }
    }
    console.log(this.steps);
  }

  ngAfterViewInit() {

  }
  ngAfterViewChecked() {
    this.changeDedectionRef.detectChanges();
  }

  generateAcademicYear() {
    var currentYear = this.datePipe.transform(new Date(), 'yyyy');
    var currentMnt = (new Date().getMonth()) + 1;
    this._academicYr = (currentMnt > 3 ? (currentYear + '-' + (+currentYear + 1)) : ((+currentYear - 1) + '-' + (currentYear)));

  }
  initAddSchoolForm = () => {
    this.addSchoolForm = this.formBuilder.group({
      schoolName: ['', Validators.compose([Validators.required])],
      schoolId: ['', Validators.compose([Validators.required])],
      schoolPrincipalName: [''],
      schoolPrincipalQualification: [''],
      schoolAddress: ['', Validators.compose([Validators.required])],
      phoneCountryCode: ['+91'],
      contactPhone: [''],
      contactEmail: [''],
      contactPersonFirstName: [''],
      contactPersonLastName: [''],
      uploadDoc: [''],
      landMark: [''],
      addressLineTwo: [''],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      district: ['', Validators.compose([Validators.required])],
      postalCode: ['', Validators.compose([Validators.required])],
      schoolMedia: [''],
      // accreditationBy: [''],
      schoolClass: [''],
      messageFromPrincipal: [''],
      aboutSchool: [''],
      establishmentYear: [''],
      notices: [''],
      featuredSchool: [''],
      schoolType: [''],
      // admissionStartDate: [''],
      // admissionEndDate: [''],
      schoolOpenTime: [''],
      schoolCloseTime: [''],
      id: [''],
      customAdmissionForm: [''],
      schoolStatus: [''],
      schoolLevelDtlVo: this.formBuilder.array([]),
      schoolBoard: [[]],
      schoolMedium: [[]],
      schoolRating: [''],
      maxFees: [''],
      minFees: [''],
      schoolNameSlug: [''],
      initiatorsName:['', Validators.compose([Validators.required])],
      initiatorsEmail:['',Validators.compose([Validators.required])],
      initiatorsPhoneNo:['']
    });
    // this.addBlankParameterList()

  }

  get parameterListArray(): FormArray {
    return this.addSchoolForm.get('schoolLevelDtlVo') as FormArray;
  }

  addBlankParameterList(size?: any): void {
    this.submitted = false;

    if (this.addSchoolForm.get('schoolLevelDtlVo').value == '') {
      this.parameterListArray.push(this.fetchBlankParameterList());
    }
    if (size == 1) {
      this.parameterListArray.push(this.fetchBlankParameterList());
    }

  }
  fetchBlankParameterList(i?: any, value?: any, readMode?: any): FormGroup {
    return this.formBuilder.group({

      // academicYear: [this._academicYr],
      // boardName: [''],
      // classStream: [''],
      // endClassSlNo: [''],
      // endClass: [''],
      // medium: [''],
      // startClass: [''],
      // startClassSlNo: [''],

      // tempStartCls: [''],
      // tempEndClass: [''],
      tempStream: [[]],

      id: [''],
      stream: [''],
      schoolLevelName: [''],
      fromClass: [''],
      toClass: [''],
      fromClassNo: [''],
      toClassNo: [''],
      additionalInfo: [''],

    })
  }

  removeRow(i?: any) {
    this.parameterListArray.removeAt(i);

  }

  getSchoolLevel() {
    this._schoolLevelInfoList = []
    this._authService.request('get', 'commonMaster/getSchoolLevels').subscribe((response) => {
      console.log(response);

      if (response.status == 200) {
        this._schoolLevelInfoList = response.result
      }
    })
  }

  selectSclLevel(level: any, index: any) {
    console.log(level);
    for (let i = 0; i < this._schoolLevelInfoList.length; i++) {
      if (this._schoolLevelInfoList[i].schoolLevelName === level) {
        ((this.addSchoolForm.get('schoolLevelDtlVo') as FormArray).at(index) as FormGroup).patchValue({
          stream: [''],
          schoolLevelName: this._schoolLevelInfoList[i].schoolLevelName,
          fromClass: this._schoolLevelInfoList[i].fromClass,
          toClass: this._schoolLevelInfoList[i].toClass,
          fromClassNo: this._schoolLevelInfoList[i].fromClassNo,
          toClassNo: this._schoolLevelInfoList[i].toClassNo,
          additionalInfo: this._schoolLevelInfoList[i].additionalInfo,
        })
        if (this._schoolLevelInfoList[i].toClass === 'XII') {
          ((this.addSchoolForm.get('schoolLevelDtlVo') as FormArray).at(index) as FormGroup).patchValue({
            stream: [''],
          });
          ((this.addSchoolForm.get('schoolLevelDtlVo') as FormArray).at(index) as FormGroup).get('stream').enable();
          this.patchStream(index, ((this.addSchoolForm.get('schoolLevelDtlVo') as FormArray).at(index).value));

        } else {
          // ((this.addSchoolForm.get('schoolLevelDtlVo') as FormArray).at(index) as FormGroup).get('stream').value('');
          ((this.addSchoolForm.get('schoolLevelDtlVo') as FormArray).at(index) as FormGroup).get('stream').disable({ onlySelf: true });
          // ((this.addSchoolForm.get('schoolLevelDtlVo') as FormArray).at(index) as FormGroup).patchValue({
          //   tempStream : [[]],
          // })
        }

      }
    }


  }

  getFromClassList() {
    this._classFromList = []
    this._authService.request('get', 'commonMaster/getClassFromList').subscribe((response) => {
      if (response.status == 200) {
        this._classFromList = response.result
      }
    })
  }

  getUptoClassList() {
    this._uptoClassList = []
    this._authService.request('get', 'commonMaster/getClassUptoList').subscribe((response) => {
      if (response.status == 200) {
        this._uptoClassList = response.result
      }
    })
  }
  classFromChange(id?: any, cls?: any) {
    ((this.addSchoolForm.get('schoolBoardClassDtlVo') as FormArray).at(id) as FormGroup).get('startClassSlNo').patchValue(cls.split('/')[0]);
    ((this.addSchoolForm.get('schoolBoardClassDtlVo') as FormArray).at(id) as FormGroup).get('startClass').patchValue(cls.split('/')[1])


  }

  classUpToChange(id?: any, cls?: any) {

    this._classStreamsList = [];
    ((this.addSchoolForm.get('schoolBoardClassDtlVo') as FormArray).at(id) as FormGroup).get('classStream').patchValue('')
    if (cls) {
      this._authService.request('get', 'commonMaster/getClassStreams?className=' + cls.split('/')[1])
        .subscribe((response) => {
          if (response.status == 200) {
            this._classStreamsList = response.result;
            ((this.addSchoolForm.get('schoolBoardClassDtlVo') as FormArray).at(id) as FormGroup).get('tempStream').patchValue(this._classStreamsList);

            ((this.addSchoolForm.get('schoolBoardClassDtlVo') as FormArray).at(id) as FormGroup).get('endClassSlNo').patchValue(cls.split('/')[0]);
            ((this.addSchoolForm.get('schoolBoardClassDtlVo') as FormArray).at(id) as FormGroup).get('endClass').patchValue(cls.split('/')[1])

          }
        }, error => {
          this._classStreamsList = []
        })
    }

  }

  getBoardList() {
    this._boardList = []
    this._authService.openRequest('get', 'commonMaster/getBoards').subscribe((response) => {
      if (response.status == 200) {
        this._boardList = response.result
      }
    })
  }

  getMediumList() {
    this._mediumList = []
    this._authService.openRequest('get', 'commonMaster/getMediums').subscribe((response) => {
      if (response.status == 200) {
        this._mediumList = response.result
      }
    })
  }

  getSchoolType() {
    this._schoolTypeList = []
    this._authService.openRequest('get', 'commonMaster/getSchoolTypes').subscribe((response) => {

      if (response.status == 200) {
        this._schoolTypeList = response.result
      }
    })
  }

  getStateList() {
    this.stateList = []
    this._authService.request('get', 'commonMaster/getStateList').subscribe((response) => {
      if (response.status == 200) {
        response.result.forEach((element: any) => {
          this.stateList.push(element)
        });
        console.log(this.stateList);

      }

    })
  }
  // onState() {
  //   if (this.addSchoolForm.value.state) {
  //     this._districtList = []
  //     this._authService.request('get', 'commonMaster/getDistrictListByState?stateId=' + this.addSchoolForm.value.state).subscribe((response) => {
  //       if (response.status == 200) {
  //         response.result.forEach((element: any) => {
  //           this._districtList.push(element)
  //         });
  //       }

  //     })
  //   }
  //   else {
  //     this.addSchoolForm.patchValue({ district: '' })
  //   }

  // }
  onState() {
    console.log(+this.addSchoolForm.value.state);
    let stName: any;
    if (this.addSchoolForm.value.state) {
      for (let i = 0; i < this.stateList.length; i++) {
        if (+this.stateList[i].id == +this.addSchoolForm.value.state) {
          stName = this.stateList[i].stateName
        }
      }
      this._districtList = []
      this._authService.request('get', 'commonMaster/getDistrictListByState?stateName=' + stName).subscribe((response) => {
        if (response.status == 200) {
          response.result.forEach((element: any) => {
            this._districtList.push(element)
          });
        }

      })
    }
    else {
      this.addSchoolForm.patchValue({ district: '' })
    }

  }






  callSchoolByID(id: any) {
    this.openLoader()
    this._authService.loader.next({ load: true, })
    this._schoolGalleryUrl = [];
    this._schoolBrochureUrl = [];
    this._authService.request('get', 'schooluser/school/' + id).subscribe((response) => {
      this.closeLoader();
      console.log(response);
      if (response) {
        this._schoolsDetails = response;
        this.existingSteps = [];
        if (response.profileStepSet != null) {
          this.existingSteps = response.profileStepSet;
          this.callStepsCheck(response.profileStepSet);
        }

        // this._boardDtl = response.schoolBoardClassDtlVo.length;
        this.patchForm(this._schoolsDetails)
        if (response.docList.length > 0) {
          response.docList.reverse().forEach((element: any) => {
            if (element.docType == "school_logo") {
              this._schoolLogoUrl = element
            }
            else if (element.docType == "school_banner") {
              this._schoolBannerUrl = element
            }
            else if (element.docType == "registration_Certification") {
              this._schoolRegCertificateUrl = element
            }
            else if (element.docType == "license_Certificate") {
              this._bussinessLicenseUrl = element
            }
            else if (element.docType == "school_Brochure") {
              this._schoolBrochureUrl = element
            }
            else if (element.docType == "school_gallery") {
              this._schoolGalleryUrl.push(element)
            }
            else if (element.docType == "Custom_Form") {
              this._schoolAdmissionFormUrl = element
            }
          });

        }

      }


    }, error => {
      this.closeLoader();
    })
  }
  patchForm(details: any) {
    this.addSchoolForm.patchValue({
      schoolName: details.schoolName,
      schoolId: details.schoolId,
      schoolPrincipalName: details.schoolPrincipalName,
      schoolPrincipalQualification: details.schoolPrincipalQualification,
      schoolAddress: details.schoolAddress,
      phoneCountryCode: details.phoneCountryCode,
      contactPhone: details.contactPhone,
      contactEmail: details.contactEmail,
      contactPersonFirstName: details.contactUser?.firstName,
      contactPersonLastName: details.contactUser?.lastName,
      uploadDoc: details.uploadDoc,
      landMark: details.landMark,
      addressLineTwo: details.addressLineTwo,
      city: details.city,
      state: details.state,
      district: details.district,
      postalCode: details.postalCode,
      schoolMedia: details.schoolMedia,
      featuredSchool: (details.featuredSchool == 'Y' ? true : false),
      // accreditationBy: details.accreditationBy,
      schoolType:  (details.schoolType ? (details.schoolType.split(',')) : ''),
      schoolClass: (details.schoolClass ? (details.schoolClass).split(',') : ''),
      messageFromPrincipal: details.messageFromPrincipal,
      aboutSchool: details.aboutSchool,
      establishmentYear: details.establishmentYear,
      notices: details.notices,
      id: details.id,
      // admissionStartDate: (details.admissionStartDate ? details.admissionStartDate.split('T')[0] : ''),
      // admissionEndDate: (details.admissionEndDate ? details.admissionEndDate.split('T')[0] : ''),
      startClass: details.startClass,
      endClass: details.endClass,
      stream: details.stream,
      customAdmissionForm: (details.customAdmissionForm == 'Y' ? true : false),
      schoolStatus: details.schoolStatus,
      schoolBoard: (details.schoolBoard ? (details.schoolBoard.split(',')) : ''),
      schoolMedium: (details.schoolMedium ? (details.schoolMedium.split(',')) : ''),
      schoolRating: details.schoolRating,
      maxFees: details.maxFees,
      minFees: details.minFees,
      schoolNameSlug: details.schoolNameSlug,
      initiatorsName: details.initiatorsName,
      initiatorsEmail: details.initiatorsEmail,
      initiatorsPhoneNo: details.initiatorsPhoneNo

    })
    // this.lenDtlVo = details.schoolBoardClassDtlVo.length;
    this.addparameterList(details.schoolLevelDtlVo.length, details.schoolLevelDtlVo)
    this.onState();
    this.addBlankParameterList(0);
    if (details.contactUser != null) {
      this.patchContactDtl(details.contactUser);
    }


  }

  addparameterList(size?: any, value?: any,): void {

    for (let i = 0; i < size; i++) {
      this.patchStream(i, (value[i]));
      this.parameterListArray.push(this.fetchParameterList(i, value));
    }
  }
  fetchParameterList(i?: any, value?: any) {

    let tempArrStream = [];

    if (value[i].stream != '') {
      tempArrStream = value[i].stream.split(',');
    } else {
      tempArrStream = [];
    }
    console.log("tempArrStream ", tempArrStream);

    let isDisabled = false;
    if (value[i].toClass === 'XII') {
      isDisabled = false;
      // this.patchStream(i, ((this.addSchoolForm.get('schoolLevelDtlVo') as FormArray).at(i).value));
    } else {
      isDisabled = true;
    }
    console.log(value[i].schoolLevelName);

    return this.formBuilder.group({
      // id: value[i].id,
      // academicYear: value[i].academicYear,
      // boardName: value[i].boardName,
      // classStream: [''],
      // endClassSlNo: value[i].endClassSlNo,
      // endClass: value[i].endClass,
      // medium: value[i].medium,
      // startClass: value[i].startClass,
      // startClassSlNo: value[i].startClassSlNo,
      // tempStartCls: value[i].startClassSlNo + '/' + value[i].startClass,
      // tempEndClass: value[i].endClassSlNo + '/' + value[i].endClass,
      tempStream: [tempArrStream],

      id: value[i].id,
      stream: [{ value: [tempArrStream], disabled: isDisabled }],
      schoolLevelName: value[i].schoolLevelName,
      fromClass: value[i].fromClass,
      toClass: value[i].toClass,
      fromClassNo: value[i].fromClassNo,
      toClassNo: value[i].toClassNo,
      additionalInfo: value[i].additionalInfo,
    });

  }

  patchStream(i?: any, value?: any) {
    console.log(value);
    this._classStreamsList = []
    if (value.toClass === 'XII') {
      this._authService.request('get', 'commonMaster/getClassStreams?className=' + value.toClass)
        .subscribe((response) => {
          console.log(response);
          if (response.status == 200) {
            this._classStreamsList = response.result;
            ((this.addSchoolForm.get('schoolLevelDtlVo') as FormArray).at(i) as FormGroup).get('tempStream').patchValue(this._classStreamsList);

            ((this.addSchoolForm.get('schoolLevelDtlVo') as FormArray).at(i) as FormGroup).get('stream').patchValue((value.stream != '' ? (value.stream.split(',')) : ''));

          }
        }, error => {
          this._classStreamsList = []
        })
    }
  }

  // Save Update
  async submitUpdateSchoolRecord(profileStep: any) {
    console.log("in clickk");

    this.submitted = true;
    const data = this.addSchoolForm.value;
    this.existingSteps.push(profileStep);
    data.profileStepSet = this.existingSteps;
    data.contactUser = { "userId": (this._schoolsDetails.contactUser) ? this._schoolsDetails.contactUser.userId : this._userDetails?.userId}
    data.schoolClass = data.schoolClass.toString();
    if (data.featuredSchool == true) { data.featuredSchool = 'Y' }
    else if (data.featuredSchool == false) { data.featuredSchool = 'N' }

    if (data.customAdmissionForm == true) { data.customAdmissionForm = 'Y' }
    else if (data.customAdmissionForm == false) { data.customAdmissionForm = 'N' }

    if (profileStep !== '2') {
      this.addSchoolForm.get('schoolAddress').clearValidators();
      this.addSchoolForm.get('schoolAddress').updateValueAndValidity();
      this.addSchoolForm.get('city').clearValidators();
      this.addSchoolForm.get('city').updateValueAndValidity();
      this.addSchoolForm.get('district').clearValidators();
      this.addSchoolForm.get('district').updateValueAndValidity();
      this.addSchoolForm.get('state').clearValidators();
      this.addSchoolForm.get('state').updateValueAndValidity();
      this.addSchoolForm.get('postalCode').clearValidators();
      this.addSchoolForm.get('postalCode').updateValueAndValidity();
    }


    if (this.addSchoolForm.status == 'VALID') {
      this.openLoader();

      data.schoolBoard = data.schoolBoard.toString();
      data.schoolMedium = data.schoolMedium.toString();
      data.schoolType=data.schoolType.toString();
      let tempSclLevelDetails = [];
      tempSclLevelDetails = data.schoolLevelDtlVo;
      data.schoolLevelDtlVo = [];
      tempSclLevelDetails.forEach((ele: any) => {
        data.schoolLevelDtlVo.push({
          id: ele.id || null,
          stream: (ele.stream ? ele.stream.toString() : ''),
          schoolLevelName: ele.schoolLevelName,
          fromClass: ele.fromClass,
          toClass: ele.toClass,
          fromClassNo: ele.fromClassNo,
          toClassNo: ele.toClassNo,
          additionalInfo: ele.additionalInfo,
        })

      });

      //fetching school coordinates
      const coordinates = await this.fetchSchoolCoordinates();
      if (coordinates === null) {
        data.latitude = 0.000000;
        data.longitude = 0.000000;
      } else {
        console.log("Geocoding coordinates: ", coordinates);
        data.latitude = coordinates.location.lat;
        data.longitude = coordinates.location.lng;

      }

      // data.schoolBoardClassDtlVo = [];
      console.log("Submit form data -->> ", data);
      // return
      this._authService.request('post', `schooluser/schoolUpdate`, data)
        .subscribe(res => {
          console.log(res);
          this.closeLoader()
          if (res.status == 200) {
            this.messageService.clear();
            this.messageService.add({severity:'success', summary:'', detail:'School details has been updated.'});
            this.ngOnInit();
            // if (this.routerState == 'edit-school') {
            //    this.router.navigate(['/manage-school/school-list']) 
            //   }
            // else if (this.routerState == 'school-profile-edit') {
            //   this.editButton()
            //   window.location.reload()
            //   this.callSchoolByID(this._schoolID)

            // }

          }

        }, error => {
          this.messageService.clear();
          this.messageService.add({severity:'error', summary:'', detail:'School details updated has been failed.'});
          this.closeLoader()
        })
    } else {
      console.log("form control -->> ", this.addSchoolForm.controls);
    }



  }



  uploadSchoolLogo(event: any, doc: any, id?: any, imgSize?: number, element?: any) {
    this._logoInvalidMsg = '';
    this._isValidImgRatio = false;
    // let imgRatio: number = (imgSize == 100000 ? 1 : imgSize == 400000 ? 2 : 0)
    let files = event.target.files[0];
    // 100Kb = 100000 Byte
    if ((files.type == "image/jpeg" || files.type == "image/jpg" || files.type == "image/png")) {
      if ((files.size <= 100000)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = (rs: any) => {
            console.log(rs.currentTarget['width']);
            console.log(rs.currentTarget['height']);
            if (rs.currentTarget['width'] / rs.currentTarget['height'] == 1) {
              let formData = new FormData();
              formData.append('file', files, files.name);
              this.openLoader();

              this._authService.fileRequest('post', `fe/uploadSingleFileInFolder?formCode=school_media&txId=${this._schoolID}&docType=${doc}&fileId=${id || ''}`, formData).subscribe(fileRes => {
                this.closeLoader()
                if (fileRes) {
                  if (doc == 'school_logo') { this._schoolLogoUrl = fileRes }
                  else if (doc == 'school_banner') { this._schoolBannerUrl = fileRes }
                  else if (doc == 'registration_Certification') {
                    this._schoolRegCertificateUrl = fileRes;

                  }
                  else if (doc == 'license_Certificate') {
                    this._bussinessLicenseUrl = fileRes;

                  }
                  else if (doc == 'school_Brochure') { this._schoolBrochureUrl = fileRes }
                  else if (doc == 'Custom_Form') { this._schoolAdmissionFormUrl = fileRes }

                }
              }, error => {
                this.closeLoader()
              })

            }
            else {
              console.log("Not Valid Ratio");
              this._logoInvalidMsg = "Invalid file dimension.";
              element.value = "";

            }
          }
        }
        reader.readAsDataURL(event.target.files[0]);
      }
      else {
        this._logoInvalidMsg = "Invalid file size.";
      }


    }
    else {
      console.log("Not Valid Format");
      element.value = "";
      this._logoInvalidMsg = "Invalid file type.";
    }

  }

  uploadSchoolBanner(event: any, doc: any, id?: any, imgSize?: number, element?: any) {
    this._bannerInvalidMsg = '';
    this._isValidImgRatio = false;
    // let imgRatio: number = (imgSize == 100000 ? 1 : imgSize == 400000 ? 2 : 0)
    let files = event.target.files[0];
    // 100Kb = 100000 Byte
    if ((files.type == "image/jpeg" || files.type == "image/jpg" || files.type == "image/png") && (files.size < 400000)) {

      if (files.size <= 400000) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = (rs: any) => {
            console.log(rs.currentTarget['width']);
            console.log(rs.currentTarget['height']);
            if (rs.currentTarget['width'] / rs.currentTarget['height'] == 2) {
              let formData = new FormData();
              formData.append('file', files, files.name);
              this.openLoader();
              this._authService.fileRequest('post', `fe/uploadSingleFileInFolder?formCode=school_media&txId=${this._schoolID}&docType=${doc}&fileId=${id || ''}`, formData).subscribe(fileRes => {
                this.closeLoader()
                if (fileRes) {
                  if (doc == 'school_logo') { this._schoolLogoUrl = fileRes }
                  else if (doc == 'school_banner') { this._schoolBannerUrl = fileRes }
                  else if (doc == 'registration_Certification') { this._schoolRegCertificateUrl = fileRes }
                  else if (doc == 'license_Certificate') { this._bussinessLicenseUrl = fileRes }
                  else if (doc == 'school_Brochure') { this._schoolBrochureUrl = fileRes }
                  else if (doc == 'Custom_Form') { this._schoolAdmissionFormUrl = fileRes }

                }
              }, error => {
                this.closeLoader()
              })

            }
            else {
              console.log("Not Valid Ratio");
              this._bannerInvalidMsg = "Invalid file dimension.";
              element.value = "";

            }
          }
        }
        reader.readAsDataURL(event.target.files[0]);
      }
      else {
        this._bannerInvalidMsg = 'Invalid file size.';
      }

    }
    else {
      element.value = "";
      this._bannerInvalidMsg = 'Invalid file type.';
    }

  }

  uploadSingleFile(event: any, doc: any, id?: any) {
    console.log(event);

    let files = event.target.files[0];
    let formData = new FormData();
    formData.append('file', files, files.name);
    this.openLoader();
    let profileStepTemp;
    if (doc === 'registration_Certification' || doc === 'license_Certificate') {
      profileStepTemp = '5';
    }
    this._authService.fileRequest('post', `fe/uploadSingleFileInFolder?formCode=school_media&txId=${this._schoolID}&docType=${doc}&fileId=${id || ''}&profileStep=${profileStepTemp}`, formData).subscribe(fileRes => {
      this.closeLoader()
      if (fileRes) {
        console.log(fileRes);
        console.log(fileRes.filePath);
        if (doc == 'school_logo') { this._schoolLogoUrl = fileRes }
        else if (doc == 'school_banner') { this._schoolBannerUrl = fileRes }
        else if (doc == 'registration_Certification') {
          this._schoolRegCertificateUrl = fileRes;
          this.existingSteps = [];
          if (fileRes.profileStepSet != null) {
            this.existingSteps = fileRes.profileStepSet;
            this.callStepsCheck(fileRes.profileStepSet);
          }

        }
        else if (doc == 'license_Certificate') {
          this._bussinessLicenseUrl = fileRes;
          this.existingSteps = [];
          if (fileRes.profileStepSet != null) {
            this.existingSteps = fileRes.profileStepSet;
            this.callStepsCheck(fileRes.profileStepSet);
          }
        }
        else if (doc == 'school_Brochure') { this._schoolBrochureUrl = fileRes }
        else if (doc == 'Custom_Form') { this._schoolAdmissionFormUrl = fileRes }

      }
    }, error => {
      this.closeLoader()
    })

  }
  uploadMultipleFile(event: any, doc: any) {
    console.log(event);
    for (var i = 0; i < event.target.files.length; i++) {
      this._selectedMultiFiles.push(event.target.files[i]);
    }
    const formData = new FormData();

    for (var i = 0; i < this._selectedMultiFiles.length; i++) {
      formData.append("files", this._selectedMultiFiles[i]);
    }
    this.openLoader();
    this._authService.fileRequest('post', `fe/uploadMultipleFileInFolder?formCode=school_media&txId=${this._schoolID}&docType=${doc}`, formData).subscribe(fileRes => {
      this.closeLoader()
      if (fileRes) {
        console.log(fileRes);
        if (fileRes.length > 0) {
          if (doc == 'school_gallery') {
            fileRes.forEach((element: any) => {
              this._schoolGalleryUrl.push(element)
            });
            console.log(this._schoolGalleryUrl);

          }
        }
      }
    }, error => {
      this.closeLoader()
    })

  }
  editButton() {
    this.isEditBtn = !this.isEditBtn
  }

  deleteImageFile(id: any) {
    console.log(id);
    this.openLoader()
    this._authService.request('delete', "fe/attachment?fileId=" + id).subscribe(res => {
      console.log(res);
      this.closeLoader()
      if (res.status == 200) {
        this.messageService.clear();
        this.messageService.add({severity:'success', summary:'', detail:"File has been deleted.."});
        // this.openSnackBar('File Deleted Successful')
        this.callSchoolByID(this._schoolID);
      }

    }, error => {
      this.closeLoader()
      this.messageService.clear();
      this.messageService.add({severity:'success', summary:'', detail:"File deleted failed."});
      // this.errorSnackBar('File Deleted Unsuccessful')
    })
  }

  addSchoolTime() {

    this.router.navigate(['/manage-school/timing-list'])
    if (this._schoolsDetails.schoolBoardClassDtlVo.length > 0) {
      console.log("Go to Add Time");

    }
    else {
      console.log("Not Allowed");

    }
    // this.router.navigate(['/manage-school/timing-list'])
  }
  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  errorSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getToday() {
   this.maxDate=new Date();
  }


  // School Timing section Started

  callSchoolByIDTime(id: any) {
    this.openLoader()
    this._authService.request('get', 'schooluser/school/' + id).subscribe((res) => {
      this.closeLoader();
      console.log(res);

      if (res) {
        this._schoolLevelInfoListTime = res.schoolLevelDtlVo;
        console.log("_schoolLevelInfoListTime :", this._schoolLevelInfoListTime);
        if (res.schoolTimingDtlVo.length > 0) {
          this.addPatchParameterListTime(res.schoolTimingDtlVo.length, res.schoolTimingDtlVo);
        } else {
          this.addBlankParameterListTime();
        }

        if (res.schoolLevelDtlVo.length < 1) {
          this.errMsg = 'Please add school class level to add timing details.'
        } else {
          this.errMsg = '';
        }

        this._schoolsInfraStList = res.schoolInfraDtlVo;
        console.log("_schoolsInfraStList :", this._schoolsInfraStList);
        this._schoolAcademicList = res.schoolAcademicDtlVo;
      }

    }, error => { this.closeLoader() })
  }

  selectSclLevelTime(level: any, index: any) {
    console.log(level);
    if (level) {
      for (let i = 0; i < this._schoolLevelInfoListTime.length; i++) {
        if (this._schoolLevelInfoListTime[i].schoolLevelName === level) {
          ((this._schoolForm.get('schoolTimingDtlVo') as FormArray).at(index) as FormGroup).patchValue({
            schoolLevelName: this._schoolLevelInfoListTime[i].schoolLevelName,
            // fromClass : this._schoolLevelInfoList[i].fromClass,
            // toClass : this._schoolLevelInfoList[i].toClass,
            // fromClassNo : this._schoolLevelInfoList[i].fromClassNo,
            // toClassNo : this._schoolLevelInfoList[i].toClassNo,
            // additionalInfo : this._schoolLevelInfoList[i].additionalInfo,
          })


        }
      }
    } else {
      ((this._schoolForm.get('schoolTimingDtlVo') as FormArray).at(index) as FormGroup).patchValue({
        schoolLevelName: '',
        // fromClass : '',
        // toClass : '',
        // fromClassNo : '',
        // toClassNo : '',
        additionalInfo: '',
      })
    }



  }


  inItFormAcademic() {
    this._schoolForm = this.formBuilder.group({
      schoolTimingDtlVo: this.formBuilder.array([]),
    })

  }

  get parameterListArrayTime(): FormArray {
    return this._schoolForm.get('schoolTimingDtlVo') as FormArray;
  }

  addBlankParameterListTime(size?: any, value?: any): void {
    this.isSubmit = false;
    this.parameterListArrayTime.push(this.fetchBlankParameterListTime());
  }
  fetchBlankParameterListTime(i?: any, value?: any, readMode?: any): FormGroup {
    return this.formBuilder.group({
      id: [''],
      startTime: ['', Validators.compose([Validators.required])],
      endTime: ['', Validators.compose([Validators.required])],

      schoolLevelName: ['', Validators.compose([Validators.required])],
      additionalInfo: [''],
    })
  }

  addPatchParameterListTime(size?: any, value?: any,): void {

    for (let i = 0; i < size; i++) {
      this.parameterListArrayTime.push(this.fetchParameterListTime(i, value));
    }
  }
  fetchParameterListTime(i?: any, value?: any) {

    return this.formBuilder.group({
      id: value[i].id,
      startTime: value[i].startTime,
      endTime: value[i].endTime,
      schoolLevelName: value[i].schoolLevelName,
      additionalInfo: value[i].additionalInfo,
    });

  }
  Validate(index:any,startTime:any,endTime:any){
    var a = moment(startTime, "HH:mm");
    var b = moment(endTime, "HH:mm");
    let result =b.diff(a, 'minutes');
   
    console.log(result);
    if (result <=30) {
      this.parameterListArrayTime.controls[index].get('endTime')?.setErrors({Invali:"Time Should be maintain 30 min gap"});
      this.parameterListArrayTime.at(index).patchValue({
        endTime: null
      })
    }
    

  }
  removeRowTime(id?: any, i?: any) {

    console.log(id);

    // deleteSchoolTimingDtl
    if (id) {
      let data = { id: '' };
      data.id = id;
      this._authService.request('post', `schooluser/deleteSchoolTimingDtl`, data)
        .subscribe(res => {
          console.log(res);
          if (res.status == 200) {
            this.messageService.clear();
            this.messageService.add({severity:'success', summary:'', detail:'Class time has been deleted successful.'});
            this.parameterListArrayTime.removeAt(i);
            this.ngOnInit();
          }

        })

    } else {
      this.parameterListArrayTime.removeAt(i);
    }
  }


  submitTiming(profileStep: any) {
    this.isSubmit = true;
    // let tempDataList: { academicYear: any; classRange: any; startTime: any; endTime: any; boardName: any }[] = [];
    if (this._schoolForm.status == 'VALID') {
      let data = { ...this._schoolForm.value };
      console.log(data);
      this.openLoader();
      for (let index = 0; index < data.schoolTimingDtlVo.length; index++) {
       
        if (moment(this.parameterListArrayTime.controls[index].get('startTime').value, moment.ISO_8601, true).isValid() && this.parameterListArrayTime.controls[index].get('endTime').value) {
          this.parameterListArrayTime.controls[index].get('startTime').setValue(this.datePipe.transform(data.schoolTimingDtlVo[index].startTime,'HH:mm'));
          console.log(this.parameterListArrayTime.controls[index].get('startTime').setValue(this.datePipe.transform(data.schoolTimingDtlVo[index].startTime,'HH:mm')));
          this.parameterListArrayTime.controls[index].get('endTime').setValue(this.datePipe.transform(data.schoolTimingDtlVo[index].endTime,'HH:mm'));
          console.log(this.parameterListArrayTime.controls[index].get('endTime').setValue(this.datePipe.transform(data.schoolTimingDtlVo[index].endTime,'HH:mm')));
        }
      }
      data = { ...this._schoolForm.value };
      data.id = this._schoolID;
      this.existingSteps.push(profileStep);
      data.profileStepSet = this.existingSteps;
      console.log(data);
      this.openLoader();
      this._authService.request('post', `schooluser/saveSchoolTimingDtl`, data).subscribe(res => {
        this.closeLoader();
        console.log(res);
        if (res.status == 200) {
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:res.message});
          // this.router.navigate(['/manage-school/timing-list'])
          this.ngOnInit();
        }


      }, error => {
        console.log(error.error);
        if (error.error.status === 406) {
          this.messageService.clear();
          this.messageService.add({severity:'error', summary:'', detail:error.error.message});
        }
        this.closeLoader()

      })
    }


  }


  // Infrastructures
  deleteInfraSt(id?: any, index?: any) {
    let data = { id: '' };
    data.id = id;

    this._authService.request('post', `schooluser/deleteSchoolInfraDtl`, data)
      .subscribe(res => {
        console.log(res);
        if (res.status == 200) {
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:"Infrastructure has been deleted successful."});
          this._schoolsInfraStList.splice(index);
          this.ngOnInit();
        }


      })
  }

  // Academic performance

  inItForm() {
    this._academicForm = this.formBuilder.group({
      id: [''],
      academicYear: ['', Validators.compose([Validators.required])],
      performanceTitle: ['', Validators.compose([Validators.required])],
      academicInformation: ['', Validators.compose([Validators.required])]
    })
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
      data.id = this._schoolID;

      console.log(data);
      // return
      this.openLoader();
      this._authService.request('post', `schooluser/saveSchoolAcademicDtl`, data).subscribe(res => {
        this.closeLoader();
        console.log(res);
        if (res.status == 200) {
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:"School Academic Achievement has been updated successful."});
          document.getElementById('myModal').click();
          this.ngOnInit();
        }


      }, error => { this.closeLoader() })
      this.messageService.clear();
      this.messageService.add({severity:'error', summary:'', detail:"School Academic Achievement updated has been failed."});
    }
  }

  deleteAcademic(id?: any, index?: any) {
    console.log(id);

    let data = { id: '' };
    data.id = id;

    this.openLoader();
    this._authService.request('post', `schooluser/deleteSchoolAcademicDtl`, data)
      .subscribe(res => {
        this.closeLoader();
        console.log(res);
        if (res.status == 200) {
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:"Academic Details has been deleted successful."});
          document.getElementById('myModal').click();
          this._schoolAcademicList.splice(index);
          this.ngOnInit();
        }


      }, error => {
        this.closeLoader();
      })
  }


  patchContactDtl(contactDtl: any) {
    this.contactForm.patchValue({
      contactPersonFirstName: contactDtl?.firstName,
      contactPersonLastName: contactDtl?.lastName,
      contactEmail: contactDtl?.email,
      contactPhone: contactDtl?.phone,
      phoneCountryCode: contactDtl?.phoneCountryCode
    })
  }

  initContactForm = () => {
    this.contactForm = this.formBuilder.group({
      contactPersonFirstName: ['',Validators.required],
      contactPersonLastName: ['',Validators.required],
      contactEmail: ['',Validators.required],
      contactPhone: ['',Validators.required],
      phoneCountryCode: ['+91'],
      id: ['']
    })

  }

  updateContactInfo() {

    const data = this.contactForm.value;
    data.id = this._schoolsDetails.id;

    console.log(data);
    if (data) {
      this.openLoader();
      this._authService.request('post', `users/activateUser`, data)
        .subscribe(res => {
          this.closeLoader();
          console.log(res);
          if (res.status == 200) {
            this.messageService.clear();
            this.messageService.add({severity:'success', summary:'', detail:"User details has been updated."});
          document.getElementById('myModal').click();
            this.callSchoolByID(this._schoolID);
          }
        }, (error) => {
          console.log(error);
          this.messageService.clear();
          this.messageService.add({severity:'error', summary:'', detail:error.error?.message});
          this.closeLoader();
        })
    }

  }

  // School Coordinates
  async fetchSchoolCoordinates(): Promise<any> {
    const schoolName = this.addSchoolForm.get('schoolName').value;
    const schoolCity = this.addSchoolForm.get('city').value;
    const schoolDistrict = this.addSchoolForm.get('district').value;
    let schoolDistrictName = "";
    this._districtList.map(item => {
      if (item.id === schoolDistrict) {
        schoolDistrictName = item.districtName;
        return;
      }
    })
    const schoolState = this.addSchoolForm.get('state').value;
    let schoolStateName = "";
    this.stateList.map(item => {
      if (item.id === schoolState) {
        schoolStateName = item.stateName;
        return;
      }
    })
    const schoolPostal = this.addSchoolForm.get('postalCode').value

    const queryString = `${schoolName}, ${schoolCity}, ${schoolDistrictName}, ${schoolStateName}, ${schoolPostal}`.replace(/\s/g, "+");
    const queryUrl = this._authService.MAPS_ENDPOINT + queryString + "&key=" + this._authService.MAPS_API_KEY;
    let geometry = null;
    await axios.get(queryUrl).then(data => {
      console.log("Geocoding Response: ", data);

      if (data.data.results.length > 0) {
        geometry = data.data.results[0].geometry;

      }
    })

    return geometry;

  }

}
