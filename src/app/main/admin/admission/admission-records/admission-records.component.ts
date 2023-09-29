import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-admission-records',
  templateUrl: './admission-records.component.html',
  styleUrls: ['./admission-records.component.css'],
  providers: [DatePipe],
})
export class AdmissionRecordsComponent implements OnInit {
  _academicYr: any;
  _academicYrArr: any = [];
  _classList: any = [];
  _selectedBoard: any;
  private _userDetails: any;
  appliedStudentList: any;
  _schoolsDetails: any;
  addmissionForData: any;
  streamList: any[];
  _selectedStream: string;
  checkReadonlyClass = 'lightgear';
  statusArrayList: any[];


  currentPage = 1;
  itemsPerPage = 10;
  _AppliedStudentSize: number;
  isEmpty = false;
  currentPageStartingIndex: any;
  currentPageEndingIndex: any;
  totalnumberofdata:number;


  _academicYr1: any;
  admissionForBoard: any;
  admissionForClass: any;
  admissionForStream: any;

  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.hideShowCall();
    this.generateAcademicYear();
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    console.log(this._userDetails);
    console.log(this._academicYr);
    this.getSchoolById(this._userDetails.schoolId);
    if (this._userDetails.schoolId) {
      this.callAppliedStudentList(this._academicYr, '', '', '');
    }
    this.getClassList(this._userDetails.schoolId);
    this.getStreamList();

    this.callStatusArrayList();

