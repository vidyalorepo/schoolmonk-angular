import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { json } from 'express';

@Component({
  selector: 'app-manage-student-bulk',
  templateUrl: './manage-student-bulk.component.html',
  styleUrls: ['./manage-student-bulk.component.css']
})
export class ManageStudentBulkComponent implements OnInit {

  file:any;
  _responseMsg:any;
  fileName: any;
  constructor(private snackbar:MatSnackBar, private _authService: AuthService) { }

  ngOnInit(): void {

  }

  selectFile(event:any){

    this.file=event.target.files[0];
     this.fileName=event.target.files[0].name
    console.log(this.file);

  }
  uploadFile(){
    this.openLoader();
    let formdata=new FormData();
    formdata.append('uploadFile',this.file);
    this._authService.fileRequest('post','studentBulkController/uploadStudents',formdata).subscribe((res)=>{
     this.closeLoader();
      console.log(res);
      this.openSnackBar(`${this.fileName} Upload sucessfully!!`);
      window.location.reload();
    },
    (_error) => {
      this.closeLoader();    
      console.log(_error);
      this._responseMsg = _error.error.message;
      this.openSnackBarError(this._responseMsg+"OR Duplicate Entry.");
      }
      
    )
  }

  openSnackBar(message: any) {
    this.snackbar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  openSnackBarError(message: any) {
    this.snackbar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }

}
