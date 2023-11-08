import { BreadcrumbService } from './../_services/breadcrumb.service';
import { Location } from '@angular/common';
import { HelperService } from './../_services/helper.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { HeaderComponent } from '../components/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MainheaderComponent } from '../layout/main-layout/mainheader/mainheader.component';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeoService } from '../seoservice.service';
import { ReplaceSpacePipe } from '../-shared/pipe/replace-space.pipe';
import { SortByPipe } from '../-shared/pipe/sort-by.pipe';
import { LoaderService } from '../_services/loader.service';
@Component({
  selector: 'app-common-search',
  templateUrl: './common-search.component.html',
  styleUrls: ['./common-search.component.css'],
})
export class CommonSearchComponent implements OnInit {
  zones= ["ZONE-2 A","ZONE-2 B","ZONE-2 C"];
  attachedFile: any;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: true,
  };

  postFilterData: any = {
    searchTerm: '',
    fields: [
      'school_name',
      'school_name.metaphone',
      'school_name.soundex',
      'school_address',
      'school_address.metaphone',
      'school_address.soundex',
      'city',
      'city.metaphone',
      'city.soundex',
    ],
    board: [],
    medium: [],
    schoolType: [],
    state: [],
    city: [],
    page: 1,
    size: 0,
    sort: '',
  };
  public _schoolName: any;
  private _schoolsDetails: any;
  _schoolsList: any;
  tempClass: string;

  _boardName: any;
  _mediumName: any;

  _isAddmission: any;

  _selectedBoardArr: any = [];
  _selectedMediumArr: any = [];

  _dataPerPage: any = 3;
  _selectedOrder: any = 'ASC';

  currentPage = 1;
  itemsPerPage = 10;
  _schoolsListSize: number = 0;
  currentPageStartingIndex: any = 0;
  currentPageEndingIndex: any = 0;
  isEmpty = false;

  _searchBody: any;
  _sortColumn: string = '';
  _sortOrder: string = '';
  _boardList: string[];
  _mediumList: string[];
  _schoolTypeList: string[];
  _schoolLevelList: string[];
  _stateList: string[];
  _districtList: string[];
  _cityList: string[];
  _similarResultsList: any = null;
  _location: string;
  _cityName: string;
  _shouldSliderBeVisible: boolean = false;
  locationSliderOptions: Options = {
    floor: 5,
    step: 5,
    ceil: 100,
  };

  minValue: number = 0;
  maxValue: number = 0;
  feesSliderOptions: Options = {
    
    floor: this.minValue,
    ceil: this.maxValue,
    step: 1000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min price:</b> ' + value;
        case LabelType.High:
          return '<b>Max price:</b> ' + value;
        default:
          return '' + value;
      }
    },
  };
  showMore: any = true;
  showMoreBoards: any = true;
  showMoreMediums: boolean = true;
  showMoreTypes: boolean = true;
  showMoreStates: boolean = true;
  showMoreCities: boolean = true;
  _relatedResults: any;
  _minFees: any;
  _maxFees: any;
  countFeesRangeCheck: number = 0;
  userDetails: any;
  school_type: any;
  screenHeight: any;
  screenWidth: number;
  _showFilter=true;
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
 
  constructor(
    private _authService: AuthService,
    private _headerComponent: MainheaderComponent,
    private activatedRoute: ActivatedRoute,
    public helperService: HelperService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private seoService:SeoService,
    private replacepipe:ReplaceSpacePipe,
    private sort:SortByPipe,
    private _loader: LoaderService
  ) {
    this.getScreenSize();
  }

  existingFavUsers: any = [];
  str:any;
  ngOnInit(): void {
    this._minFees = [];
    this._maxFees = [];
    console.log('max_fees: ', this._maxFees.length);

    this.userDetails = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails'))
      : '';
    console.log(this.userDetails);
    
    this._headerComponent.callNgOnIt();
    // this._schoolName = this.activatedRoute.snapshot.paramMap.get('schoolName') || '';
    this._schoolName =decodeURIComponent(window.location.href.split('search/')[1]);
    this._schoolName = decodeURIComponent(this._schoolName.split('&')[0]);
    this._boardName = decodeURIComponent(window.location.href.split('&')[1]);
    this._mediumName = decodeURIComponent(window.location.href.split('&')[2]);
    this._location =decodeURIComponent(window.location.href.split('&')[3]);
    this._cityName = decodeURIComponent(window.location.href.split('&')[4]);
    this.school_type = decodeURIComponent(window.location.href.split('&')[5]);
    this.school_type=this.replacepipe.transform(this.school_type);
    // this._isAddmission = (window.location.href.split('&')[3])

    // if(this._isAddmission == 'true'){
    //   this.getAdmissionDetails();
    // }else{
    console.log('Previous url: ', this.breadcrumbService.getPreviousUrl());

    if (this._location !== '') this._shouldSliderBeVisible = true;

    console.log(this._boardName);

    this._searchBody = {
      searchTerm: '',
      fields: [
        'school_name',
        'school_name.metaphone',
        'school_name.soundex',
        'school_address',
        'school_address.metaphone',
        'school_address.soundex',
        'city',
        'city.metaphone',
        'city.soundex',
        'postal_code'
      ],
      location: {
        lat: null,
        lon: null,
      },
      distance: '10',
      fees: {
        maxFees: null,
        minFees: null,
      },
      boardName: '',
      mediumName: '',
      size: this.itemsPerPage,
      page: this.currentPage,
      sortColumn: '',
      sortOrder: '',
      schoolType:this.school_type
    };
    this.postFilterData['searchTerm'] = this._schoolName.toLowerCase();
    this.fetchSearchResult();
    // }
    // this.getBoards();
    // this.getMedium();
    // // this.getSchoolLevel();
    // this.getSchoolType();
    // this.getStateList();

    this._boardList = [];
    this._mediumList = [];
    this._stateList = [];
    this._schoolTypeList = [];
    this._cityList = [];


     this.str = '3,4,8,22,45,60';
     this.fetchDataAndSetImage();
    // console.log(str.split(',').includes('2'));    
  
  }

  hideShowCall() {
    // this._authService.loader.next({ load: false})
    this._authService._adminSideNavBar.next({ show: false });
    this._authService._adminHeader.next({ show: false });
    this._authService._adminFooter.next({ show: false });
  }

  // getAdmissionDetails() {
  //   this._schoolsList = []
  //   this._authService.getAuthRequest('schooluser/getAdmissionOpenSchool').subscribe(res => {
  //     if (res.status == 200) {
  //       this._schoolsList = res.result;
  //       console.log('AdmissionGoingOnList :',this._schoolsList);
  //     }

  //   }, error => {

  //   })
  // }

  fetchSearchResult() {
    this._schoolsList = [];
    this._searchBody['searchTerm'] = this._schoolName
      .replaceAll('%20', ' ')
      .toLowerCase();
    this._searchBody['boardName'] = this._boardName.toLowerCase();
    this._searchBody['mediumName'] = this._mediumName.toLowerCase();
    this._searchBody['size'] = this.itemsPerPage;
    this._searchBody['page'] = this.currentPage;
    this._searchBody['sortColumn'] = this._sortColumn;
    this._searchBody['sortOrder'] = this._sortOrder;
    this._searchBody.location['lat'] = this._location.split(',')[0];
    this._searchBody.location['lon'] = this._location.split(',')[1];
    console.log('city name: ', this._cityName);

    this.findPaginatedAndSortedData(this._searchBody, 'searchByKeyword');
  }

  getRelatedSearchResults(_searchBody: any, endpoint: string) {
    this.openLoader();
    this._authService.loader.next({ load: true });
    const url = 'advanced-search/' + endpoint;
    this._authService.request('post', url, _searchBody).subscribe(
      (response) => {
        this.closeLoader();
        console.log('Related Results :', response);
        if (response.status === 200) {
          this._relatedResults = response.result;
          this.closeLoader();
        }
      },
      (error) => {
        this.closeLoader();
      }
    );
  }

  initiateSearch(keyword: string) {
    this._schoolName = keyword;
    this.fetchSearchResult();
  }
  findPaginatedAndSortedData(_searchBody: any, endpoint: string) {
    this.openLoader();
    this._authService.loader.next({ load: true });
    const url = 'advanced-search/' + endpoint;
    this._authService.request('post', url, _searchBody).subscribe(
      (response) => {
        this.closeLoader();
        console.log('Search :', response);
        if (response.status === 200) {
          this._schoolsList = response.result;
          this._similarResultsList = response.result3;

          console.log('this._schoolsList -->> ', this._schoolsList);
          this._schoolsListSize = response.noOfData;
          this.getRelatedSearchResults(this._searchBody, 'getRelatedResults');
          this.populateFilterDropdowns(response.result2);

          if (this.itemsPerPage >= this._schoolsListSize) {
            this.itemsPerPage = this._schoolsListSize;
          } else {
            this.itemsPerPage = +this._searchBody.size;
          }
          console.log('items per page: ', this.itemsPerPage);

          this.currentPageStartingIndex =
            (this.currentPage - 1) * this.itemsPerPage + 1;
          this.currentPageEndingIndex =
            this.currentPageStartingIndex + this.itemsPerPage - 1;
          if (this.currentPageEndingIndex > this._schoolsListSize) {
            this.currentPageEndingIndex = this._schoolsListSize;
          }

          this.closeLoader();
        }
      },
      (error) => {
        this.closeLoader();
      }
    );
  }
  populateFilterDropdowns(result2: any) {
    if (result2 === null) return;

    this._boardList = result2.board;
    this._mediumList = result2.medium;
    this._schoolTypeList = result2.schoolType;
    this._cityList =  result2?.city.map((el:any) => el.trim());
    this._cityList=this._cityList?.sort();
    this._stateList = result2.state;

    // adding the already selected board and medium values to the search body
    if (this._mediumName !== null && this._mediumName !== '')
      this.postFilterData['medium'].push(this._mediumName);
    if (this._boardName !== null && this._boardName !== '')
      this.postFilterData['board'].push(this._boardName);
    // this._cityList.push('static city 1', 'static city 2', 'static city 3');
    // this._mediumList.push('static medium 1', 'static medium 2');

    this._minFees = result2.minFees;
    this._maxFees = result2.maxFees;

    this.minValue = this._minFees[0]; 
    this.maxValue = this._maxFees[this._maxFees.length - 1];

    if(this.countFeesRangeCheck === 0){
      this.callOnceFeesrange();
      this.countFeesRangeCheck++;
    }

    console.log("this._minFees --> ", this._minFees, "this._maxFees --> ",this._maxFees);
    
  }

  callOnceFeesrange(){
    this.feesSliderOptions = {
      floor: this.minValue,
      ceil: this.maxValue,

    }
  }

  handlePageChange(event: any) {
    this._searchBody['page'] = +event;
    this.currentPage = +event;
    this.fetchSearchResult();
  }
  viewListOrGrid(data: any) {
    // console.log("data--> ", data);
    if (data === 'List') {
      this.tempClass = 'packbox';
    } else {
      this.tempClass = 'packbox grid-width';
    }
  }

  getBoards() {
    this._boardList = [];
    this._authService.getAuthRequest('commonMaster/getBoardInSearch').subscribe(
      (res) => {
        if (res.status == 200) {
          this._boardList = res.result;
        }
      },
      (error) => {}
    );
  }
  getMedium() {
    this._mediumList = [];
    this._authService
      .getAuthRequest('commonMaster/getMediumInSearch')
      .subscribe(
        (res) => {
          if (res.status == 200) {
            this._mediumList = res.result;
          }
        },
        (error) => {}
      );
  }

  getSchoolLevel() {
    this._authService
      .getAuthRequest('commonMaster/getSchoolLevelsInSearch')
      .subscribe(
        (res) => {},
        (error) => {}
      );
  }
  getSchoolType() {
    this._authService
      .getAuthRequest('commonMaster/getSchoolTypesInSearch')
      .subscribe(
        (res) => {
          if (res.status == 200) {
            this._schoolTypeList = res.result;
          }
        },
        (error) => {}
      );
  }
  getStateList() {
    this._authService
      .getAuthRequest('commonMaster/getStateListInSearch')
      .subscribe(
        (res) => {
          if (res.status == 200) {
            console.log('states: ', res);

            this._stateList = res.result;
          }
        },
        (error) => {}
      );
  }
  showText(key: string) {
    switch (key) {
      case 'board':
        this.showMoreBoards = !this.showMoreBoards;
        break;

      case 'medium':
        this.showMoreMediums = !this.showMoreMediums;
        break;
      case 'type':
        this.showMoreTypes = !this.showMoreTypes;
        break;
      case 'state':
        this.showMoreStates = !this.showMoreStates;
        break;
      case 'city':
        this.showMoreCities = !this.showMoreCities;
        break;
      default:
        return;
    }
  }
  changeSize(value?: any) {
    this.itemsPerPage = value;
    this.currentPage = 1;
    this.fetchSearchResult();
  }
  changeOrder(value?: any) {
    this.currentPage = 1;
    this._sortOrder = value;
    this._sortColumn = 'school_name';
    console.log('Sort order: ', this._sortOrder);

    this.fetchSearchResult();
  }

  applyLocationSliderChange(event: any) {
    this._searchBody['distance'] = event.value;
    this.itemsPerPage = 10;

    this.fetchSearchResult();
  }
  applyFeesSliderChange(event: any) {
    console.log('Fees event: ', event);

    this._searchBody.fees['minFees'] = event.value;
    this._searchBody.fees['maxFees'] = event.highValue;
    this.itemsPerPage = 10;

    this.fetchSearchResult();
  }

  selectFilterCheck(event?: any, data?: any, type?: any) {
    console.log('filter data  ', data);

    if (event.target.checked) {
      if (type == 'board') {
        this.postFilterData['board'].push(data);
      } else if (type == 'medium') {
        this.postFilterData['medium'].push(data);
      } else if (type == 'school_Type') {
        this.postFilterData['schoolType'].push(data);
      } else if (type == 'state') {
        this.postFilterData['state'].push(data);
        this.getDistrictList(this.postFilterData['state']);
      } else if (type == 'district') {
        this.postFilterData['district'].push(data);
      } else if (type == 'city') {
        this.postFilterData['city'].push(data);
      } else if (type == 'state') this.postFilterData['state'].push(data);
      this.findPaginatedAndSortedData(this.postFilterData, 'filter');
    } else {
      if (type == 'board') {
        this.postFilterData['board'].splice(
          this.postFilterData['board'].indexOf(data),
          1
        );
      } else if (type == 'medium') {
        this.postFilterData['medium'].splice(
          this.postFilterData['medium'].indexOf(data),
          1
        );
      } else if (type == 'school_Type') {
        this.postFilterData['schoolType'].splice(
          this.postFilterData['schoolType'].indexOf(data),
          1
        );
      } else if (type == 'state') {
        this.postFilterData['state'].splice(
          this.postFilterData['state'].indexOf(data),
          1
        );
        this.getDistrictList(this.postFilterData['state']);
      } else if (type == 'district') {
        this.postFilterData['district'].splice(
          this.postFilterData['district'].indexOf(data),
          1
        );
      }
      this.findPaginatedAndSortedData(this.postFilterData, 'filter');
      window.location.reload();
    }

    console.log(this.postFilterData);

    // console.log(JSON.stringify(this.postFilterData));
  }

  getDistrictList(value?: any) {
    this.postFilterData['district'] = [];
    const data = { state: value };
    this._authService
      .request('post', 'commonMaster/getDistrictListByStateMulti', data)
      .subscribe((res) => {
        if (res.status == 200) {
          this._districtList = res.result;
          console.log(this._districtList);
        }
      });
  }

  customSearch() {
    this.postFilterData['size'] = this._dataPerPage;
    this.postFilterData['sort'] = this._selectedOrder;
    console.log(this.postFilterData);
    this.openLoader();
    this._authService
      .request(
        'post',
        'schooluser/getSchoolByCustomSearch',
        this.postFilterData
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.closeLoader();
          if (res.status == 200) {
            this._schoolsList = res.result;

            this._schoolsListSize = res.result.length;

            if (this.itemsPerPage >= this._schoolsListSize) {
              this.itemsPerPage = this._schoolsListSize;
            } else {
              this.itemsPerPage = +this._dataPerPage.size;
            }

            this.currentPageStartingIndex =
              (this.currentPage - 1) * this.itemsPerPage + 1;
            this.currentPageEndingIndex =
              this.currentPageStartingIndex + this.itemsPerPage - 1;
            if (this.currentPageEndingIndex > this._schoolsListSize) {
              this.currentPageEndingIndex = this._schoolsListSize;
            }
          }
        },
        (err) => {
          this.closeLoader();
        }
      );
  }

  makeWishlist(schoolId: any, favUsers:any, mode:any) {
    if (localStorage.hasOwnProperty('token')){
      console.log(favUsers);
      let favUserSet:any[] = [];
      if(favUsers != null){
        favUserSet = favUsers.split(',').map((X: string | number) => +X);
      }
      console.log(favUserSet);
      
      if(mode == 0){
        favUserSet.push(this.userDetails.userId)
      }else{
        let index = favUsers != null ? favUserSet.findIndex((d: any) => d === this.userDetails.id) : null; //find index in your array
        index !=null ? favUserSet.splice(index, 1) : [];
      }
      const data = {
        id: schoolId,
        favUsersSet: favUserSet,
        schoolUserId: this.userDetails.userId
      }
      console.log(data);
      // return
      this.openLoader();
      this._authService
      .request('post', 'schooluser/saveFavorite',data)
      .subscribe(
        (res) => {
          if(res.status === 200 && mode === 0){
            this.closeLoader();
            // this.openSnackBar(`Favourite school added.`);
            this.ngOnInit();
          }else if(res.status === 200 && mode === 1){
            this.closeLoader();
            this.ngOnInit();
          }
        },(err)=>{
          console.log(err);
        })

    } 
    else {
      this.router.navigate(['auth/login/2']);
    }
    console.log(localStorage);
  }
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
  // handlePageChange(event: any) {
  //   this.currentPage = event;
  //   this.fetchSearchResult();
  // }

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
      panelClass: ['success-snackbar']
    });
  }

  errorSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['danger-snackbar']
    });
  }

  @HostListener('window:resize', ['$event'])
    getScreenSize() {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;
          console.log(this.screenHeight, this.screenWidth);

         if ((this.screenWidth >= 200 && this.screenWidth <=912)) {
            this._showFilter=false;
         }else{
          this._showFilter=true;
         }
    }

    fetchDataAndSetImage() {
      this._authService.loader.next({ load: true });
      this._authService.request('post', 'adsvertisement/fetchattachmentbyzone', this.zones).subscribe(
        (response: any) => {
          this.attachedFile= response.result;
        },
        (error) => {
          console.log(error);
        }
      );
    }
}
