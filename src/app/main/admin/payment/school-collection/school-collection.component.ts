import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { HelperService } from 'src/app/_services/helper.service';

@Component({
  selector: 'app-school-collection',
  templateUrl: './school-collection.component.html',
  styleUrls: ['./school-collection.component.css'],
  providers: [DatePipe]
})
export class SchoolCollectionComponent implements OnInit {

  _schoolsPaymentList: any;
  schoolSearchForm = new FormGroup({});

  currentPage = 1;
  itemsPerPage = 25;
  _schoolsListSize: number;
  currentPageStartingIndex: any;
  currentPageEndingIndex: any;
  isEmpty = false;
  _selectedSize:number;
  _academicYr: any;
  _academicYrArr: any=[];
  currFiscalYear: any;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public helperService: HelperService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.currFiscalYear = this.getCurrentFinancialYear();
    this.initSchoolSearchForm();
    this.getPaymentList(25,1);
    this.getFiscalYearsList();
  }

  getFiscalYearsList(){
    var currentYear = this.datePipe.transform(new Date(), 'yyyy');
    var currentMnt = (new Date().getMonth()) + 1;
    this._academicYr = (currentMnt > 3 ? (currentYear + '-' + (+currentYear + 1)) : ((+currentYear - 1) + '-' + (currentYear)));
    
    for(let i=3; i>0; i--){
      let tempStr = (currentMnt > 3 ? ((+currentYear - i) + '-' + (+currentYear - (i-1))) : ((+currentYear - i) + '-' + (currentYear)));
      this._academicYrArr.push(tempStr);
    }
    this._academicYrArr.push(this._academicYr);
    console.log(this._academicYrArr);
    
    
    // console.log("Fiscal Years current-->> ",);
  }

  getCurrentFinancialYear() {
    let fiscalyear = "";
    let today = new Date();
    if ((today.getMonth() + 1) <= 3) {
      fiscalyear = (today.getFullYear() - 1) + "-" + today.getFullYear()
    } else {
      fiscalyear = today.getFullYear() + "-" + (today.getFullYear() + 1)
    }
    return fiscalyear;
    console.log(fiscalyear);
     
  }

  initSchoolSearchForm = () => {
    this.schoolSearchForm = this.formBuilder.group({
      schoolName: [''],
      schoolPrincipalName: [''],
      contactEmail: [''],
      contactPhone: [''],
      contactPersonFirstName: [''],
      page: [0],
      size: [],
      orderByColName: [''],
      orderBy: [''],
      fiscalYear: [this.currFiscalYear]
    });
  };

  handlePageChange(event: any) {
    this.currentPage = event;
    this.getPaymentList(this._selectedSize,this.currentPage)
  }
  getPaymentList(size?: any,page?:any){
    const data = this.schoolSearchForm.value;
    this.itemsPerPage = +size;
    this._selectedSize = +size;
    data.size = +size;
    this._authService.loader.next({ load: true });
    this._authService.request('post', 'paymentCollectionController/schoolPaymentCollection', data)
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
  
  
}
