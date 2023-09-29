import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {

  fileName : any = '';
  fileInvalidMsg : any = ''
  constructor(private _authService : AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
  }

  bulkUpload(event:any, element:any) {
        this.fileInvalidMsg = "";
        this.fileName = "";
        let files = event.target.files[0];
        console.log(event.target.files[0]);
        if((files.size <= 1048576)){
        if(files.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
          let formData = new FormData();
          formData.append('uploadFile', files, files.name);
          console.log("Type :",files.type);
          this.fileName = files.name;
          this.openLoader();
          this._authService.fileRequest('post', `schoolMstBulkController/uploadSchools`, formData)
            .subscribe((res) => {
              console.log(res);
              if(res.status == 200){
                this.messageService.clear();
                this.messageService.add({severity:'success', summary:'', detail:res.message});
                // this.openSnackBar(res.message);
                element.value = "";
                // this.router.navigate(['/manage-school/school-list'])
              }
              this.closeLoader();
            }, (err) => {
              this.messageService.clear();
                this.messageService.add({severity:'error', summary:'', detail:err.error.message});
              this.closeLoader();
            });
  
        }
        else{
          this.messageService.add({severity:'error', summary:'', detail:"Invalid File Type."});
        }
        }else{
          this.messageService.add({severity:'error', summary:'', detail:"Invalid File Size."});
        }
      
  }

  openSnackBar(message:any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 4000,
      panelClass: ['success-snackbar']
    });
  }
  openLoader(){this._authService.loader.next({ load: true,})}

  closeLoader(){this._authService.loader.next({ load: false})}
}
