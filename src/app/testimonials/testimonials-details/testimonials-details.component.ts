import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-testimonials-details',
  templateUrl: './testimonials-details.component.html',
  styleUrls: ['./testimonials-details.component.css']
})
export class TestimonialsDetailsComponent implements OnInit {
  _testimonialId: any;
  _testimonialDtl:any;

  constructor(private router: Router,
    private _authService: AuthService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this._testimonialId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.callTestimonialDtl(this._testimonialId);
  }

  callTestimonialDtl(id:any) {;
    const data = {};
    // return
    this.openLoader()
    this._authService
        .request1('get', `testimonials/gettestimonials/${id}`)
        .subscribe(
          (res) => {
            console.log(res);
            if (res) {
              this._testimonialDtl = res;
              console.log("this._testimonialDtl -->> ", this._testimonialDtl);
              this.closeLoader()
            }
          },
          (error) => { 
          }
        );
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }

}
