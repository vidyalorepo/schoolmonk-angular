import { BreadcrumbService } from './../../_services/breadcrumb.service';
import { HelperService } from './../../_services/helper.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MainheaderComponent } from 'src/app/layout/main-layout/mainheader/mainheader.component';
import { filter } from 'rxjs/operators';
import { SeoService } from 'src/app/seoservice.service';
import { HtmlToPlaintextPipe } from 'src/app/-shared/pipe/html-to-plaintext.pipe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/_services/loader.service';
import { MessageService } from 'primeng-lts/api';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-search-school-details',
  templateUrl: './search-school-details.component.html',
  styleUrls: ['./search-school-details.component.css'],
  providers: [DatePipe,MessageService]
})
export class SearchSchoolDetailsComponent implements OnInit {
  zones= ["ZONE-3 A"];
  attachedFile: any;
  _schoolID: any;
  _schoolsDetails: any;
  userDetails: any;
  addmissionForData: any;
  errMsg = false;
  _selectedBoard: any;
  _classList: any;
  _academicYr: any;
  streamList: any;
  _selectedStream: any;
  _boardName: any;
  _mediumName: any;
  _prevUrl: string = '';

  textErrMsg: string = '';
  usrDtl: any;
  urlIcon = 'assets/images';
  _applicantsList: any[];
  _dateOfBirthApplicant: any;
  _eligibleCheck: boolean;
  dobReadOnly: boolean = false;
  studentId = 0;
  _showBreadcrumbLink: boolean = true;
  addReviewsForm:FormGroup;
  submitted: boolean;
  reviewList:any = [];
// For REVIEW
  addReviwModel=false;
  itemsPerPage=5;
  currentPage=1;
  _reviewListSize=0;
  currentPageStartingIndex:any;
  currentPageEndingIndex:any;
  isEmpty:any;
  data = {
    page: this.currentPage,
    size: this.itemsPerPage,
  };
  currentURL: string;
  bannerOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    autoplay: true,
    autoWidth: true,
    autoHeight: true,
    autoplaySpeed: 200,
    navSpeed: 600,
    navText: ['', ''],
 
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
    nav: false
  };
