import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewListComponent } from './review-list/review-list.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {InputSwitchModule} from 'primeng-lts/inputswitch';
import { SharedModule } from 'src/app/-shared/-shared.module';
import {TooltipModule} from 'primeng-lts/tooltip';
import {RatingModule} from 'primeng-lts/rating';
import {DialogModule} from 'primeng-lts/dialog';
import {ButtonModule} from 'primeng-lts/button';
export const route: Routes = [
  { path: '', component: ReviewListComponent},

];

@NgModule({
  declarations: [ReviewListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    InputSwitchModule,
    SharedModule,
    TooltipModule,
    RatingModule,
    DialogModule,
    ButtonModule
  ]
})
export class ManageReviewModule { }
