import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-testimonials-edit',
  templateUrl: './testimonials-edit.component.html',
  styleUrls: ['./testimonials-edit.component.css'],
})
export class TestimonialsEditComponent implements OnInit {
  editTestimonialForm: FormGroup;
  private _userDetails: any;
  _testimonialId: string;
  _testimonialDetails: any;
  _prof_pic_url: any = null;
  _selectedFiles: any=[];
  _formData: FormData;
  _uploadedImgUrl: string | ArrayBuffer;
  _docType: string = 'testimonial_photo';
  _issuePhotoUrl: any;
  _successResponse: any;
  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) {}

  _userId: any;
  ngOnInit(): void {
    this.initAddSchoolForm();
    this._testimonialId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.getTestimonialDetails(this._testimonialId);
  }
  ngAfterViewInit() {}
  ngAfterViewChecked() {
    this.changeDedectionRef.detectChanges();
  }

  hideShowCall() {
    // this._authService.loader.next({ load: false})
    this._authService._adminSideNavBar.next({ show: true });
    this._authService._adminHeader.next({ show: true });
    this._authService._adminFooter.next({ show: true });
  }

  initAddSchoolForm = () => {
    this.editTestimonialForm = this.formBuilder.group({
      id:[''],
      name: [''],
      designation: ['', Validators.compose([Validators.required])],
      institution: [''],
      message: ['', Validators.compose([Validators.required])],
    });
  };

  getTestimonialDetails(id: any) {
    this.openLoader();
    this._authService.loader.next({ load: true });
    this._authService
      .request('get', 'testimonials/gettestimonials/' + id)
      .subscribe(
        (response) => {
          this.closeLoader();
          if (response) {
            this._testimonialDetails = response;
            console.log('Testimonial Details: ', this._testimonialDetails);

            this._prof_pic_url =
              response.docList.length !== 0
                ? response.docList[0].filePath
                : null;
            console.log(response);
            this.patchForm(response);
          }
        },
        (error) => {
          this.closeLoader();
        }
      );
  }
  patchForm(details: any) {
    this.editTestimonialForm.patchValue({
      id: details.id,
      name: details.name,
      designation: details.designation,
      institution: details.institution,
      message: details.message,
    });
  }

  submitUserData() {
    if (this.editTestimonialForm.status == 'VALID') {
      const data = this.editTestimonialForm.value;

      console.log('Submit form data -->> ', data);

      // return;
      this.openLoader();
      this._authService.request('post', 'testimonials/add', data).subscribe(
        (res) => {
          console.log(res);
          this.closeLoader();
          if (res.status == 200) {
            this._successResponse = res.result;
            if (this._selectedFiles.length > 0) {
              console.log('Started Upload Process');
              const txId = this._successResponse.id;
              this.uploadSingleFile(this._formData, txId);
            }
            // this.openSnackBar('Testimonial has been successfully Updated');
            this.messageService.clear();
            this.messageService.add({severity:'success', summary:'', detail:"Testimonial has been successfully Updated"});
            this.router.navigate(['/manage-testimonials/testimonials-list']);
          }
        },
        (error) => {
          this.closeLoader();
        }
      );
    }
  }
  publishUserData() {
    if (this.editTestimonialForm.status == 'VALID') {
      const data = {
        ...this.editTestimonialForm.value,
        isActive: 1,
        id: this._testimonialId,
      };

      console.log('Submit form data -->> ', data);

      // return;
      this.openLoader();
      this._authService.request('post', 'testimonials/add', data).subscribe(
        (res) => {
          console.log(res);
          this.closeLoader();
          if (res.status == 200) {
            this.messageService.clear();
            this.messageService.add({severity:'success', summary:'', detail:"Testimonial has been successfully Published."});
            // this.openSnackBar('Testimonial has been successfully Published');
            this.router.navigate(['/manage-testimonials/testimonials-list']);
          }
        },
        (error) => {
          this.closeLoader();
        }
      );
    }
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
      this._prof_pic_url = reader.result;
    };
    this.uploadSingleFile(this._formData, parseInt(this._testimonialId));
  }
  uploadSingleFile(formData: FormData, txId: number) {
    this.openLoader();
    this._authService
      .fileRequest(
        'post',
        `testimonials/upload?formCode=testimonial_media&txId=${txId}&docType=${this._docType}`,
        formData
      )
      .subscribe((res) => {
        console.log(res);

        this._issuePhotoUrl = res[0];

        console.log('Response: ', this._issuePhotoUrl);
        this.closeLoader();
      });
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
  }
  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }
}
