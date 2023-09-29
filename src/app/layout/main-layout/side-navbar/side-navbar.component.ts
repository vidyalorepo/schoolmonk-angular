import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {

  userDetails: any;
  condition: string;

  constructor(private router: Router,) { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.condition = this.router.url;
    console.log(this.condition);
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
  }

  gotoSChoolProfile(){
    this.router.navigate(['/manage-school/school-list/school-profile-edit/'+this.userDetails.schoolId])
  }
}
