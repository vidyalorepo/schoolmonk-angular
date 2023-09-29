import { AdmissionModule } from './../admin/admission/admission.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortListComponent } from './short-list/short-list.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { PreviewStudentRecordsComponent } from '../admin/admission/preview-student-records/preview-student-records.component';
import { StudentListComponent } from './student-list/student-list.component';
import { WishListComponent } from './wish-list/wish-list.component';

export const route: Routes = [
  { path: 'short-list', component: ShortListComponent },
  { path: 'student-profile/:id', component: StudentProfileComponent },
  { path: 'xyz/:id', component: PreviewStudentRecordsComponent },
  {path: 'student-list', component: StudentListComponent},
  {path: 'wish-list', component: WishListComponent}
];

@NgModule({
  declarations: [ShortListComponent, StudentProfileComponent, StudentListComponent, WishListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class StudentModule {}
