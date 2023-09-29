import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-notice-details',
  templateUrl: './notice-details.component.html',
  styleUrls: ['./notice-details.component.css']
})
export class NoticeDetailsComponent implements OnInit {
  _noticeId: string;
  noticeDtl: any;

  constructor(private _authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this._noticeId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.callNoticeDtl(this._noticeId);
  }
  callNoticeDtl(_noticeId: string) {
    this._authService
        .request1('get', `schooluser/getPublishedNoticeDtl?noticeId=${_noticeId}`)
        .subscribe(
          (res) => {
            console.log(res);
            if (res.status == 200) {
              this.noticeDtl = res.result;
              console.log("this.noticeDtl -->> ", this.noticeDtl);
            }
          },
          (error) => {
          }
        );
  }

  downloadDoc(){
    // console.log(this.noticeDtl.document?.filePath);
    
    window.open(`${this.noticeDtl.document?.filePath}`, '_blank');
  }

}
