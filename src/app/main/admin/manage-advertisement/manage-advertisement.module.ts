import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule} from 'primeng-lts/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { SharedModule } from 'src/app/-shared/-shared.module';
import { TagModule } from 'primeng-lts/tag';
import {InputSwitchModule} from 'primeng-lts/inputswitch';
import { AdvertisementDetailsComponent } from './advertisement-details/advertisement-details.component';
import { AdvertisementListComponent } from './advertisement-list/advertisement-list.component';
import {ConfirmPopupModule} from 'primeng-lts/confirmpopup';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
export const route: Routes = [
  { path: '', component: AdvertisementListComponent},
  { path: 'advertisement-view/:id', component:  AdvertisementDetailsComponent},
];

@NgModule({
  declarations: [AdvertisementDetailsComponent, AdvertisementListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CalendarModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    TagModule,
    InputSwitchModule,
    ConfirmPopupModule,
    MessagesModule,
    MessageModule
  ]
})
export class ManageAdvertisementModule { }
