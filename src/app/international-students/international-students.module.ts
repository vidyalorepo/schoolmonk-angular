import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListInternationalStudentsComponent } from './list-international-students/list-international-students.component';
import { RouterModule, Routes } from '@angular/router';
import { ExamTipsVidyaloComponent } from './exam-tips-vidyalo/exam-tips-vidyalo.component';

export const route: Routes = [
  {path:'', component : ListInternationalStudentsComponent},
  {path:'exam-tips-vidyalo', component : ExamTipsVidyaloComponent}

]

@NgModule({
  declarations: [ListInternationalStudentsComponent,ExamTipsVidyaloComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
  ]
})
export class InternationalStudentsModule { }
