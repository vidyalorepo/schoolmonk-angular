import { DatePipe } from '@angular/common';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HtmlEditorService,
  ImageService,
  LinkService,
  TableService,
  ToolbarService,
} from '@syncfusion/ej2-angular-richtexteditor';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { NEWS_FIND_BY_ID_ENDPOINT, UPDATE_NEWS_BY_ID_ENDPOINT } from 'src/app/-shared/const';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';


@Component({
  selector: 'app-newsarticles-edit',
  templateUrl: './newsarticles-edit.component.html',
  styleUrls: ['./newsarticles-edit.component.css'],
  providers: [
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    TableService,
    MessageService,
    ConfirmationService,
    DatePipe
  ],
})
export class NewsarticlesEditComponent implements OnInit {
  editNewsForm: FormGroup;
  newsId: any;
  newsDetails: any;
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
      'CreateLink', 'RemoveLink'
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
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private _loader: LoaderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private _datePipe:DatePipe) { 
      this.initEditForm();
    }
 

  ngOnInit(): void {
    this.newsId = this.route.snapshot.paramMap.get('id');
    this.getNewsById();
    Message: ['', Validators.compose([ Validators.maxLength(1000)])]
  }

  initEditForm(){
    this.editNewsForm=this.formBuilder.group({
      subject:['',Validators.required],
      noticeBody:['',Validators.required],
      status:[false,Validators.required],
      newsDate:['',Validators.required],
      newsDetails:['',Validators.required]
    })
  }
  getNewsById(){
    this.editNewsForm.reset();
    this._authService.request('get',NEWS_FIND_BY_ID_ENDPOINT+this.newsId).subscribe((res)=>{
      this.newsDetails=res.result;
      this.editNewsForm.patchValue({
        subject:this.newsDetails?.subject,
        noticeBody:this.newsDetails?.noticeBody,
        status:this.newsDetails?.status,
        newsDate: new Date(this.newsDetails?.newsDate)
        
        
      })
    })
  }

  updateNews(){
    this._loader.openLoader();
    const payload = this.editNewsForm.value;
    payload.newsDate = this.editNewsForm.value.newsDate?.toISOString();
    console.log(payload);
    this._authService.request('post',UPDATE_NEWS_BY_ID_ENDPOINT+this.newsId,payload).subscribe((res)=>{
      this.editNewsForm.reset();
      this.messageService.clear();
      this.messageService.add({severity:'success', summary:'' ,detail:"News artical has been updated."});
      setTimeout(() => 
            {
              this._loader.closeLoader();
              this.router.navigate(['/news-artical/news-artical-list']);
            },
      1000);
    },(error) => {
      this._loader.closeLoader();
      this.messageService.add({severity:'error', summary:'' ,detail:"News artical update has been failed."});
      console.error();
    })
  }
}
