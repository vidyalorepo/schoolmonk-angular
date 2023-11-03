import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageService } from 'primeng-lts/api';
import { LoaderService } from 'src/app/_services/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-add',
  templateUrl: './blog-add.component.html',
  styleUrls: ['./blog-add.component.css'],
  providers: [MessageService]
})
export class BlogAddComponent implements OnInit {
  addBlogsForm:FormGroup;
  submitted: boolean;
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
  blogCategoryList: any;
  constructor(private formBuilder: FormBuilder,
    private _authService: AuthService,
    private messageService: MessageService,
    private _loader:LoaderService,
    private router: Router,) { }

  ngOnInit(): void {
    this.inintAddForm();
    this.addBlog();
    this.fetchAllBlogCategory();
  }

  inintAddForm() {
    this.addBlogsForm = this.formBuilder.group({
      title: ['', Validators.required],
      blogDate: ['', [Validators.required]],
      description: ['', Validators.required],
      blogDetails: ['', Validators.required],
      status: [true],
      blogCategory:['',Validators.required]
    });
  }

  addBlog(){
    console.log(this.addBlogsForm.value);
    const payload = this.addBlogsForm.value;
    // payload.blogDate = this.addBlogsForm.value.blogDate.toISOString();
    console.log(payload);
    if (this.addBlogsForm.valid) {
      this._loader.openLoader();
      this._authService
        .request('post', 'blog/addblog' , payload)
        .subscribe(
          (res) => {
            this._loader.closeLoader();
            this.addBlogsForm.reset();
            this.messageService.clear();
            this.messageService.add({severity:'success', summary: '', detail: 'Your blog has been added.'});
            setTimeout(() => 
            {
              this.router.navigate(['/blog']);
            },
            2000);
           
          },(error) => {
            this._loader.closeLoader();
            console.error();
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: '',
              detail: 'Blog save has been failed.',
            })
          }
        ); 
        this.submitted= true;
    }
  }

  fetchAllBlogCategory(){
    this._authService.openRequest('get','commonMaster/fetchAllBlogCategory').subscribe((res)=>{
      this.blogCategoryList=res.result;
    })
  }

}
