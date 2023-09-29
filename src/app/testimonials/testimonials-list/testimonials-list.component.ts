import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-testimonials-list',
  templateUrl: './testimonials-list.component.html',
  styleUrls: ['./testimonials-list.component.css']
})
export class TestimonialsListComponent implements OnInit {
  result: any;
  data = {};
  constructor(private _authService: AuthService) { }

  ngOnInit(): void {

    this.getalltestimonialslist();

  }

  getalltestimonialslist() {
    this.openLoader();
    this._authService.openRequest("get", "testimonials/getAllTestimonials").subscribe((res) => {

      console.log(res);
      this.closeLoader();
      this.result = res.result;
      console.log(this.result);
      this.data = this.result.docList;
      console.log(this.data);

    })
  }

  openLoader() {
    this._authService.loader.next({ load: true });
  }

  closeLoader() {
    this._authService.loader.next({ load: false });
  }


}
