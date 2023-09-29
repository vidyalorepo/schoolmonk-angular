import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolFeatureComponent } from './school-feature/school-feature.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const route: Routes = [
  {path:'school-feature', component : SchoolFeatureComponent},
 

  
]


@NgModule({
  declarations: [SchoolFeatureComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class HomeDetailsModule { }
