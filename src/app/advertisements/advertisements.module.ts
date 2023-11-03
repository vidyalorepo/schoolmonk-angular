import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisementDetailsComponent } from './advertisement-details/advertisement-details.component';
import { RouterModule, Routes } from '@angular/router';
import { AdvertisementUploadComponent } from './advertisement-upload/advertisement-upload.component';
import { CaptchaModule } from 'primeng-lts/captcha';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuyersDetailsComponent } from './buyers-details/buyers-details.component';
import { InputNumberModule } from 'primeng-lts/inputNumber';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
import {ButtonModule} from 'primeng-lts/button';
import {InputTextModule} from 'primeng-lts/inputtext';
import {FileUploadModule} from 'primeng-lts/fileupload';
const routes: Routes = [
  { path: 'advertisement-details', component: AdvertisementDetailsComponent },
  { path: 'advertisement-upload/:id', component: AdvertisementUploadComponent },
  { path: 'buyers-details', component: BuyersDetailsComponent },
]

@NgModule({
  declarations: [AdvertisementDetailsComponent, AdvertisementUploadComponent, BuyersDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CaptchaModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
  ]
})
export class AdvertisementsModule { }
