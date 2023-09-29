import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-testimonials-add',
  templateUrl: './testimonials-add.component.html',
  styleUrls: ['./testimonials-add.component.css'],
})
export class TestimonialsAddComponent implements OnInit {
  _testimonialAddForm: any;
  _docType: string = 'testimonial_photo';
  _successResponse: any;
  _successMessage: string;
  _selectedFiles: any = [];
  _formData: FormData;
  _issuePhotoUrl: any;
  isSomethingUploaded: boolean = false;
  _uploadedImgUrl: string | ArrayBuffer = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initTestimonialAddForm();
  }
  ngAfterViewInit() { }
  ngAfterViewChecked() {
    this.changeDedectionRef.detectChanges();
  }
  initTestimonialAddForm() {
    this._testimonialAddForm = this.formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      institution: ['',],
      message: ['', Validators.required],
    });
  }

  submitData() {
    if (!this._testimonialAddForm.valid) return;

    const data = this._testimonialAddForm.value;
    console.log('submitData', data);
    this.openLoader();
    this.authService
      .request('post', 'testimonials/add', data)
      .subscribe((response: any) => {
        if (response.status === 200) {
          console.log('Submit Response: ', response);
          this._successResponse = response.result;
          // this._successMessage = 'Testimonial has been added!';

          const isSomethingUploaded =
            this._selectedFiles.length != 0 ? true : false;
          if (this._selectedFiles.length > 0) {
            console.log('Started Upload Process');
            const txId = this._successResponse.id;
            this.uploadSingleFile(this._formData, txId);
          }
          this.closeLoader();
          // this.openSnackBar('Testimonial has been added');
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:"Testimonial has been added."});
          this.router.navigate(['/manage-testimonials/testimonials-list']);
        }
      });
  }
  changeUploadEvent(event: any) {
    console.log('Upload Event: ', event);

    let targetElement = event.target as HTMLInputElement;
    this._selectedFiles = targetElement.files;

    this._formData = new FormData();
    for (let i = 0; i < this._selectedFiles.length; i++) {
      this._formData.append('files', this._selectedFiles[i]);
    }

    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this._uploadedImgUrl = reader.result;
    };
  }
  uploadSingleFile(formData: FormData, txId: number) {
    this.openLoader();
    this.authService
      .fileRequest(
        'post',
        `testimonials/upload?formCode=testimonial_media&txId=${txId}&docType=${this._docType}`,
        formData
      )
      .subscribe((res) => {
        console.log(res);

        this._issuePhotoUrl = res[0];

        console.log('Response: ', this._issuePhotoUrl);
      });
  }

  openLoader() {
    this.authService.loader.next({ load: true });
  }

  closeLoader() {
    this.authService.loader.next({ load: false });
  }
  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
  }

  hideShowCall() {
    // this._authService.loader.next({ load: false})
    this.authService._adminSideNavBar.next({ show: true });
    this.authService._adminHeader.next({ show: true });
    this.authService._adminFooter.next({ show: true });
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
