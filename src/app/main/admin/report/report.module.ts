import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchoolReportComponent } from './school-report/school-report.component';

export const route: Routes = [
  {path:'report', component : ReportComponent},
  // {path: 'school-reports', component : SchoolReportComponent}
  {path: 'schoolReport', component: SchoolReportComponent}
]

@NgModule({
  declarations: [ReportComponent, SchoolReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ReportModule { }
