import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { SharedModule } from 'src/app/-shared/-shared.module';
import { MatSortModule } from '@angular/material/sort';
import { TagModule } from 'primeng-lts/tag';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';

export const route: Routes = [
  { path: 'feedback-list', component: FeedbackListComponent },
]



@NgModule({
  declarations: [FeedbackListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    MatSortModule,
    TagModule,
    MessagesModule,
    MessageModule,
    MultiSelectModule
  ]
})
export class ManageFeedbackModule { }
