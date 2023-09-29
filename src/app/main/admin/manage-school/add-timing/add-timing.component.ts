import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng-lts/api';


@Component({
  selector: 'app-add-timing',
  templateUrl: './add-timing.component.html',
  styleUrls: ['./add-timing.component.css'],
  providers: [DatePipe]
})
export class AddTimingComponent implements OnInit {

  _schoolForm = new FormGroup({});
  _userDetails: any;
  _academicYr: any;
  isSubmit: boolean = false;
  classList = [{ code: 0, class: 'Nursery' },
  { code: 1, class: 'I' },
  { code: 2, class: 'II' },
  { code: 3, class: 'III' },
  { code: 4, class: 'IV' },
  { code: 5, class: 'V' },
  { code: 6, class: 'VI' },
  { code: 7, class: 'VII' },
  { code: 8, class: 'VIII' },
  { code: 9, class: 'IX' },
  { code: 10, class: 'X' },
  { code: 11, class: 'XI' },
  { code: 12, class: 'XII' }

  ]

  _classFromList: { classDisplay: any }[] = [];
  _uptoClassList: { classDisplay: any }[] = [];
  _boardList: any;
  _schoolLevelInfoList: any;
  errMsg: string = '';

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) { }


  ngOnInit(): void {

    this.generateAcademicYear();

    this.inItForm();
    this.getFromClassList();
    this.getUptoClassList();
    this.getBoardList();
    
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    if (this._userDetails) {
      this.callSchoolByID(this._userDetails.schoolId)
    }

  }

  callSchoolByID(id: any) {
    this.openLoader()
    this._authService.request('get', 'schooluser/school/' + id).subscribe((res) => {
      this.closeLoader();
      console.log(res);
      
      if (res) {
        this._schoolLevelInfoList = res.schoolLevelDtlVo;
        console.log("_schoolLevelInfoList :", this._schoolLevelInfoList);
        if(res.schoolTimingDtlVo.length > 0){
          this.addPatchParameterList(res.schoolTimingDtlVo.length, res.schoolTimingDtlVo);
        }else{
          this.addBlankParameterList();
        }
        if( res.schoolLevelDtlVo.length < 1 ){
          this.errMsg = 'Please add school level to add timing details.'
        }
      }

    }, error => { this.closeLoader() })
  }

  selectSclLevel(level:any, index:any){
    console.log(level);
    if(level){
      for(let i=0; i<this._schoolLevelInfoList.length; i++){
        if(this._schoolLevelInfoList[i].schoolLevelName === level){
          ((this._schoolForm.get('schoolTimingDtlVo') as FormArray).at(index) as FormGroup).patchValue({
            schoolLevelName : this._schoolLevelInfoList[i].schoolLevelName,
            // fromClass : this._schoolLevelInfoList[i].fromClass,
            // toClass : this._schoolLevelInfoList[i].toClass,
            // fromClassNo : this._schoolLevelInfoList[i].fromClassNo,
            // toClassNo : this._schoolLevelInfoList[i].toClassNo,
            // additionalInfo : this._schoolLevelInfoList[i].additionalInfo,
          })
          
          
        }
      }
    }else{
        ((this._schoolForm.get('schoolTimingDtlVo') as FormArray).at(index) as FormGroup).patchValue({
          schoolLevelName : '',
          // fromClass : '',
          // toClass : '',
          // fromClassNo : '',
          // toClassNo : '',
          additionalInfo : '',
        })
    }
    
    
    
  }

  generateAcademicYear() {
    var currentYear = this.datePipe.transform(new Date(), 'yyyy');
    var currentMnt = (new Date().getMonth()) + 1;
    this._academicYr = (currentMnt > 3 ? (currentYear + '-' + (+currentYear + 1)) : ((+currentYear - 1) + '-' + (currentYear)))
    // this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
  }

  getFromClassList() {
    this._classFromList = []
    this._authService.request('get', 'commonMaster/getClassFromList').subscribe((response) => {
      if (response.status == 200) {
        this._classFromList = response.result
      }
      console.log('_classFromList :', this._classFromList);
    })
  }

  getUptoClassList() {
    this._uptoClassList = []
    this._authService.request('get', 'commonMaster/getClassUptoList').subscribe((response) => {
      if (response.status == 200) {
        this._uptoClassList = response.result
      }
      console.log('_uptoClassList :', this._uptoClassList);
    })
  }

  getBoardList() {
    this._boardList = []
    this._authService.request('get', 'commonMaster/getBoards').subscribe((response) => {
      if (response.status == 200) {
        this._boardList = response.result
      }
    })
  }

  inItForm() {
    this._schoolForm = this.formBuilder.group({
      schoolTimingDtlVo: this.formBuilder.array([]),
    })
    
  }

  get parameterListArray(): FormArray {
    return this._schoolForm.get('schoolTimingDtlVo') as FormArray;
  }

  addBlankParameterList(size?: any, value?: any): void {
    this.isSubmit = false;
    this.parameterListArray.push(this.fetchBlankParameterList());
  }
  fetchBlankParameterList(i?: any, value?: any, readMode?: any): FormGroup {
    return this.formBuilder.group({
      id: [''],
      startTime: ['', Validators.compose([Validators.required])],
      endTime: ['', Validators.compose([Validators.required])],

      schoolLevelName : ['', Validators.compose([Validators.required])],
      additionalInfo : [''],
    })
  }

  addPatchParameterList(size?: any, value?: any,): void {

    for (let i = 0; i < size; i++) {
      this.parameterListArray.push(this.fetchParameterList(i, value));
    }
  }
  fetchParameterList(i?: any, value?: any) {
    
    return this.formBuilder.group({
      id: value[i].id,
      startTime: value[i].startTime,
      endTime: value[i].endTime,
      schoolLevelName : value[i].schoolLevelName,
      additionalInfo : value[i].additionalInfo,
    });
    
  }

  removeRow(i?: any) {
    this.parameterListArray.removeAt(i);
  }


  submitTiming() {
    this.isSubmit = true;
    // let tempDataList: { academicYear: any; classRange: any; startTime: any; endTime: any; boardName: any }[] = [];
    if (this._schoolForm.status == 'VALID') {
      const data = { ...this._schoolForm.value };
      // this._schoolForm.value.schoolTimingDtlVo.forEach((ele: any) => {
      //   tempDataList.push({
      //     academicYear: ele.academicYear,
      //     boardName: ele.boardName,
      //     classRange: (ele.classFrom + '-' + ele.classUpTo),
      //     startTime: ele.startTime,
      //     endTime: ele.endTime
      //   })

      // });
      // data.schoolTimingDtlVo = tempDataList;
      data.id = this._userDetails.schoolId;
      console.log(data);
      // return
      this.openLoader();
      this._authService.request('post', `schooluser/saveSchoolTimingDtl`, data).subscribe(res => {
        this.closeLoader();
        console.log(res);
        if (res.status == 200) {
          // this.openSnackBar(res.message);
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:res.message});
          // this.router.navigate(['/manage-school/timing-list'])
        }


      }, error => { this.closeLoader() })
    }


  }
  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true })
    this._authService._adminHeader.next({ show: true })
    this._authService._adminFooter.next({ show: true })
  }
  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
