import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-edit-school',
  templateUrl: './edit-school.component.html',
  styleUrls: ['./edit-school.component.css']
})
export class EditSchoolComponent implements OnInit {

  constructor(private _authService : AuthService) { }

  ngOnInit(): void {
    this.hideShowCall();
  }

  hideShowCall(){
    // this._authService.loader.next({ load: false})
    this._authService._adminSideNavBar.next({show: true})
    this._authService._adminHeader.next({show: true})
    this._authService._adminFooter.next({show: true})
  }

}
