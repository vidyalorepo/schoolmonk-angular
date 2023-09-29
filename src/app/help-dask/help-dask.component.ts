import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng-lts/api';
import { emailValidator } from '../_validators/Generic.validator';
import { LoaderService } from '../_services/loader.service';

@Component({
  selector: 'app-help-dask',
  templateUrl: './help-dask.component.html',
  styleUrls: ['./help-dask.component.css'],
  providers:[MessageService]
})
export class HelpDaskComponent implements OnInit {
  @ViewChild('inputFile') myInputVariable: ElementRef;
   _helpDeskForm: FormGroup;
  _issuePhotoUrl = [{ fileId: 0, filePath: '' }];
  _docType: string = 'issue_photo';
  _selectedFiles: FileList | [];
  _formData: FormData;
  _successResponse: any;
  isAgreeChecked: any = false;
  maximumIncidentDescription: number = 500;
  isHuman: boolean = false;
  constructor(  private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private loader:LoaderService) { 
      this.initHelpDeskForm();
    }

  ngOnInit(): void {
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

  uploadMultipleFiles(formData: FormData, txId: number) {
    this.loader.openLoader();
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
  resetselectedfile() {
    this.myInputVariable.nativeElement.value = '';
  }
  submitData() {
    if (!this._helpDeskForm.valid) return;

    const data = this._helpDeskForm.value;
    console.log('submitData', data);
    this.loader.openLoader();
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
          this.messageService.add({severity:'success', summary:'', detail:`Thank you so much for taking the time and reaching out to us.Your Ticket has been raised! Your Ticket Id:  ${this._successResponse.ticketId}`});
          this.loader.closeLoader();
          if (this._selectedFiles != undefined) {
            console.log('Started Upload Process');
            const txId = this._successResponse.issueId;
            this.uploadMultipleFiles(this._formData, txId);
            this.loader.closeLoader();
          }
          
        }
      },(err) =>{
        this.loader.closeLoader();
        // this.errorSnackBar("Ticket Raised Failed.")
        this.messageService.clear();
        this.messageService.add({severity:'error', summary:'', detail:'Ticket raised has been failed.'});
        console.log(err);
        
      });
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
  isAgree(event:any){
    this.isAgreeChecked=event.target.checked;
   console.log(event.target.checked);
 }
 showResponse(event:any){
     this.isHuman=true;
 }
}
