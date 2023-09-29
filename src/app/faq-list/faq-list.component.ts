import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.css']
})
export class FaqListComponent implements OnInit {
  faqDtl: any = [];

  constructor(private _authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.callFaqList();
  }

  callFaqList() {
    this._authService
        .request1('get', `commonMaster/getFaqs`)
        .subscribe(
          (res) => {
            console.log(res);
            if (res.status == 200) {
              this.faqDtl = res.result;
              console.log("this.faqDtl -->> ", this.faqDtl);
            }
          },
          (error) => {
          }
        );
  }

}
