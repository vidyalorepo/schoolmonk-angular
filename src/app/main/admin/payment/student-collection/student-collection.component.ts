import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { HelperService } from 'src/app/_services/helper.service';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-student-collection',
  templateUrl: './student-collection.component.html',
  styleUrls: ['./student-collection.component.css'],
  providers: [DatePipe]
})
export class StudentCollectionComponent implements OnInit {

  
  _schoolsPaymentList: any;
  _classList: any;
  schoolSearchForm = new FormGroup({});
  _academicYr: any;
  _academicYrArr: any = [];

  currentPage = 1;
  itemsPerPage = 25;
  _schoolsListSize: number;
  currentPageStartingIndex: any;
  currentPageEndingIndex: any;
  isEmpty = false;
  _selectedSize:number;

  _schoolID = '';
  _fiscalYear = '';
  _schoolname = ''
  _studentsNameArr = [{studentId: '', studentName: ''}];

  currDate: string | Date;
  endDate: string | Date;

  public chosenDate: any = {
    start: moment().subtract(12, 'month'),
    end: moment().subtract(6, 'month'),
  };

  public picker1 = {
    opens: 'left',
    startDate: moment().subtract(36, 'month'),
    endDate: moment(),
    // singleDatePicker: true,
    // autoUpdateInput: true,
    // showDropdowns: true,
    // autoApply: true,
    // drops: 'down',
    isInvalidDate: function (date: any) {
      if (date.isSame('2017-09-26', 'day'))
        return 'mystyle';
      return false;
    }
  }

