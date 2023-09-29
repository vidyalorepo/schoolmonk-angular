import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  HtmlEditorService,
  ImageService,
  LinkService,
  TableService,
  ToolbarService,
} from '@syncfusion/ej2-angular-richtexteditor';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { ADD_NEWS_ENDPOINT } from 'src/app/-shared/const';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';

@Component({
  selector: 'app-newsarticles-add',
  templateUrl: './newsarticles-add.component.html',
  styleUrls: ['./newsarticles-add.component.css'],
  providers: [
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    TableService,
    MessageService,
    ConfirmationService,
  ],
})
export class NewsarticlesAddComponent implements OnInit {
  addNewsForm: FormGroup;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _loader: LoaderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _authService: AuthService
  ) {
    this.inintAddForm();
  }
  public tools: object = {
    items: [
      'Undo',
      'Redo',
      '|',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      'Bold',
      'Italic',
      'Underline',
      '|',
      'OrderedList',
      'UnorderedList',
      'Outdent',
      'Indent',
      '|',
      'CreateTable',
      'image',
      'CreateLink',
    ],
  };

  public quickTools: object = {
    image: [
      'Replace',
      'Align',
      'Caption',
      'Remove',
      'InsertLink',
      '-',
      'Display',
      'AltText',
      'Dimension',
    ],
  };
  ngOnInit(): void {}

  inintAddForm() {
    this.addNewsForm = this.formBuilder.group({
      subject: ['', Validators.required],
      noticeBody: ['', [Validators.required]],
      status: [true, Validators.required],
      newsDate: ['', Validators.required],
    });
  }

  addNews() {
    console.log(this.addNewsForm.value);
    const payload = this.addNewsForm.value;
    payload.newsDate = this.addNewsForm.value.newsDate.toISOString();
    if (this.addNewsForm.valid) {
      this._loader.openLoader();
      this._authService
        .request('post', ADD_NEWS_ENDPOINT, this.addNewsForm.value)
        .subscribe(
          (res) => {
            this.addNewsForm.reset();
            this._loader.closeLoader();
            this.messageService.clear();
            this.messageService.add({
              severity: 'success',
              summary: '',
              detail: 'News artical has been saved.',
            });
            setTimeout(() => 
            {
              this.router.navigate(['/news-artical/news-artical-list']);
            },
            2000);
          },
          (error) => {
            console.error();
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: '',
              detail: 'News artical save has been failed.',
            });
            this._loader.closeLoader();
          }
        );
    }
  }
}
