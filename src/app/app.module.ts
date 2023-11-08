import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {
  LocationStrategy,
  HashLocationStrategy,
  CommonModule,
  PathLocationStrategy,
} from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminSideNavbarComponent } from './components/admin-side-navbar/admin-side-navbar.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminFooterComponent } from './components/admin-footer/admin-footer.component';
import { CommonSearchComponent } from './common-search/common-search.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LayoutModule } from './layout/layout.module';
import { AuthGuardService } from './auth-guard.service';
import { NgxPrintModule } from 'ngx-print';
import { DemoMaterialModule } from './material-module';
import { NgxPaginationModule } from 'ngx-pagination';
import { EncrDecrService } from './EncrDecrService.service';
import { RouteGuardService } from './router-guard-service';
import { MatSelectModule } from '@angular/material/select';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NoticeDetailsComponent } from './notice-details/notice-details.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { Daterangepicker } from 'ng2-daterangepicker';
import { FaqListComponent } from './faq-list/faq-list.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { CancellationRefundPolicyComponent } from './cancellation-refund-policy/cancellation-refund-policy.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { SharedModule } from './-shared/-shared.module';
import {InputSwitchModule} from 'primeng-lts/inputswitch';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
import {AccordionModule} from 'primeng-lts/accordion';
import { AboutUsComponent } from './about-us/about-us.component';
import { AddSchoolComponent } from './add-school/add-school.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpDaskComponent } from './help-dask/help-dask.component';
import {ButtonModule} from 'primeng-lts/button';
import {InputTextModule} from 'primeng-lts/inputtext';
import {InputTextareaModule} from 'primeng-lts/inputtextarea';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import {CaptchaModule} from 'primeng-lts/captcha';
import { HttpInterceptorInterceptor } from './http-interceptor.interceptor';
import { SuitableSchoolComponent } from './suitable-school/suitable-school.component';
import { DuplicateCheckComponent } from './duplicate-check/duplicate-check.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AdminSideNavbarComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    CommonSearchComponent,
    NoticeDetailsComponent,
    FaqListComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    CancellationRefundPolicyComponent,
    CookiePolicyComponent,
    AboutUsComponent,
    AddSchoolComponent,
    HelpDaskComponent,
    SuitableSchoolComponent,
    DuplicateCheckComponent,

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule,
    MatSnackBarModule,
    LayoutModule,
    NgxPrintModule,
    DemoMaterialModule,
    NgxPaginationModule,
    NgxSliderModule,
    CommonModule,
    MatSelectModule,
    NgxStarRatingModule,
    Daterangepicker,
    SharedModule,
    InputSwitchModule,
    MessagesModule,
    MessageModule,
    SharedModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    CaptchaModule,
    HttpClientModule,
  ],
  providers: [
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy,
    // },
    AuthGuardService,
    RouteGuardService,
    EncrDecrService,
    {provide : LocationStrategy , useClass: PathLocationStrategy},
    {provide:HTTP_INTERCEPTORS,useClass:HttpInterceptorInterceptor,multi:true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
