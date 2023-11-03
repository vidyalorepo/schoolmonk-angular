import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuardianEnquiryListComponent } from './guardian-enquiry-list/guardian-enquiry-list.component';
import {RouterModule, Routes } from '@angular/router';
import {MessagesModule} from 'primeng-lts/messages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { SharedModule } from 'src/app/-shared/-shared.module';
import {ConfirmPopupModule} from 'primeng-lts/confirmpopup';
import {ButtonModule} from 'primeng-lts/button';
import { CalendarModule} from 'primeng-lts/calendar';
import { DatePipe } from '@angular/common';
import { GuardianEnquiryDetailsComponent } from './guardian-enquiry-details/guardian-enquiry-details.component';
import {InputTextModule} from 'primeng-lts/inputtext';

export const route: Routes = [
  { path: '', component: GuardianEnquiryListComponent},
  { path: 'guardian-enquiry-view/:id', component: GuardianEnquiryDetailsComponent},
];

@NgModule({
    declarations: [GuardianEnquiryListComponent, GuardianEnquiryDetailsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(route),
        MessagesModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        SharedModule,
        ConfirmPopupModule,
        ButtonModule,
        CalendarModule,
        InputTextModule
    ],
    providers: [
      DatePipe,
    ],
    
})
export class ManageGuardianEnquiryModule { }
