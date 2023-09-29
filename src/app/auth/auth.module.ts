import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnterOtpComponent } from './enter-otp/enter-otp.component';
import { CreateRegistrationComponent } from './create-registration/create-registration.component';
import { AdminRegistrationComponent } from './admin-registration/admin-registration.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {InputTextModule} from 'primeng-lts/inputtext';
import {PasswordModule} from 'primeng-lts/password';
import {ButtonModule} from 'primeng-lts/button';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';

export const authRoute: Routes = [
  {path:'login/:mode', component : LoginComponent},
  {path:'registration', component : RegistrationComponent}, 
  {path:"forgot-password", component: ForgotPasswordComponent},
  {path:'enter-otp/:user', component: EnterOtpComponent},
  {path:'create-registration', component: CreateRegistrationComponent},
  {path: 'admin-registration/:mode/:token', component: AdminRegistrationComponent},
  {path: 'reset-password/:token', component: ResetPasswordComponent}
  
]

@NgModule({
  declarations: [LoginComponent, RegistrationComponent, ResetPasswordComponent, ForgotPasswordComponent, EnterOtpComponent, CreateRegistrationComponent, AdminRegistrationComponent, PageNotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(authRoute),
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessagesModule,
    MessageModule

  ]
})
export class AuthModule { }
