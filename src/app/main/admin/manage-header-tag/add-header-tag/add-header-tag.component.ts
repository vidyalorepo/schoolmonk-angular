import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';

@Component({
  selector: 'app-add-header-tag',
  templateUrl: './add-header-tag.component.html',
  styleUrls: ['./add-header-tag.component.css'],
  providers: [MessageService]
})
export class AddHeaderTagComponent implements OnInit {
  addTagsForm: FormGroup;

  constructor( private _authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private loader:LoaderService,
    private router: Router) { 
      this.initaddTagsForm();
    }

  ngOnInit(): void {
  }

  initaddTagsForm() {
    this.addTagsForm = this.formBuilder.group(
      {
        headerTagBody: ['', Validators.required],
        isPublish: [true, Validators.required]
      }
    )
  }

  addTags() {
    this.loader.openLoader();
    const data = this.addTagsForm.value;
    this._authService.request('post', 'headertagcontroller/addheadertag', data).subscribe( (response) => {
          console.log(response);
          this.addTagsForm.reset();
          this.loader.closeLoader();
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: '',
            detail: 'Tags has been saved.',
          });
          setTimeout(() =>
          {
            this.router.navigate(['/header-tag']);
          },2000);
        },(error) => {
          console.error();
          this.loader.closeLoader();
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: '',
            detail: 'Tags save has been failed.',
          });
      });
    }
}
