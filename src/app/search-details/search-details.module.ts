import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSchoolDetailsComponent } from './search-school-details/search-school-details.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplySchoolComponent } from './apply-school/apply-school.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../-shared/-shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {RatingModule} from 'primeng-lts/rating';
import {ButtonModule} from 'primeng-lts/button';
import {ToastModule} from 'primeng-lts/toast';
import {DialogModule} from 'primeng-lts/dialog';
// import { ApplyNowComponent } from './apply-now/apply-now.component';
// import { ApplyDetailsComponent } from './apply-details/apply-details.component';

export const route: Routes = [
  {
    path: 'search-school-details/:id',
    component: SearchSchoolDetailsComponent,
  },
  {
    path: 'apply-school/:fees/:dt/:cls/:stdid/:stddob/:board/:acyear',
    component: ApplySchoolComponent,
  },
  // { path: 'apply-now', component: ApplyNowComponent },
  // { path: 'apply-details', component: ApplyDetailsComponent },
];

@NgModule({
  declarations: [
    SearchSchoolDetailsComponent,
    ApplySchoolComponent,
    // ApplyNowComponent,
    // ApplyDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    SharedModule,
    NgxPaginationModule,
    RatingModule,
    ButtonModule,
    ToastModule,
    DialogModule,
  ],
})
export class SearchDetailsModule {}
