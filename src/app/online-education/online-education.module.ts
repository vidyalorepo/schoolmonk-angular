import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOnlineEducationComponent } from './list-online-education/list-online-education.component';
import { RouterModule, Routes } from '@angular/router';
import { StudyAbroadAfterTenThComponent } from './study-abroad-after-ten-th/study-abroad-after-ten-th.component';
import { ScholarshipsProgramsInForeignAndIndiaComponent } from './scholarships-programs-in-foreign-and-india/scholarships-programs-in-foreign-and-india.component';
import { MBBSAbroadComponent } from './mbbs-abroad/mbbs-abroad.component';
import { ForeignStudyEngineeringComponent } from './foreign-study-engineering/foreign-study-engineering.component';

export const route: Routes = [
  {path:'', component : ListOnlineEducationComponent},
  {path:'foreign-study-engineering', component : ForeignStudyEngineeringComponent},
  {path:'mbbs-abroad', component : MBBSAbroadComponent},
  {path:'scholarship-program-in-india', component : ScholarshipsProgramsInForeignAndIndiaComponent},
  {path:'study-abroad-after-10th', component : StudyAbroadAfterTenThComponent}

]

@NgModule({
  declarations: [ListOnlineEducationComponent, StudyAbroadAfterTenThComponent, ScholarshipsProgramsInForeignAndIndiaComponent, MBBSAbroadComponent, ForeignStudyEngineeringComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
  ]
})
export class OnlineEducationModule { }
