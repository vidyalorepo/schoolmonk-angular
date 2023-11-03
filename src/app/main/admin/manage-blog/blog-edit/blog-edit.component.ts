import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageService } from 'primeng-lts/api';
import { LoaderService } from 'src/app/_services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css'],
  providers: [MessageService]
})
export class BlogEditComponent implements OnInit {
  editBlogsForm: FormGroup;
  _blogsDetails: any;
  blogId: any;
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
    private router: Router,
    private route: ActivatedRoute,) {
      this.initEditForm();
    }

  ngOnInit(): void {
    this.fetchAllBlogCategory();
    this.blogId = this.route.snapshot.paramMap.get('id');
    this.getBlogsById();
  }

  initEditForm(){
    this.editBlogsForm=this.formBuilder.group({
      title:['',Validators.required],
      blogDate:['',Validators.required],
      description:[false,Validators.required],
      blogDetails:['',Validators.required],
      status:['',Validators.required],
      id: [{id:this._blogsDetails?.id}],
      blogCategory:[null,Validators.required]
    })
  }  

  getBlogsById(){
    this.editBlogsForm.reset();
    this._authService.request('get',`blog/findBlogById/${this.blogId}`).subscribe((res)=>{
      this._blogsDetails=res.result;
      this.editBlogsForm.patchValue({
        title:this._blogsDetails?.title,
        blogDate: new Date(this._blogsDetails?.blogDate),
        description:this._blogsDetails?.description,
        blogDetails: this._blogsDetails?.blogDetails,
        status: this._blogsDetails?.status ,
        blogCategory:this._blogsDetails.blogCategory
      })
    })
  }

  updateBlogs(){
    this._loader.openLoader();
    console.log(this.editBlogsForm.value);
    const payload = this.editBlogsForm.value;
    payload.blogDate = this.editBlogsForm.value.blogDate?.toISOString();
    payload.id = this.blogId;
    // payload.id = {id:this._blogsDetails.id};
    console.log(payload);
    if (this.editBlogsForm.valid) {
      this._authService
        .request('post', 'blog/editblog' , payload)
        .subscribe(
          (res) => {
            this.editBlogsForm.reset();
            this.messageService.clear();
            this.messageService.add({severity:'success', summary: '', detail: 'Your blog has been updated.'});
            setTimeout(() => 
            {
              this._loader.closeLoader();
              this.router.navigate(['/blog']);
            },
           1000);
           this._loader.closeLoader();
          },(error) => {
            this._loader.closeLoader();
            // console.error();
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: '',
              detail: 'Blog save has been failed.',
            });
            console.error();
            this._loader.closeLoader();
          }
        ); 
    }

  }

  fetchAllBlogCategory(){
    this._authService.openRequest('get','commonMaster/fetchAllBlogCategory').subscribe((res)=>{
      this.blogCategoryList=res.result;
    })
  }

}
