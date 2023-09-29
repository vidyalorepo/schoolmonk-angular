import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';

@Component({
  selector: 'app-news-artical-details',
  templateUrl: './news-artical-details.component.html',
  styleUrls: ['./news-artical-details.component.css'],
  providers:[ConfirmationService,MessageService]
})
export class NewsArticalDetailsComponent implements OnInit {
  NewsSlug: string;
  newsDetails: any;

  NewsOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
    autoplay: true,
    autoplaySpeed: 1000,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
  data = {
    "page": 1,
    "size": 6,
    "sortBy":"news_date",
    "sortDir":"DESC",
    "status":true
  }
  NewsList: any;
  constructor(private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _loader:LoaderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.NewsSlug = this.route.snapshot.paramMap.get('slug');
    this.getNewsDetailsBySlug();
    this.GetSimilerNews();
  }

  getNewsDetailsBySlug(){
    this._authService.openRequest('get',`newsarticlescontroller/findNewsArticalBySlug/${this.NewsSlug}`).subscribe((res)=>{
      this.newsDetails=res.result;
      console.log(res);
    },(e)=>{
      console.log(e);
    })
  }

  GetSimilerNews(){
    this._authService.authRequest('post','newsarticlescontroller/getallnewsartical',this.data).subscribe((res)=>{
      this.NewsList= res.result;
   })
  }
}
