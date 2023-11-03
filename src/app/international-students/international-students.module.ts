import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListInternationalStudentsComponent } from './list-international-students/list-international-students.component';
import { RouterModule, Routes } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { InternationalStudentDetailsComponent } from './international-student-details/international-student-details.component';
export const route: Routes = [
  {path:'', component : ListInternationalStudentsComponent},
  // {path:'exam-tips-vidyalo', component : ExamTipsVidyaloComponent},
  {path:':slug',component:InternationalStudentDetailsComponent}
]

@NgModule({
  declarations: [ListInternationalStudentsComponent,InternationalStudentDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    NgxPaginationModule
  ]
})
export class InternationalStudentsModule { }
