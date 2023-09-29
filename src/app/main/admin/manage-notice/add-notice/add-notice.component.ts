import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { minYearValidator } from 'src/app/_validators/Generic.validator';

@Component({
  selector: 'app-add-notice',
  templateUrl: './add-notice.component.html',
  styleUrls: ['./add-notice.component.css']
})
export class AddNoticeComponent implements OnInit {
  //add for subsription
  _Subsription:any;
  _userDetails: any;
  message: string;
  imagePath: any;
  url: string | ArrayBuffer;
  _user_id:number|string;
  _result:any;

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) { }

  noticeForm = new FormGroup({});
  submitted: boolean = false;
  ngOnInit(): void {
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    this._user_id=this._userDetails.userId;
    console.log("user id",this._user_id);
    this._authService.request('post',`users/subscription/?User_id=${this._user_id}`).subscribe((res)=>{

        this._result=res.result;
        this._result=this._result.subcriptionMstVo.id;
        console.log(this._result);
        this._Subsription=this._result;
    })
    this.inItForm();
  }

  inItForm() {
    this.noticeForm = this.formBuilder.group({
      id: [null],
      noticeContent: ['',[Validators.required]],
      startsOn: ['',[Validators.required,minYearValidator(1900)]],
      expiresOn: ['',minYearValidator(1900)],
      noticeType: ['',[Validators.required]],
      schoolId: [this._userDetails.schoolId]
    })
  }

  saveNotice(){
    if(this.noticeForm.invalid){
      return
    }
    this.submitted = true;
    // return
    const data = this.noticeForm.value;
    console.log(data);
    if(data){
      this._authService
        .request('post', 'noticeboard/saveNotice', data)
        .subscribe(
          (res) => {
            console.log(res);
            this.closeLoader();
            if (res.status == 200) {
              this.openSnackBar('Notice added successfully.')
              this.router.navigate(['manage-notice']);
            }
          },
          (error) => {
            this.closeLoader();
          }
        );
    }
  }

  onFileChanged(event:any) {
    const files = event.target.files;
    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
        this.url = reader.result; 
    }
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

}
