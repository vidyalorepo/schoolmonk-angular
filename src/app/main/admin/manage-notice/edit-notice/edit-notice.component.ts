import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-edit-notice',
  templateUrl: './edit-notice.component.html',
  styleUrls: ['./edit-notice.component.css']
})
export class EditNoticeComponent implements OnInit {
  noticeId: string;
  noticeDetails: any;

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,) { }

    noticeForm = new FormGroup({});
    submitted: boolean = false;
    ngOnInit(): void {
      this.noticeId = this.activatedRoute.snapshot.paramMap.get('token');
      console.log(this.noticeId);
      
      this.inItForm();
      this.getNoticeDetails(this.noticeId);
    }
  getNoticeDetails(noticeId: string) {
    if(noticeId){
      // return
      this.openLoader();
      this._authService
        .request('get', `noticeboard/getNoticeDetailsById?noticeId=${noticeId}`)
        .subscribe(
          (res) => {
            this.closeLoader();
            console.log(res);
            this.closeLoader();
            if (res.status == 200) {
              this.noticeDetails = res.result;
              console.log('this.noticeDetails --> ', this.noticeDetails);
              
              this.patchNoticeDtl(this.noticeDetails);
            }
          },
          (error) => {
            this.closeLoader();
          }
        );
    }
  }
  patchNoticeDtl(noticeDetails: any) {
    // throw new Error('Method not implemented.');
    this.noticeForm.patchValue({
        id: noticeDetails.id,
        noticeContent: noticeDetails?.noticeContent,
        startsOn: noticeDetails?.startsOn?.toString().slice(0, 10),
        expiresOn: noticeDetails?.expiresOn?.toString().slice(0, 10),
        noticeType: noticeDetails?.noticeType,
        schoolId: noticeDetails?.schoolId
    })
  }
  
    inItForm() {
      this.noticeForm = this.formBuilder.group({
        id: [null],
        noticeContent: ['',[Validators.required]],
        startsOn: ['',[Validators.required]],
        expiresOn: [''],
        noticeType: ['',[Validators.required]],
        schoolId: ['']
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
                this.openSnackBar('Notice updated successfully.')
                this.router.navigate(['manage-notice']);
              }
            },
            (error) => {
              this.closeLoader();
            }
          );
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
