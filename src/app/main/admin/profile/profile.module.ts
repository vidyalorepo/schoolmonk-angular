import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolProfileComponent } from './school-profile/school-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const route: Routes = [
  {path:'school-profile', component : SchoolProfileComponent},
]

@NgModule({
  declarations: [SchoolProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule

  ]
})
export class ProfileModule { }
