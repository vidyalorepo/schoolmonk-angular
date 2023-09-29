import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-school-profile',
  templateUrl: './school-profile.component.html',
  styleUrls: ['./school-profile.component.css']
})
export class SchoolProfileComponent implements OnInit {
  userDetails: any;
  profileData: any;
  addSchoolForm = new FormGroup ({})
  public submitted: boolean = false;
  public isEditBtn: boolean = false;
  constructor(
    private _authService : AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.hideShowCall();

    this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    console.log('userDetails =', this.userDetails );
    this.initAddSchoolForm()
    if(this.userDetails.userType === 'SCHOOL_USER'){
      this.fetchprofileInfo(this.userDetails.userId)
    }
    
  }

  hideShowCall(){
    // this._authService.loader.next({ load: false})
    this._authService._adminSideNavBar.next({show: true})
    this._authService._adminHeader.next({show: true})
    this._authService._adminFooter.next({show: true})
  }

  initAddSchoolForm = () => {
    this.addSchoolForm = this.formBuilder.group({
      schoolName:['', Validators.compose([Validators.required])],
      schoolId:['', Validators.compose([Validators.required])],
      schoolAddress:['', Validators.compose([Validators.required])],
      phoneCountryCode:['', Validators.compose([Validators.required])],
      contactPhone:['',[Validators.required,Validators.minLength(10), Validators.maxLength(10)]],
      contactEmail:['', Validators.compose([Validators.required, Validators.email])],
      contactPersonFirstName:['', Validators.compose([Validators.required])],
      contactPersonLastName:['', Validators.compose([Validators.required])],
      uploadDoc:[''],
      landMark:[''],
      addressLineTwo:[''],
      city:[''],
      state:[''],
      district:[''],
      postalCode:[''],
      schoolMedia:[''],
      board:[''],
      medium:[''],
      accreditationBy:[''],
      schoolClass:[''],
      messageFromPrincipal:[''],
      aboutSchool:[''],
      facilities:[''],
      notices:[''],
      rule:[''],
      id:['']
    
    });
  }
  fetchprofileInfo(userId: any){
    this.openLoader();
    this._authService.request('get', `schooluser/getschoolbyuser/${userId}`).subscribe((res) => {
      this.closeLoader()
      if(res){
        this.profileData = res;
      console.log("this.profileData ==>> ", this.profileData);
      this.patchForm(this.profileData)
      }
      
    },
    (error) => {
      console.error();
      this.closeLoader()
    })

  }
  patchForm(details:any){
    this.addSchoolForm.patchValue({
      schoolName:details.schoolName,
      schoolId:details.schoolId,
      schoolAddress:details.schoolAddress,
      phoneCountryCode:details.phoneCountryCode,
      contactPhone:details.contactPhone,
      contactEmail:details.contactEmail,
      contactPersonFirstName:details.contactUser['firstName'],
      contactPersonLastName:details.contactUser['lastName'],
      uploadDoc:details.uploadDoc,
      landMark:details.landMark,
      addressLineTwo:details.addressLineTwo,
      city:details.city,
      state:details.state,
      district:details.district,
      postalCode:details.postalCode,
      schoolMedia:details.schoolMedia,
      board:details.board,
      medium:details.medium,
      accreditationBy:details.accreditationBy,
      schoolClass:details.schoolClass,
      messageFromPrincipal:details.messageFromPrincipal,
      aboutSchool:details.aboutSchool,
      facilities:details.facilities,
      notices:details.notices,
      rule:details.rule,
      id:details.id
    })

    console.log(this.addSchoolForm.value);
    
  }

  submitUpdateSchoolRecord(){
    console.log("Submit Call");
    console.log(this.addSchoolForm.status);
    // console.log(this.addSchoolForm.value);
    this.submitted = true;
    if(this.addSchoolForm.status == 'VALID'){
      const data = this.addSchoolForm.value;
    
    data.contactUser={"userId":this.profileData.contactUser.userId}
    console.log("Submit form data -->> ", data);
    this.openLoader()
    // ?schoolUserId=${this._schoolID}
    this._authService.request('post', `schooluser/schoolUpdate`,data)
    .subscribe(res=>{
      console.log(res);
      this.closeLoader()
      if(res.status == 200){
        this.openSnackBar('Updated Successfully')
        this.fetchprofileInfo(this.userDetails.userId);
        this.editButton()

      }
      
    },error=>{
      this.closeLoader()
    })
    }
    
    
    
  }
  editButton(){
    this.isEditBtn = !this.isEditBtn
  }
  openSnackBar(message:any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
  openLoader(){this._authService.loader.next({ load: true,})}

  closeLoader(){this._authService.loader.next({ load: false})}
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
