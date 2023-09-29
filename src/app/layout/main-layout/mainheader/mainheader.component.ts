import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-mainheader',
  templateUrl: './mainheader.component.html',
  styleUrls: ['./mainheader.component.css'],
})
@Injectable({
  providedIn: 'root',
})
export class MainheaderComponent implements OnInit, OnDestroy {
  isLoader: boolean = true;
  isSchoolSearch: boolean = true;
  userDetails: any;
  tempFirstNmae: any;
  _schoolName = '';
  mySubscription: Subscription;
  _mediumList: any[];
  _boardList: any[];
  _displaySearchBar: boolean = true;
  _schoolList: any;

  _searchForm: FormGroup;

  _areWeOnHome: boolean;
  _cityList: any;
  _latitude: any;
  _longitude: any;
  _location: string = '';
  _selectedCityName: any = '';
  _headerScrool:boolean;
  constructor(
    private router: Router,
    private _authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private snackbar:MatSnackBar,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    // Added By Kousik...
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }
  ngOnDestroy(): void {
    // this.notifierSubscription.unsubscribe();
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
    this._headerScrool=false;
  }

  displayStudentProfile = false;
  displayLogInStatus = true;
  logInStatus: any;
  _searchBody = {
    searchTerm: '',
    fields: [
      'school_name',
      'school_name._2gram',
      'school_name._3gram',
      'school_name._4gram',
    ],
    boardName: '',
    mediumName: '',
    size: '',
    page: '',
    sortOrder: '',
    sortColumn: '',
  };
  _citySearchBody = {
    searchTerm: '',
    fields: ['city', 'city._2gram', 'city._3gram', 'city._4gram'],
    boardName: '',
    mediumName: '',
    size: '',
    page: '',
    sortOrder: '',
    sortColumn: '',
  };

  ngOnInit(): void {
    if (this.router.url === '/auth/home') this._displaySearchBar = true;
    if (this.router.url === '/auth/login/0') this._displaySearchBar = false;
    if(this.router.url === '/auth/home') this._headerScrool=true;
    this._location = window.location.href.split('&')[3];
    this._authService.loader.subscribe((response) => {
      this.isLoader = response.load;
    });
    this._authService.searchSchool.subscribe((response) => {
      this.isSchoolSearch = response.search;
    });

    this.logInStatus = localStorage.getItem('logInStatus')
      ? JSON.parse(localStorage.getItem('logInStatus'))
      : '';

    this._authService._userName.subscribe((res) => {
      this.tempFirstNmae = res.name;
    });

    if (this.logInStatus === true) {
      this.displayLogInStatus = false;
    } else {
      this.displayLogInStatus = true;
    }

    this.userDetails = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails'))
      : '';
    if (this.userDetails.userType == 'STUDENT_USER') {
      this.displayStudentProfile = true;
    } else {
      this.displayStudentProfile = false;
    }
    this.getBoards();
    this.getMedium();

    this._searchForm = this.fb.group({
      searchText: [''],
      board: [''],
      medium: [''],
      location: [''],
    });

    this.patchSearchForm();
  }
  checkAreWeOnSearch() {
    let currentPage = this.router.url;
    let keyword = currentPage.split('auth/')[1].toLowerCase().split('/')[0];
    if (keyword === 'common-search') return true;
    else false;
  }
  getMedium() {
    this._mediumList = [];
    this._authService
      .getAuthRequest('commonMaster/getMediumInSearch')
      .subscribe(
        (res) => {
          if (res.status == 200) {
            this._mediumList = res.result;
            console.log(this._mediumList);
          }
        },
        (_error) => {}
      );
  }
  getBoards() {
    this._boardList = [];
    this._authService.getAuthRequest('commonMaster/getBoardInSearch').subscribe(
      (res) => {
        if (res.status == 200) {
          // this._boardList = res.result;
          res.result.forEach((element: any) => {
            this._boardList.push({
              code: element.id,
              value: element.listValue,
              imgPath: element.imagePath,
            });
          });

          console.log(this._boardList);
        }
      },
      (_error) => {}
    );
  }
  logout() {
    localStorage.clear();
    this.displayLogInStatus = true;
    this.logInStatus = false;
    // this.openSnackBar("Logout Sucessfully.");
    this.router.navigate(['/auth/home']).then(() => {
      window.location.reload();
    });
  }

  getCoordinates(option?: any) {
    this._latitude = option.location.lat;
    this._longitude = option.location.lon;

    this._location =
      this._latitude.toString() + ',' + this._longitude.toString();
  }
  searchSchool(data?: any, data1?: any, data2?: any, data3?: any, data4?: any) {
    // When the search keyword for location field is empty, coordinate data in the url section must be set to empty
    // same goes for the location data being undefined
    if (
      data3 === undefined ||
      data4 === '' ||
      data4 === undefined ||
      data3 === ''
    ) {
      data3 = '';
      data4 = '';
    }

    let currentUrl = `auth/common-search/${data}&${data1}&${data2}&${data3}&${data4}`;
    this.router.navigate([currentUrl]);
  }

  patchSearchForm() {
    if (this.checkAreWeOnSearch()) {
      let currentUrl = this.router.url;
      console.log('current url: ', currentUrl);
      localStorage.setItem('search-info', currentUrl);
      this.patchSearchFormValue();
    } else {
      localStorage.removeItem('search-info');
    }
  }
  patchSearchFormValue() {
    let currentUrl = localStorage.getItem('search-info');
    let searchText = decodeURIComponent(currentUrl.split('search/')[1]);
    searchText = searchText.split('&')[0].replace('%20', ' ');
    let board = currentUrl.split('&')[1];
    let medium = currentUrl.split('&')[2];
    let location = decodeURIComponent(currentUrl.split('&')[4].replace('%20', ' '));

    console.log(searchText);

    this._searchForm.patchValue({
      searchText,
      board,
      medium,
      location,
    });
  }
  autocompleteSearch(event: any) {
    this._searchBody['searchTerm'] = event.target.value;

    this._authService
      .request('post', 'advanced-search/autocomplete', this._searchBody)
      .subscribe((res) => {
        console.log(res);

        this._schoolList = res.result;
      });
  }
  autocompleteSearchCity(event: any) {
    this._citySearchBody['searchTerm'] = event.target.value;

    this._authService
      .request(
        'post',
        'advanced-search/city-autocomplete',
        this._citySearchBody
      )
      .subscribe((res) => {
        console.log(res);
        this._cityList = res.result;
      });
  }

  redirectToSchool(id: any) {
    let url = `auth/search-details/search-school-details/${id}`;
    this.router.navigate([url]);
  }

  callNgOnIt() {
    if (window.location.href.includes('/auth/common-search/')) {
      // console.log(window.location.href.includes('/common-search/'))

      // console.log(window.location.href.split("search/"));

      this._schoolName = window.location.href.split('search/')[1];
      // console.log("under if");
    } else {
      this._schoolName = '';
    }
    // console.log("this._schoolName--> ", window.location.href.split("search/")[1]);
  }
  openSnackBar(message: any) {
    this.snackbar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }
}
