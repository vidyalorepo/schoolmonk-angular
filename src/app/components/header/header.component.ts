import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

// @Injectable({
//   providedIn: 'root'
// })
export class HeaderComponent {

  // isLoader : boolean = true;
  // isSchoolSearch  : boolean = true;
  // userDetails: any;
  // tempFirstNmae: any;
  // _schoolName = '';
  
  constructor(
    // private router: Router,
    // private _authService: AuthService,
    // private activatedRoute: ActivatedRoute,
  ) { }

  // displayStudentProfile = false;
  // displayLogInStatus = true;
  // logInStatus:any;

  ngOnInit(): void {
    
    // this._authService.loader.subscribe((response) => {
    //   this.isLoader = response.load;
    // });
    // this._authService.searchSchool.subscribe((response) => {
    //   this.isSchoolSearch = response.search;
    // });
    
    // this.logInStatus = JSON.parse(localStorage.getItem('logInStatus') || '');
    
    // this._authService._userName.subscribe((res) => {
    //   this.tempFirstNmae = res.name;
      
    // });

    // if(this.logInStatus === true)
    // {
    //   this.displayLogInStatus = false;
    // }else{
    //   this.displayLogInStatus = true;
    // }
    
    // this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '');

    // if(this.userDetails.userType == 'STUDENT_USER'){
    //   this.displayStudentProfile = true;
    // }else{
    //   this.displayStudentProfile = false;
    // }
    
  }

  
  
  // logout(){
  //   localStorage.clear();
  //   this.displayLogInStatus = true;
  //   this.logInStatus = false;
  //   this.router.navigate(['/home']).then(() => {
  //     window.location.reload()
  // });
  // }

  // searchSchool(data:any){
  //   console.log("SchoolName-->> ", data);
  //   if(data){
     
  //     let currentUrl = `/common-search/${data}`;
  //     this.router.navigateByUrl(`/`, {skipLocationChange: true}).then(() => {
  //       this.router.navigate([currentUrl]);
  //   });
  //   console.log("currentUrl-->> ",currentUrl);
    
  //   }
  // }

  // callNgOnIt(){
  //   if(window.location.href.includes('/common-search/')){
  //     this._schoolName = window.location.href.split("search/")[1];
  //     console.log("under if");
      
  //   }else{
  //     this._schoolName = '';
  //   }
  //   console.log("this._schoolName--> ", window.location.href.split("search/")[1]);
  // }


}