  constructor(
    private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public helperService: HelperService,
    private datePipe: DatePipe,
    private daterangepickerOptions: DaterangepickerConfig
  ) {
    this.daterangepickerOptions.settings = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: false,
      "opens": "right",
      showDropdowns: true,
      // showCustomRangeLabel: true,
      ranges: {
        Today: [moment().subtract(0, 'day'), moment()],
        '7 days ago': [moment().subtract(7, 'day'), moment()],
        'Last Month': [moment().subtract(1, 'month'), moment()],
        'Last 3 Months': [moment().subtract(4, 'month'), moment()],
        'Last 6 Months': [moment().subtract(6, 'month'), moment()],
        'Last 12 Months': [moment().subtract(12, 'month'), moment()],
      }
    };
    

     }
     
  
  ngOnInit(): void {
    this._fiscalYear = this.activatedRoute.snapshot.paramMap.get('fiscalYr') || '';
    this._schoolID = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.initSchoolSearchForm();
    // this.generateAcademicYear();
    
    // this.callClassByID(this._schoolID);
    this.getPaymentList(25,1);
    this._schoolname = this.activatedRoute.snapshot.paramMap.get('sch') || '';
    
    setTimeout(()=>{                           // <<<---using ()=> syntax
      this.getFilterDropdownData();
     }, 4000);
    
  }

  

  // public selectedDate(value: any, dateInput: any): void {
  //   console.log(this.datePipe.transform(value.start._d, 'yyyy-MM-dd'));
  //   dateInput.start = value.start;
  //   dateInput.end = value.end;
  //   // patch value
  //   this.currDate = this.datePipe.transform(value.start._d, 'yyyy-MM-dd');
  //   this.endDate = this.datePipe.transform(value.end._d, 'yyyy-MM-dd');
  //   this.schoolSearchForm.patchValue({
  //     paymentStartDate: this.currDate,
  //     paymentEndDate: this.endDate,
  //   });
  //   // this.getDashBoardData();
  // }

  // public calendarEventsHandler(e: any): void {
  //   console.log({ calendarEvents: e });
  // }

  // public applyDatepicker(e: any) {
  //   console.log({ applyDatepicker: e });
  // }

  // public updateSettings(): void {
  //   this.daterangepickerOptions.settings.locale = { format: 'YYYY/MM/DD' };
  //   this.daterangepickerOptions.settings.ranges = {
  //     Today: [moment().subtract(0, 'day'), moment()],
  //     '7 days ago': [moment().subtract(7, 'day'), moment()],
  //     '15 days ago': [moment().subtract(15, 'day'), moment()],
  //     '1 months ago': [moment().subtract(1, 'month'), moment()],
  //   };
  // }

  public selectedDate(value: any, dateInput: any): void {
    console.log(value);
    dateInput.start = value.start;
    dateInput.end = value.end;
    this.currDate = this.datePipe.transform(value.start._d, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(value.end._d, 'yyyy-MM-dd');
    this.schoolSearchForm.patchValue({
      paymentStartDate: this.currDate,
      paymentEndDate: this.endDate,
    });
  }
  

  public calendarEventsHandler(e: any): void {
    console.log({ calendarEvents: e });
  }

  public applyDatepicker(e: any) {
    console.log({ applyDatepicker: e });
  }

  public updateSettings(): void {
    this.daterangepickerOptions.settings.locale = { format: 'YYYY/MM/DD' };
    this.daterangepickerOptions.settings.ranges = {
      Today: [moment().subtract(0, 'day'), moment()],
      '7 days ago': [moment().subtract(7, 'day'), moment()],
      'Last Month': [moment().subtract(1, 'month'), moment()],
      'Last 3 Months': [moment().subtract(4, 'month'), moment()],
      'Last 6 Months': [moment().subtract(6, 'month'), moment()],
      'Last 12 Months': [moment().subtract(12, 'month'), moment()],
    };
  }

  getFilterDropdownData(){
    this._studentsNameArr = [];
    this._classList = [];
    // this._academicYrArr = [];
    this._schoolsPaymentList.forEach((element: any) => {
      this._studentsNameArr.push(
        {
          studentId: element.studentId,
          studentName: element.studentName
        }
        );
      this._classList.push(element.admissionForClass);
      // this._academicYrArr.push(element.academicYear)
    });
    console.log(this._studentsNameArr);
    console.log(this._classList);
    
    
  }

  initSchoolSearchForm = () => {
    this.schoolSearchForm = this.formBuilder.group({
      studentId: [''],
      schoolId: [this._schoolID],
      admissionForClass: [''],
      payment: [''],
      academicYear: [''],
      page: [0],
      size: [],
      orderByColName: [''],
      orderBy: [''],

      fiscalYear: [this._fiscalYear],
      paymentStartDate: [moment().subtract(36, 'month')],
      paymentEndDate: [moment()],
      admissionType: ['Admission']
    });
  };

  generateAcademicYear() {
    var currentYear = this.datePipe.transform(new Date(), 'yyyy');
    var currentMnt = new Date().getMonth() + 1;
    this._academicYr =
      currentMnt > 3
        ? currentYear + '-' + (+currentYear + 1)
        : +currentYear - 1 + '-' + currentYear;

    for (let i = 2; i > 0; i--) {
      let tempStr =
        currentMnt > 3
          ? +currentYear - i + '-' + (+currentYear - (i - 1))
          : +currentYear - i + '-' + currentYear;
      this._academicYrArr.push(tempStr);
    }
    this._academicYrArr.push(this._academicYr);
    console.log(this._academicYrArr);

    // console.log((currentMnt > 3 ? ((+currentYear - 2) + '-' + (+currentYear - 1)) : ((+currentYear - 2) + '-' + (currentYear))));
    // console.log((currentMnt > 3 ? ((+currentYear - 1) + '-' + (+currentYear)) : ((+currentYear - 1) + '-' + (currentYear))));
  }
  callClassByID(id: any) {
    this._authService.loader.next({ load: true });
    this._authService.request('get', `schooluser/getClassList?schoolID=${id}`).subscribe((res) => {
      this._authService.loader.next({ load: false });
      if (res !== null) {
        console.log('School class:', res);
        this._classList = res;
        console.log("this._classList--> ", this._classList);
        
      }

    }, error => { 
      this._authService.loader.next({ load: false })
     })
  }

  handlePageChange(event: any) {
    this.currentPage = event;
    this.getPaymentList(this._selectedSize,this.currentPage)
  }
  getPaymentList2(size?: any,page?:any){
    this._schoolsPaymentList = [];
    console.log(this.schoolSearchForm.value);
    
  }

  getPaymentList(size?: any,page?:any){
    this._schoolsPaymentList = [];
    const data = this.schoolSearchForm.value;
    this.itemsPerPage = +size;
    this._selectedSize = +size;
    data.size = +size;
    data.schoolId = this._schoolID;
    this._authService.loader.next({ load: true });
    this._authService.request('post', 'paymentCollectionController/schoolPaymentDetails', data)
    .subscribe(res=>{
      this._authService.loader.next({ load: false });
      if(res.status == 200){
        this._schoolsPaymentList = res.result;
        console.log(this._schoolsPaymentList);
        this._schoolsListSize = res.noOfData;

            if (this.itemsPerPage >= this._schoolsListSize) {
              this.itemsPerPage = this._schoolsListSize;
            } else {
              this.itemsPerPage = +data.size;
            }

            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._schoolsListSize) {
              this.currentPageEndingIndex = this._schoolsListSize;
            }
        
      }
      
    },(err)=>{
      this._authService.loader.next({ load: false });
    })
  }

  downloadReport(){
    // window.open(`${this._authService.baseUrl}/paymentCollectionController/schoolPaymentDetailsReport?schoolId=${this._schoolID}&schoolName=${this._schoolname}&studentName=${this.schoolSearchForm.value.studentName}&payment=${this.schoolSearchForm.value.payment}&academicYear=${this.schoolSearchForm.value.academicYear}&admissionForClass=${this.schoolSearchForm.value.admissionForClass}&size=${this._selectedSize}&page=${this.currentPage}`, '_blank');
  }

}
