import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { emailValidator } from 'src/app/_validators/Generic.validator';
import {
  FormBuilder,
  ValidatorFn,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng-lts/api';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css'],
  providers: [MessageService]
})
export class MainFooterComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtnFeedBack') closeBtnFeedBack: ElementRef;
  // @ViewChild('closeBtn1') closeBtn1: ElementRef;
  // @ViewChild('closeBtn2') closeBtn2: ElementRef;

  _helpDeskForm: FormGroup;
  _addSchoolForm: FormGroup;
  _feedBackForm: FormGroup;
  userDetails: any;
  userType: any;
  _isReadOnly: boolean = false;
  _successResponse: any;
  _issuePhotoUrl = [{ fileId: 0, filePath: '' }];
  _selectedFiles: FileList | [];
  _successMessage: string;
  maximumIncidentDescription: number = 500;
  _isTheFormValid: boolean;
  _docType: string = 'issue_photo';
  _formData: FormData;
  _successMessageScl: string;
  closeModal: string = null;
  isSubmit: boolean = false;
  ismodelShow = 'none';
  @ViewChild('inputFile') myInputVariable: ElementRef;
  isAgreeChecked: any = false;
  isHuman: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initHelpDeskForm();
    this.initaddSchoolForm();
    this.initFeedBackForm();
    this.userDetails = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails'))
      : '';
      console.log(this.userDetails );
      
    this.userType = this.userDetails?.userType;
    this.patchHelpDeskForm();
    this.patchFeedBackForm();
  }

  initHelpDeskForm() {
    this._helpDeskForm = this.formBuilder.group({
      issuerName: ['', Validators.compose([Validators.required])],
      // issuerLastName: ['', Validators.compose([Validators.required])],
      issuerEmail: [
        '',
        Validators.compose([Validators.required,emailValidator]),
      ],
      issueDesc: ['', Validators.compose([Validators.required])],
      issueSubject:['',Validators.compose([Validators.required])],
      isAgree:['',Validators.required]
    });
  }

  initaddSchoolForm() {
    this._addSchoolForm = this.formBuilder.group({
      schoolUserName: ['', Validators.compose([Validators.required])],
      designation: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      email: [
        '',
        Validators.compose([Validators.required, emailValidator]),
      ],
      schoolName: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
    });
  }

  initFeedBackForm() {
    this._feedBackForm = this.formBuilder.group({
      userName: ['', Validators.compose([Validators.required])],
      userEmail: ['', Validators.compose([Validators.required,emailValidator]),],
      userPhone: ['', Validators.compose([Validators.required])],
      userFeedback: ['', Validators.compose([Validators.required])],
      isAgree:['',Validators.required]
    });
  }

  

  patchHelpDeskForm() {
    if (this.userType?.toLowerCase() === 'student_user') {
      this._isReadOnly = true;
      this._helpDeskForm.patchValue({
        issuerFirstName: this.userDetails.firstName,
        // issuerLastName: this.userDetails.lastName,
        issuerEmail: this.userDetails.email,
      });
    }
  }

  patchFeedBackForm() {
    if (this.userType?.toLowerCase() === 'student_user') {
      this._isReadOnly = true;
      this._feedBackForm.patchValue({
        userName: this.userDetails.firstName + ' ' + this.userDetails.lastName,
        userEmail: this.userDetails.email,
        userPhone: this.userDetails.phone,
      });
    }
  }

  changeUploadEvent(event: Event) {
    console.log('Upload Event: ', event);

    let targetElement = event.target as HTMLInputElement;
    this._selectedFiles = targetElement.files;

    this._formData = new FormData();
    for (let i = 0; i < this._selectedFiles.length; i++) {
      this._formData.append('files', this._selectedFiles[i]);
    }
  }
  uploadMultipleFiles(formData: FormData, txId: number) {
    this.openLoader();
    this.authService
      .fileRequest(
        'post',
        `helpdesk/uploadFiles?formCode=helpdesk_media&txId=${txId}&docType=${this._docType}`,
        formData
      )
      .subscribe((res) => {
        console.log(res);
        res.forEach((element: any) => {
          this._issuePhotoUrl.push(element);
        });
        console.log('Response: ', this._issuePhotoUrl);
      });
  }

  submitData() {
    if (!this._helpDeskForm.valid) return;

    const data = this._helpDeskForm.value;
    console.log('submitData', data);
    this.openLoader();
    this.authService
      .request('post', 'helpdesk/raiseTicket', data)
      .subscribe((response: any) => {
        this._helpDeskForm.reset();
        if (response.status === 201) {
          this.resetselectedfile();
          console.log('Submit Response: ', response);
          this._successResponse = response.result;
          // this.openSnackBar(`Ticket has been raised! Your Ticket Id:  ${this._successResponse.ticketId}`)
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:`Ticket has been raised! Your Ticket Id:  ${this._successResponse.ticketId}`});
          this.closeLoader();
          // this.ismodelShow = 'none';
          // this.closeModalHelpDesk();
          // const isSomethingUploaded =
          //   this._selectedFiles.length !=undefined || this._selectedFiles.length != 0 ? true : false;
          if (this._selectedFiles != undefined) {
            console.log('Started Upload Process');
            const txId = this._successResponse.issueId;
            this.uploadMultipleFiles(this._formData, txId);
            this.closeLoader();
          }
          
        }
      },(err) =>{
        this.closeLoader();
        // this.errorSnackBar("Ticket Raised Failed.")
        this.messageService.clear();
        this.messageService.add({severity:'error', summary:'', detail:'Ticket raised has been failed.'});
        console.log(err);
        
      });
  }
  resetselectedfile() {
    this.myInputVariable.nativeElement.value = '';
}
  closeModalHelpDesk() {
    this.closeBtn.nativeElement.click();
  }

  submitAddSchoolData() {
    if (!this._addSchoolForm.valid) return;
    this.openLoader();
    const data = this._addSchoolForm.value;
    console.log('submitData', data);
    // return
    this.authService
      .request('post', 'commonMaster/saveSchoolDtl', data)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.closeLoader();
          console.log('Submit Response: ', response);
          this._successResponse = response.result;
          this._successMessageScl = `Yohoo!!...Your request has sent to the Admin.`
          this._addSchoolForm.reset();
        }
      },(err) =>{
        this.closeLoader();
        this.errorSnackBar("School Add Failed.")
        console.log(err);
        
      });
      
  }
  closeSchoolModal(){
    this._successMessageScl = ``
    this._addSchoolForm.reset();
  }

  submitFeedBackData() {
    if (!this._feedBackForm.valid) return;
    this.openLoader();
    const data = this._feedBackForm.value;
    console.log('submitData', data);
    this.authService
      .request('post', 'commonMaster/saveFeedback', data)
      .subscribe((response: any) => {
        if (response.status === 200) {
        this._feedBackForm.reset();
          console.log('Submit Response: ', response);
          // this.openSnackBar(`Your Feedback submitted Sucessfully.`)
          this.closeLoader();
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:'Your Feedback submitted Sucessfully.'});
          // this.ismodelShow = 'none';
          // this.closeModalFeedBack();
          
        }
      },(err) =>{
        this.closeLoader();
        this.messageService.add({severity:'error', summary:'', detail:'Your Feedback submitted failed.'});
        console.log(err);
      });
      
  }
  isAgree(event:any){
     this.isAgreeChecked=event.target.checked;
    console.log(event.target.checked);
  }

  closeModalFeedBack() {
    this.messageService.clear();
    this.closeBtnFeedBack.nativeElement.click();
    // this._helpDeskForm.reset();

  }


  redirectToHome() {
    this.router.navigate(['auth/home']);
  }
  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
  }
  errorSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['danger-snackbar']
    })
  }
  showResponse(event:any){
    console.log(event);
    this.isHuman=true;
 }
  openLoader() {
    this.authService.loader.next({ load: true });
  }

  closeLoader() {
    this.authService.loader.next({ load: false });
  }
}
