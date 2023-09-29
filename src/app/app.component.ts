import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SeoService } from './seoservice.service';
import { AuthService } from './_services/auth.service';
import { filter, map, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'schoolmonk-angular';

  isAdminSideNav : boolean = false;
  isAdminHeader : boolean = false;
  isAdminFooter : boolean = false;
  isNormalHeader : boolean = false;
 

  constructor(
    private router: Router,
    private _authService: AuthService,
    private titles: Title,
    private meta: Meta,
     private activatedRoute: ActivatedRoute, private seoService: SeoService
  ) { }

  ngOnInit(): void {
    this._authService._adminSideNavBar.subscribe((response) => {
      // console.log('isAdminSideNav',response.show);
      if(response.show != undefined){
        this.isAdminSideNav = response.show;
      }
      
    });
    this._authService._normalHeader.subscribe((response) => {
      // console.log('isAdminSideNav',response.show);
      if(response.show != undefined){
        this.isNormalHeader = response.show;
      }
      
    });
    this._authService._adminHeader.subscribe((response) => {
      // console.log('isAdminHeader',response);
      if(response.show != undefined){
        this.isAdminHeader = response.show;
      }
      
    });
    this._authService._adminFooter.subscribe((response) => {
      // console.log('isAdminFooter',response);
      if(response.show != undefined){
        this.isAdminFooter = response.show;
      }
      
    });

    // Seo tages and title
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.activatedRoute),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
    ).subscribe(data => {
      let seoData = data['seo'];
      console.log(seoData);
      if(seoData !== undefined){
        this.seoService.updateTitle(seoData['title'] == undefined ? 'Vidyalo' : seoData['title']);
        this.seoService.updateMetaTags(seoData['metaTags']);
      }
    });
  }
}
