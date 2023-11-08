import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from '../_services/loader.service';

@Component({
  selector: 'app-duplicate-check',
  templateUrl: './duplicate-check.component.html',
  styleUrls: ['./duplicate-check.component.css']
})
export class DuplicateCheckComponent implements OnInit {

  fileName : any = '';
  fileInvalidMsg : any = ''
  constructor(private _authService : AuthService,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  bulkDuplicateCheck(event:any, element:any) {
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
      this.loader.openLoader();
      this._authService.fileDownloadRequest1(`/schoolMstBulkController/checkduplicateSchool`, formData)
        .subscribe((res) => {
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'School_list';
          link.click();
          console.log(res);
          this.loader.closeLoader();
        }, (err) => {
          this.messageService.clear();
            this.messageService.add({severity:'error', summary:'', detail:err.error.message});
          this.loader.closeLoader();
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

}
