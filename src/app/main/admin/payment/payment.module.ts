import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolCollectionComponent } from './school-collection/school-collection.component';
import { StudentCollectionComponent } from './student-collection/student-collection.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxPaginationModule } from 'ngx-pagination';
import { Daterangepicker } from 'ng2-daterangepicker';

export const route: Routes = [
  { path: 'school-collection', component: SchoolCollectionComponent },
  { path: 'student-collection/:id/:sch/:fiscalYr', component: StudentCollectionComponent },
]

@NgModule({
  declarations: [SchoolCollectionComponent, StudentCollectionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MultiSelectModule,
    MatSortModule,
    NgxPaginationModule,
    Daterangepicker
  ]
})
export class PaymentModule { }
