import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';

@Component({
  selector: 'app-progressive-program-details',
  templateUrl: './progressive-program-details.component.html',
  styleUrls: ['./progressive-program-details.component.css'],
  providers:[ConfirmationService,MessageService]
})
export class ProgressiveProgramDetailsComponent implements OnInit {
  blogSlug: string;
  blogdata: any;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private _loader: LoaderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.blogSlug = this.route.snapshot.paramMap.get('slug');
    this.fetchAllBlogDetailsBySlug();
  }

  fetchAllBlogDetailsBySlug(){
    this._authService.openRequest('get',`blog/findbySlug?slug=${this.blogSlug}`).subscribe((res)=>{
      this.blogdata=res.result;
    })
  }

}
