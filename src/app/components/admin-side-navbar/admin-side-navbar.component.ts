import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-side-navbar',
  templateUrl: './admin-side-navbar.component.html',
  styleUrls: ['./admin-side-navbar.component.css']
})
export class AdminSideNavbarComponent implements OnInit {
  userDetails: any;

  constructor(private router: Router,) { }

  ngOnInit(): void {
    // this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
  }

  // gotoSChoolProfile(){
  //   this.router.navigate(['/manage-school/school-profile-edit/'+this.userDetails.schoolId])
  // }
}