    // this.callTestApi();
  }

  callStatusArrayList(){

    // this.statusArrayList = ['Admission Offered',	'Interview Pending',	'Waitlist', 'Denied']
    // return
    this._authService.request('get', 'schooluser/getAllAdmissionStatus').subscribe(
      (response) => {
        this.closeLoader();
        if (response) {
          this.statusArrayList = response;
          console.log(this.statusArrayList);
        }
      },
      (error) => {
        this.closeLoader();
      }
    );
  }

  getSchoolById(id: any) {
    this._authService.request('get', 'schooluser/school/' + id).subscribe(
      (response) => {
        this.closeLoader();
        if (response) {
          this._schoolsDetails = response;
          console.log(this._schoolsDetails);
        }
      },
      (error) => {
        this.closeLoader();
      }
    );
  }

  getClassList(id: any) {
    this._authService
      .request('get', 'schooluser/getClassList?schoolID=' + id)
      .subscribe((res) => {
        console.log('class List: ', res);
        res.map((item: any) => {
          this._classList.push(item.value);
        });
      });
  }

  getStreamList() {
    // return
    this._authService
      .request('get', 'schooluser/getAllStreamList')
      .subscribe((res) => {
        console.log('Stream List: ', res.result);
        this.streamList = res.result;
      });
  }

  selectBoard(value: any) {
    this._selectedBoard = value;
    this._classList = [];
    if (this._selectedBoard) {
      const data = {
        schoolMstVo: { id: this._userDetails.schoolId },
        boardName: this._selectedBoard,
      };
      this.openLoader();
      this._authService
        .openRequest('post', `schooluser/getClassListOfSchool`, data)
        .subscribe(
          (res) => {
            console.log(res);
            this.closeLoader();
            if (res.status == 200) {
              this._classList = res.result;
            }
          },
          (error) => {
            this.closeLoader();
          }
        );
    } else {
      this.addmissionForData = '';
    }
    this.callAppliedStudentList(this._academicYr, this._selectedBoard, '', '');
  }

  selectClass(data: any) {
    this.streamList = [];
    this._selectedStream = '';
    // return
    if (data === 'XI' || data === 'XII') {
      this.getStreamList();
      // this.callAppliedStudentList(this._academicYr,'',data,'');
    } else {
      this.streamList = [];
      // this.addmissionForData = '';
    }
    console.log('stream list: ', this.streamList);
    this.callAppliedStudentList(
      this._academicYr,
      '',
      data,
      ''
    );
  }
  selectStream(data: any) {
    this._selectedStream = '';
    if (data) {
      this._selectedStream = data;
    }
  }

  // callAppliedStudentList(
  //   _academicYr: any,
  //   admissionForBoard: any,
  //   admissionForClass: any,
  //   admissionForStream: any
  // ) {
    
  // const data = {
  //   admissionForBoard: this.admissionForBoard,
  //   academicYear:this._academicYr,
  //   admissionForClass: admissionForClass,
  //   admissionForStream: admissionForStream,
  //   schoolId: this._userDetails.schoolId,
  //   page:1,
  //   size:2
  // }


  //   this._academicYr1=_academicYr;
  //   this.admissionForBoard=admissionForBoard;
  //   this.admissionForClass=admissionForClass;
  //   this.admissionForStream=admissionForStream;
   
  //   // console.log("getAppliedStudent=>"+data);
  //   this.openLoader();
  //   this._authService
  //     .request('post', `schooluser/getAppliedStudent`, data)
  //     .subscribe(
  //       (res) => {
  //         this.closeLoader();
  //         if (res) {
  //           console.log("getAppliedStudent=>"+res);
  //           this.appliedStudentList = res.result;
  //           this._AppliedStudentSize=res.noOfData;
  //         } 
  //         else {
  //           console.log('No records found!!');
  //         }

  //         if (this.itemsPerPage >= this._AppliedStudentSize) {
  //           this.itemsPerPage = this._AppliedStudentSize;
  //         } else {
  //           this.itemsPerPage = +this.itemsPerPage;
  //         }

  //         this.currentPageStartingIndex =
  //         (this.currentPage - 1) * this.itemsPerPage + 1;
  //       this.currentPageEndingIndex =
  //         this.currentPageStartingIndex + this.itemsPerPage - 1;
  //       if (this.currentPageEndingIndex > this._AppliedStudentSize) {
  //         this.currentPageEndingIndex = this._AppliedStudentSize;
  //       }
  //       // this.closeLoader();
  //     },
        
  //       (error) => {
  //         this.closeLoader();
  //       }
  //     );
  // }



  callAppliedStudentList(_academicYr: any,
    admissionForBoard: any,
    admissionForClass: any,
    admissionForStream: any) {

      const data = {
        admissionForBoard:admissionForBoard,
        academicYear:_academicYr,
        admissionForClass: admissionForClass,
        admissionForStream: admissionForStream,
        schoolId: this._userDetails.schoolId,
        page:1,
        size:10
      }

      
    this._academicYr1=_academicYr;
    this.admissionForBoard=admissionForBoard;
    this.admissionForClass=admissionForClass;
    this.admissionForStream=admissionForStream;
   
    this.openLoader();
   
    this._authService.loader.next({ load: true });
    this._authService
      .request('post', 'schooluser/getAppliedStudent',data)
      .subscribe(
        (response) => {
          console.log("response>",response);

          if (response.status === 200) {
            this.appliedStudentList = response.result;
            

            console.log('this._schoolsList -->> ', this.appliedStudentList);
            this._AppliedStudentSize = response.noOfData;

             console.log("number of data"+this._AppliedStudentSize)
            if (this.itemsPerPage >= this._AppliedStudentSize) {
              this.itemsPerPage = this._AppliedStudentSize;
            } else {
              this.itemsPerPage = +data.size;
            }

            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._AppliedStudentSize) {
              this.currentPageEndingIndex = this._AppliedStudentSize;
            }
            this.closeLoader();
          }
        },
        (error) => {
          console.error();
        }
      );
  }

  handlePageChange(event: any) {
    // let data=this.data;
    // data.page=+event;
    const data = {
      admissionForBoard: this.admissionForBoard,
      academicYear:this._academicYr,
      admissionForClass:this.admissionForClass,
      admissionForStream:this.admissionForStream,
      schoolId: this._userDetails.schoolId,
      page:event,
      size:10
    }
     console.log(event);
    //  console.log(data);
     this.openLoader();
     this._authService.loader.next({ load: true });
     this._authService
       .request('post','schooluser/getAppliedStudent',data)
       .subscribe(
         (response) => {
          this.closeLoader();
           if (response.status === 200) {
             this.appliedStudentList = response.result;
            //  this.appliedStudentList=JSON.parse(this.appliedStudentList);
             console.log(this.appliedStudentList);
             this._AppliedStudentSize = response.noOfData;
             if (this.itemsPerPage >= this._AppliedStudentSize) {
               this.itemsPerPage = this._AppliedStudentSize;
             }
              else {
               this.itemsPerPage = +data.size;
             }
             console.log(this.itemsPerPage);
 
             this.currentPage = event;
             this.currentPageStartingIndex =
               (this.currentPage - 1) * this.itemsPerPage + 1;
             this.currentPageEndingIndex =
               this.currentPageStartingIndex + this.itemsPerPage - 1;
 
             if (this.currentPageEndingIndex > this._AppliedStudentSize) {
               this.currentPageEndingIndex = this._AppliedStudentSize;
             }
             this.closeLoader();
           }
         },
         (error) => {
           this.closeLoader();
           console.error();
         }
       );
   }

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

  arraySend: any = [];
  selectCheck(event: any, data: any) {
    if (event.target.checked) {
      console.log('index Id-->> ', data);
      this.arraySend.push(data);
    } else {
      let index = this.arraySend.findIndex((d: any) => d === data); //find index in your array
      this.arraySend.splice(index, 1);
    }
    if(this.arraySend.length > 0){
      this.checkReadonlyClass = 'deepgear';
    }else{
      this.checkReadonlyClass = 'lightgear';
    }
    console.log('this.arraySend ', this.arraySend);
  }

  isShown: boolean = false; // hidden by default
  toggleShow() {
    this.isShown = !this.isShown;
    console.log(this.isShown);
    
  }
  selectedAll: any;
  selectAll(event:any) {
    this.arraySend = [];
    for (var i = 0; i < this.appliedStudentList.length; i++) {
      if ( event.target.checked ) {
        console.log("index Id-->> ", this.appliedStudentList[i].id);
        this.arraySend.push(this.appliedStudentList[i].id);
        
      }else{
        let index = this.arraySend.findIndex((d: any) => d === this.appliedStudentList[i].id); //find index in your array
        this.arraySend.splice(index, 1);
      }
      this.appliedStudentList[i].selected = this.selectedAll;
    }
    console.log(this.arraySend.length);
    console.log(this.arraySend);
    if(this.arraySend.length > 0){
      this.checkReadonlyClass = 'deepgear';
    }else{
      this.checkReadonlyClass = 'lightgear';
    }
    
  }

  checkIfAllSelected() {
    this.selectedAll = this.appliedStudentList.every(function(item:any) {
        return item.selected == true;
      })
  }




  activeAllselected(statusString:any) {
    console.log(this.arraySend, statusString);
    // let idListString: any = [];
    // for (let i = 0; i < this.arraySend.length; i++) {
    //   idListString[i] = this.arraySend[i].id;
    // }

    const data = {
      ids : this.arraySend,
      admissionStatus : statusString 
    }

    console.log('Status data id--> ', data);
    // return
    this.openLoader();
    this._authService
      .request('post', `studentcontroller/updateStudentStatus`, data)
      .subscribe(
        (response) => {
          this.closeLoader();
          console.log('value', response);
          if (response.status === 200) {
            this.openSnackBar(`${response.message}`);
            this.arraySend = [];
            this.ngOnInit();
          }
        },
        (error) => {
          this.closeLoader();
          console.log(error);
        }
      );
  }

  hideShowCall() {
    // this._authService.loader.next({ load: false})
    this._authService._adminSideNavBar.next({ show: true });
    this._authService._adminHeader.next({ show: true });
    this._authService._adminFooter.next({ show: true });
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

  // callTestApi() {
  //   const data = {
  //     admissionForBoard: "admissionForBoard"
  //   };
  //   this._authService.apiTestCall().subscribe(
  //       (res) => {
  //         if (res) {
  //           console.log(res);
            
  //         } else {
  //           console.log('No records found!!');
  //         }
  //       },
  //       (error) => {
  //         this.closeLoader();
  //       }
  //     );
  // }


}
