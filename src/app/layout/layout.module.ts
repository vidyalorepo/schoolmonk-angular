import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AdminFootersComponent } from './main-layout/admin-footers/admin-footers.component';
import { AdminHeadersComponent } from './main-layout/admin-headers/admin-headers.component';
import { MainFooterComponent } from './main-layout/main-footer/main-footer.component';
import { MainheaderComponent } from './main-layout/mainheader/mainheader.component';
import { SideNavbarComponent } from './main-layout/side-navbar/side-navbar.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'angular-crumbs';
import {InputTextModule} from 'primeng-lts/inputtext';
import {InputTextareaModule} from 'primeng-lts/inputtextarea';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
import {ButtonModule} from 'primeng-lts/button';
import {FileUploadModule} from 'primeng-lts/fileupload';
import {HttpClientModule} from '@angular/common/http';
import { CaptchaModule } from 'primeng-lts/captcha';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    MainLayoutComponent,
    AdminFootersComponent,
    AdminHeadersComponent,
    MainFooterComponent,
    MainheaderComponent,
    SideNavbarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    InputTextModule,
    InputTextareaModule,
    MessagesModule,
    MessageModule,
    ButtonModule,
    FileUploadModule,
    HttpClientModule,
    CaptchaModule
  ],
})
export class LayoutModule {}
