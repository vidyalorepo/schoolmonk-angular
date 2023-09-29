import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentListComponent } from './student-list/student-list.component';
import { SchoolListComponent } from './school-list/school-list.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSchoolComponent } from './add-school/add-school.component';
import { ViewSchoolComponent } from './view-school/view-school.component';
import { EditSchoolComponent } from './edit-school/edit-school.component';
import {InputTextModule} from 'primeng-lts/inputtext';

export const route: Routes = [
  {path: 'student-list', component : StudentListComponent},
  {path:'school-list', component : SchoolListComponent},
  {path:'add-school', component : AddSchoolComponent},
  {path:'view-school', component : ViewSchoolComponent},
  {path:'edit-school', component : EditSchoolComponent}
]

@NgModule({
  declarations: [StudentListComponent, SchoolListComponent, AddSchoolComponent, ViewSchoolComponent, EditSchoolComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    InputTextModule
  ]
})
export class ListModule { }
