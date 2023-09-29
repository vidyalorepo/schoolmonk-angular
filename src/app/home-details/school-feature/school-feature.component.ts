import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-school-feature',
  templateUrl: './school-feature.component.html',
  styleUrls: ['./school-feature.component.css'],
})
export class SchoolFeatureComponent implements OnInit {
  _featuredList = [
    {
      schoolName: '',
      schoolBannerPath: '',
      schoolBrochurePath: '',
      city: '',
      schoolAddress: '',
      state: '',
      postalCode: '',
      schoolBoard: '',
      schoolFees: '',
      schoolNameSlug: ''
    },
  ];
  featuredSchoolLength: any;
  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.getFeaturedDetails();
  }

  getFeaturedDetails() {
    this._featuredList = [];
    this.openLoader();
    this._authService.getAuthRequest('schooluser/getFeaturedSchool').subscribe(
      (res) => {
        this.closeLoader();
        if (res.status == 200) {
          console.log(res.result);
          res.result.forEach((element: any) => {
            this._featuredList.push(element);
          });
        }
      },
      (error) => {
        this.closeLoader();
        console.log(error.error?.noOfData);
        this.featuredSchoolLength=error.error?.noOfData;
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
