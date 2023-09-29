import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmissionRecordsComponent } from './admission-records/admission-records.component';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionRequirementsComponent } from './admission-requirements/admission-requirements.component';
import { AddClassDetailsComponent } from './add-class-details/add-class-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PreviewStudentRecordsComponent } from './preview-student-records/preview-student-records.component';
import { NgxPrintModule } from 'ngx-print';
import { AdmissionListCompComponent } from './admission-list-comp/admission-list-comp.component';
import { AdmissionEligibilityFormComponent } from './admission-eligibility-form/admission-eligibility-form.component';
import { MatSortModule } from '@angular/material/sort';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxPaginationModule } from 'ngx-pagination';
import { DemoMaterialModule } from 'src/app/material-module';
import { MatNativeDateModule } from '@angular/material/core';
import { AdmissionEligibilityEditComponent } from './admission-eligibility-edit/admission-eligibility-edit.component';

export const route: Routes = [
  { path: 'admission-records', component: AdmissionRecordsComponent },
  { path: 'admission-requirements', component: AdmissionRequirementsComponent },
  {
    path: 'admission-requirements/add-class-info',
    component: AddClassDetailsComponent,
  },
  { path: 'preview-records/:id', component: PreviewStudentRecordsComponent },
  { path: 'admission-lists', component: AdmissionListCompComponent },
  {
    path: 'admission-lists/add-admission-form',
    component: AdmissionEligibilityFormComponent,
  },
  { path: 'admission-lists/admission-edit/:id', component: AdmissionEligibilityEditComponent },
];

@NgModule({
  declarations: [
    AdmissionRecordsComponent,
    AdmissionRequirementsComponent,
    AddClassDetailsComponent,
    PreviewStudentRecordsComponent,
    AdmissionListCompComponent,
    AdmissionEligibilityFormComponent,
    AdmissionEligibilityEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgxPrintModule,
    MultiSelectModule,
    MatSortModule,
    NgxPaginationModule,
    DemoMaterialModule,
    MatNativeDateModule
  ],

  // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AdmissionModule {}
