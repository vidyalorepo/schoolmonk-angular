import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProgressiveProgramsComponent } from './list-progressive-programs/list-progressive-programs.component';
import { RouterModule, Routes } from '@angular/router';
import { StudyAbroadComponent } from './study-abroad/study-abroad.component';
import { TopIndianGovernmentScholarshipComponent } from './top-indian-government-scholarship/top-indian-government-scholarship.component';

export const route: Routes = [
  {path:'', component : ListProgressiveProgramsComponent},
  {path:'study-abroad', component :StudyAbroadComponent },
  {path:'top-Indian-government-Scholarships', component :TopIndianGovernmentScholarshipComponent }


]

@NgModule({
  declarations: [ListProgressiveProgramsComponent, StudyAbroadComponent, TopIndianGovernmentScholarshipComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
  ]
})
export class ProgressiveProgramsModule { }
