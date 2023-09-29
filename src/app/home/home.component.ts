import { HelperService } from './../_services/helper.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

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
  }
Cities=[{id:1,name:"Alipurduar",img:"assets/images/cities1.webp",url:"/auth/common-search/Alipurduar&&&&"},
        {id:2,name:"Asansol",img:"assets/images/cities2.webp",url:"/auth/common-search/Asansol&&&&"},
        {id:4,name:"Bankura",img:"assets/images/cities3.webp",url:"/auth/common-search/Bankura&&&&"},
        {id:5,name:"Balurghat ",img:"assets/images/cities4.webp",url:"/auth/common-search/Balurghat&&&&"},
        {id:6,name:"Berhampore",img:"assets/images/cities5.webp",url:"/auth/common-search/Berhampore&&&&"},
        {id:7,name:"Bardhaman",img:"assets/images/cities6.webp",url:"/auth/common-search/Bardhaman&&&&"},
        {id:8,name:"Barasat",img:"assets/images/cities7.webp",url:"/auth/common-search/Barasat&&&&"},
        {id:9,name:"Chuchura",img:"assets/images/cities8.webp",url:"/auth/common-search/chinsurah&&&&"},
        {id:10,name:"Coochbihar",img:"assets/images/cities9.webp",url:"/auth/common-search/Coochbihar&&&&"},
        {id:11,name:"Darjeeling",img:"assets/images/cities10.webp",url:"/auth/common-search/Darjeeling&&&&"},
        {id:11,name:"Durgapur",img:"assets/images/cities11.webp",url:"/auth/common-search/Durgapur&&&&"},
        {id:12,name:"English Bazar",img:"assets/images/cities12.webp",url:"/auth/common-search/English bazar&&&&"},
        {id:13,name:"Howrah",img:"assets/images/cities13.webp",url:"/auth/common-search/Howrah&&&&"},
        {id:13,name:"Haldia",img:"assets/images/cities14.webp",url:"/auth/common-search/Haldia&&&&"},
        {id:14,name:"Jalpaiguri",img:"assets/images/cities15.webp",url:"/auth/common-search/Jalpaiguri&&&&"},
        {id:15,name:"Jhargram",img:"assets/images/cities16.webp",url:"/auth/common-search/Jhargram&&&&"},
        {id:16,name:"Kolkata",img:"assets/images/cities17.webp",url:"/auth/common-search/Kolkata&&&&"},
        {id:17,name:"Krishna Nagar",img:"assets/images/cities18.webp",url:"/auth/common-search/Krishna Nagar&&&&"},
        {id:18,name:"Kalimpong",img:"assets/images/cities19.webp",url:"/auth/common-search/kalimpong&&&&"},
        {id:19,name:"Medinipore",img:"assets/images/cities20.webp",url:"/auth/common-search/Medinipore&&&&"},
        {id:20,name:"Raiganj",img:"assets/images/cities21.webp",url:"/auth/common-search/Raiganj&&&&"},
        {id:21,name:"Purulia",img:"assets/images/cities22.webp",url:"/auth/common-search/Purulia&&&&"},
        {id:22,name:"Shiuri",img:"assets/images/cities23.webp",url:"/auth/common-search/Shiuri&&&&"},
        {id:23,name:"Siliguri",img:"assets/images/cities24.webp",url:"/auth/common-search/Siliguri&&&&"},
        {id:24,name:"Tamluk",img:"assets/images/cities25.webp",url:"/auth/common-search/Tamluk&&&&"},
        ]
  data = {
    "page": 1,
    "size": 4,
    "status":true
  }
  CitiesOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 100,
    navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 6,
      },
    },
    nav: true,
  };

  BoardsOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
    autoplay: true,
    autoplaySpeed: 4100,
    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 6,
      },
    },
    nav: true,
  };

  SchoolType: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
    autoplay: true,
    autoplaySpeed: 4400,
    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 6,
      },
    },
    nav: true,
  };
  

  TestimonialsOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
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

  

 

  admissionGoingOnList = [{ schoolLogoPath: '', schoolName: '', id: '', schoolNameSlug: '' }];
  // _featuredList=[{schoolName:'',schoolBannerPath:'',schoolBrochurePath:'',city:'',schoolAddress:'',state:'',postalCode:'',board:''}]
  _featuredList: any[] = [];
  userDetails: any;
  _boardList: any;
  _mediumList: any;
  noticeList: any;
  testimonialsList: any[];
  NewsList: any;
  testcityList: any[];
  cityList: any;
  constructor(
    private _authService: AuthService,
    private router: Router,
    public helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.userDetails = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails') || '')
      : '';

    let url = this._authService.canNavigate();
    console.log(url);

    if (url) {
      this.router.navigate([url]);
    }

    // if (this.userDetails.userType != 'STUDENT_USER') {
    //   localStorage.clear()
    // }

    // this.callNoticeList();
    // this.getAdmissionDetails();
    // this.getFeaturedDetails();
    // this.getBoards();
    // this.getMedium();
    this.callTestimonialsList();
    this.getnewsList();
  //  this.callLocationList();
  }

  callCarousel() {}

  getAdmissionDetails() {
    this.admissionGoingOnList = [];
    this._authService
      .getAuthRequest('schooluser/getAdmissionOpenSchool')
      .subscribe(
        (res) => {
          // console.log('AdmissionGoingOnList :', res);
          if (res.status == 200) {
            res.result.forEach((element: any) => {
              this.admissionGoingOnList.push(element);
            });
          }
        },
        (error) => {}
      );
  }
  getFeaturedDetails() {
    this._featuredList = [];
    this._authService.getAuthRequest('schooluser/getFeaturedSchool').subscribe(
      (res) => {
        if (res.status == 200) {
          this._featuredList = res.result;
          console.log('Featured School: ', this._featuredList);
        }
      },
      (error) => {}
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
            console.log(this._mediumList);
          }
        },
        (error) => {}
      );
  }

  // callNoticeList() {
  //   this.noticeList = [];
  //   const data = {};
  //   // return
  //   this._authService
  //       .request1('post', 'noticeboard/getPublicNoticeList', data)
  //       .subscribe(
  //         (res) => {
  //           console.log(res);
  //           if (res.status == 200) {
  //             this.noticeList = res.result;
  //             console.log("this.noticeList -->> ", this.noticeList);
              
  //           }
  //         },
  //         (error) => {
  //         }
  //       );
  // }

  callNoticeList() {
    this.noticeList = [];
    const data = {};
    // return
    this._authService
        .request1('get', 'schooluser/getAllPublishedNotice')
        .subscribe(
          (res) => {
            console.log(res);
            if (res.status == 200) {
              this.noticeList = res.result;
              console.log("this.noticeList -->> ", this.noticeList);
              
            }
          },
          (error) => {
          }
        );
  }

  // GetTestimonials List
  callTestimonialsList() {
    this.testimonialsList = [];
    // return
    this._authService
        .request1('get', 'testimonials/getAllTestimonials')
        .subscribe(
          (res) => {
            console.log(res);
            if (res.status == 200) {
              this.testimonialsList = res.result;
              console.log("this.testimonialsList -->> ", this.testimonialsList);
              
            }
          },
          (error) => {
          }
        );
  }
    callLocationList(){
      this.cityList=[];
      
  this._authService
    .request1('get', 'locationlistcontroller/getalllocationlist')
    .subscribe(
      (res) => {
        console.log(res);
        if (res.status == 200) {
          this.cityList = res.result;
          console.log("this.cityList -->> ", this.cityList);
          
        }
      },
      (error) => {
        console.log(error);
      }
    );
    }






  searchSchool(data?: any, data1?: any, data2?: any, data3?: any) {
    if (data || data1 || data2 || data3) {
      let currentUrl = `/auth/common-search/${data}&${data1}&${data2}&${data3}`;
      this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
      // console.log("currentUrl-->> ", currentUrl);
    }
  }

  schoolBoxClickHandler(sclId: any) {
    this.router.navigate([
      `auth/search-details/search-school-details/${sclId}`,
    ]);
  }

  getnewsList(){
    this._authService.authRequest('post','newsarticlescontroller/getallnewsartical',this.data).subscribe((res)=>{
       this.NewsList= res.result;
    })
  }
}
