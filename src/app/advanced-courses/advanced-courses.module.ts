import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAdvancedCoursesComponent } from './list-advanced-courses/list-advanced-courses.component';
import { RouterModule, Routes } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { AdvancedCourseDetailsComponent } from './advanced-course-details/advanced-course-details.component';

export const route: Routes = [
  {path:'', component : ListAdvancedCoursesComponent},
  {path:':slug',component:AdvancedCourseDetailsComponent}
]
@NgModule({
  declarations: [ListAdvancedCoursesComponent,AdvancedCourseDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    NgxPaginationModule
  ]
})
export class AdvancedCoursesModule { }