// END OF REVIEW
  constructor(
    private formBuilder: FormBuilder,
    private _authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private mainheaderComponent: MainheaderComponent,
    public helperService: HelperService,
    private breadcrumbService: BreadcrumbService,
    private _seoService:SeoService,
    private _htmlToTextPipe:HtmlToPlaintextPipe,
    private _loader:LoaderService,
    private messageService: MessageService
  ) {
    this.inintAddForm();
  }

  ngOnInit(): void {
    this.buildBredcrumb();
    this._schoolID = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.generateAcademicYear();
    this.fetchSchoolDetails(this._schoolID);
    this.usrDtl = JSON.parse(
      localStorage.getItem('userDetails') != ''
        ? localStorage.getItem('userDetails')
        : ''
    );
    console.log(this.usrDtl);
    if (this.usrDtl != null) {
      this.getApplicantsName(this.usrDtl.userId);
    }
    this.currentURL = window.location.href; 
    this.fetchDataAndSetImage();
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
      localStorage.getItem('search-details-prev-url') === null
    ) {
      this._prevUrl = this.breadcrumbService.getPreviousUrl();
      localStorage.setItem('search-details-prev-url', this._prevUrl);
    }

    // for preventing clearing of prev url, while refreshing
    if (this.isPageRefreshed())
      this._prevUrl = localStorage.getItem('search-details-prev-url');
    console.log('Previous url: ', this._prevUrl);

    if (!this._prevUrl.startsWith('/auth/common-search'))
      this._showBreadcrumbLink = false;
  }

  generateAcademicYear() {
    var currentYear = this.datePipe.transform(new Date(), 'yyyy');
    var currentMnt = new Date().getMonth() + 1;
    this._academicYr =
      currentMnt > 3
        ? currentYear + '-' + (+currentYear + 1)
        : +currentYear - 1 + '-' + currentYear;
    console.log(this._academicYr);
  }

  fetchSchoolDetails(_schoolSlug: any) {
    if (this.usrDtl !== null) {
      // this.callRefresh();
    }
    this.openLoader();
    this._schoolsDetails = [];
    this._boardName = [];
    this._mediumName = [];
    this._authService
      // schooluser/schoolBySearch/
      // .getAuthRequest('schooluser/schoolBySearch/' + _schoolID)
      .getAuthRequest('schooluser/findBySlug/' + _schoolSlug)
      // findBySlug
      .subscribe((response) => {
        this.closeLoader();
        if (response) {
          console.log(response);

          this._schoolsDetails = response.result;
          this._boardName =
            this._schoolsDetails.schoolBoard != null &&
            this._schoolsDetails.schoolBoard != ''
              ? this._schoolsDetails.schoolBoard.split(',')
              : [];
          // this._schoolsDetails.schoolBoardClassDtlVo.forEach((element: any) => {
          //   if (this._mediumName.indexOf(element.medium) === -1) {
          //     this._mediumName.push(element.medium)
          //   }
          // });
          this._seoService.updateTitle(this._schoolsDetails?.schoolName);
          this._seoService.updateMetaKeyword(`${this._schoolsDetails?.schoolName},${this._schoolsDetails?.schoolMedium} Medium School ,${this._schoolsDetails?.schoolBoard} Board,`,`${this._schoolsDetails?.schoolName} is one of the most popular school of West Bengal which is located at ${this._schoolsDetails?.schoolAddress},${this._schoolsDetails?.city} ${this._schoolsDetails.postalCode} Get online application & registration, fees structure, reviews, rating, contact numbers and admission form details.`);
          this._classList = [];
          this._schoolsDetails.schoolAdmissionDtlVo.forEach((element: any) => {
            if (element.publishStatus == 'Y') {
              this._classList.push(element.classRange);
            }
          });
          console.log('_schoolsDetails-> ', this._schoolsDetails);
          this.fetchReviewListBySchoolId(this._schoolsDetails.id);
        }
      }, error => { this.closeLoader() });
  }

  selectBoard(value: any) {
    this._eligibleCheck = false;
    this._selectedBoard = value;
    console.log(this._selectedBoard);

    // this._classList = [];
    // if (this._selectedBoard) {
    //   const data = {
    //     schoolMstVo: { id: this._schoolsDetails['id'] },
    //     boardName: this._selectedBoard,
    //   };
    //   this.openLoader();
    //   this._authService
    //     .openRequest('post', `schooluser/getClassListOfSchool`, data)
    //     .subscribe(
    //       (res) => {
    //         console.log(res);
    //         this.closeLoader();
    //         if (res.status == 200) {
    //           this._classList = res.result;
    //         }
    //       },
    //       (error) => {
    //         this.closeLoader();
    //       }
    //     );
    // }
  }

  getApplicantsName(userId: any) {
    this._applicantsList = [];
    if (userId) {
      this._authService
        .request(
          'get',
          `studentcontroller/getStudentApplicant?studentUserId=${userId}`
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.closeLoader();
            if (res.status == 200) {
              this._applicantsList = res.result;
            }
          },
          (error) => {
            this.closeLoader();
          }
        );
    }
  }
  selectApplicant(applicantId: any) {
    // console.log(applicantId);
    this._eligibleCheck = false;
    this.studentId = 0;
    if (applicantId != 0) {
      this.studentId = applicantId.split(' ')[0];
      this._dateOfBirthApplicant = applicantId.split(' ')[1];
      console.log(this._dateOfBirthApplicant);
      this.dobReadOnly = true;
    } else {
      this._dateOfBirthApplicant = 'Select DOB';
      this.dobReadOnly = false;
    }
  }
  checkEligibility() {
    const data = {
      schoolMstVo: { id: this._schoolsDetails['id'] },
      academicYear: this._academicYr,
      board: this._selectedBoard,
      classRange: this.addmissionForData,
      // admissionForStream: this._selectedStream,
      applicantDOB: this._dateOfBirthApplicant,
    };
    console.log(data);

    if (
      data.board &&
      data.classRange &&
      data.applicantDOB &&
      data.applicantDOB !== 'Select DOB'
    ) {
      this.openLoader();
      this._authService
        .request('post', `studentcontroller/checkForApply`, data)
        .subscribe(
          (res) => {
            console.log(res);
            this.closeLoader();
            if (res.status == 200) {
              // this._applicantsList = res.result;
              this._eligibleCheck = true;
              this.openSnackBar('You are eligible for this class.');
            }
          },
          (error) => {
            this.closeLoader();
            if (error.status === 406) {
              this._eligibleCheck = false;
              this.openSnackBar('You are not eligible for this class.');
            }
          }
        );
    } else {
      this.openSnackBar('Please select all the required fields.');
    }
  }

  selectClass(data: any) {
    this._eligibleCheck = false;
    this.addmissionForData = data;
    this.streamList = [];
    this._selectedStream = '';
    if (this.addmissionForData) {
      this.errMsg = false;
      this._classList.forEach((element: any) => {
        if (element.classDisplay == data) {
          this.streamList = element.classStream;
        }
      });
    }
  }

  selectStream(data: any) {
    this._eligibleCheck = false;
    this._selectedStream = '';
    this.errMsg = false;
    if (data) {
      this._selectedStream = data;
    }
  }

  applySchoolRedirect() {
    this.userDetails = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails') || '')
      : '';
    if (this.userDetails === '' || this.userDetails === undefined) {
      this.router.navigate(['/auth/login', 1]);
    } else {
      if (this.addmissionForData) {
        // if (this.addmissionForData == 'XI' || this.addmissionForData == 'XII') {
        //   if (this._selectedStream) {
        //     this.finalSaveApply()
        //   } else {
        //     this.errMsg = true;
        //     this.textErrMsg = 'Please select Stream'
        //   }
        // } else {
        // }

        this.finalSaveApply();
      } else {
        this.errMsg = true;
        this.textErrMsg = 'Please select admission for class first';
      }
    }
  }

  finalSaveApply2() {
    this.router.navigate([
      '/auth/search-details/apply-school/' +
        12 +
        '/' +
        '' +
        '/' +
        '' +
        '/' +
        '',
    ]);
  }
  finalSaveApply() {
    this.errMsg = false;
    var _tempStream = this._selectedStream ? ' - ' + this._selectedStream : '';

    const data = {
      schoolMstVo: { id: this._schoolsDetails['id'] },
      studentMstVo: { id: +this.studentId },
      admissionForClass: this.addmissionForData,
      admissionForBoard: this._selectedBoard,
      academicYear: this._academicYr,
      admissionForStream: this._selectedStream,
      studentDOB: this._dateOfBirthApplicant,
    };

    console.log(data);
    this.openLoader();
    this._authService
      .request('post', `studentcontroller/applyInitiate`, data)
      .subscribe(
        (res) => {
          console.log('applyInitiate :', res);
          this.closeLoader(); //&& res.code === 'success'
          if (res.status == 200 && res.code === 'success') {
            // res.result.admissionFees
            this.router.navigate([
              '/auth/search-details/apply-school/' +
                this._schoolsDetails.id +
                '/' +
                res.result.admissionEndDate +
                '/' +
                (this.addmissionForData + _tempStream) +
                '/' +
                this.studentId +
                '/' +
                this._dateOfBirthApplicant +
                '/' +
                this._selectedBoard +
                '/' +
                this._academicYr,
            ]);
          } else if (res.status == 200 && res.code === 'already_applied') {
            this.openSnackBar(`${res.message}`);
          }
        },
        (error) => {
          console.log(error);
          // if(error.status === 406){
          //   this.openSnackBar(`${error.error.message}`)
          // }
          if (error.status === 406) {
            // this.openSnackBar(`${error.error.message}`)
            this.errMsg = true;
            this.textErrMsg = `${error.error.message}`;
          }
          this.closeLoader();
        }
      );
  }
  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['danger-snackbar'],
    });
  }
  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }

  ngOnDestroy() {
    localStorage.removeItem('search-details-prev-url');
  }
  inintAddForm() {
    this.addReviewsForm = this.formBuilder.group({
      reviewerName: ['', Validators.required],
      reviewDetails: ['', [Validators.required]],
      schoolId: [{id:this._schoolsDetails?.id}],
      isApproved: [false],
      rating: [null,[Validators.required]]
    });
  }
  addReviews(){
    console.log(this.addReviewsForm.value);
    const payload = this.addReviewsForm.value;
    // payload.id=this._schoolsDetails.id;
    payload.schoolId = {id:this._schoolsDetails.id};
    console.log(payload);
    if (this.addReviewsForm.valid) {
      // this.addReviewsForm.openLoader();
      this._authService
        .request('post', 'reviewcontroller/addreview' , payload)
        .subscribe(
          (res) => {
            this.addReviewsForm.reset();
            // this.addReviewsForm.closeLoader();
            
            this.messageService.clear();
            this.messageService.add({severity:'success', summary: '', detail: 'Your review has been added.'});
            this.fetchReviewListBySchoolId(this._schoolsDetails.id);
            this.addReviwModel=false;
          },          (error) => {
            console.error();
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: '',
              detail: 'Review save has been failed.',
            })
            this._loader.closeLoader();
          }
        ); 
        this.submitted= true;
        
    }
  } 

  fetchReviewListBySchoolId(schoolId:any) {
  const  data = {
      page: this.currentPage,
      size: this.itemsPerPage,
      schoolid:schoolId
    };
    this._authService.openRequest('post', 'reviewcontroller/getallreview',data)
        .subscribe(
          (res) => {
            this.reviewList = res.result;
            this._reviewListSize=res.noOfData;
            if (this.itemsPerPage >= this.reviewList) {
              this.itemsPerPage = this.reviewList;
            } else {
              this.itemsPerPage = +this.data.size;
            }
      
            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._reviewListSize) {
              this.currentPageEndingIndex = this._reviewListSize;
            }
            
          },
          (error) => {
            console.error();
          }
        );
    }

    handlePageChange(event: any) {
      let data = this.data;
      data.page = +event;
      console.log(event);
      console.log(data);
      this._loader.openLoader();
      this._authService.loader.next({ load: true });
      this._authService
        .openRequest('post', 'reviewcontroller/getallreview', data)
        .subscribe(
          (response) => {
            if (response.status === 200) {
              this.reviewList = response.result;
              this._reviewListSize = response.noOfData;
  
              if (this.itemsPerPage >= this._reviewListSize) {
                this.itemsPerPage = this._reviewListSize;
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
  
              if (this.currentPageEndingIndex > this._reviewListSize) {
                this.currentPageEndingIndex = this._reviewListSize;
              }
              this._loader.closeLoader();
            }
          },
          (error) => {
            this._loader.closeLoader();
            console.error();
          }
        );
    }

  Share(appName:String){
       switch (appName) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer.php?u=${this.currentURL}`,'_blank')
          break;
        case 'whatsapp':
          window.open(`https://wa.me?text=Schools in West Bengal along with address and details of school. Vidyalo gives you the information on top English Medium Schools in Kolkata, Govt English Medium School etc. ${this.currentURL}`,'_blank')
          break;
        case 'twitter':
           window.open(`https://twitter.com/intent/tweet?url=${this.currentURL}&text=Schools in West Bengal along with address and details of school. Vidyalo gives you the information on top English Medium Schools in Kolkata, Govt English Medium School, Private English Medium School etc&hashtags=vidyalo,best_school_in_west_bengal`)
          break;  
        default:
          break;
     }
  }

  fetchDataAndSetImage() {
    this._loader.openLoader();
    this._authService.loader.next({ load: true });
    this._authService.request('post', 'adsvertisement/fetchattachmentbyzone', this.zones).subscribe(
      (response: any) => {
        this._loader.closeLoader();
        this.attachedFile= response.result;
      },
      (error) => {
        this._loader.closeLoader();
      }
    );
  }


}
