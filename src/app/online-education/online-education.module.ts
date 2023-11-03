import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOnlineEducationComponent } from './list-online-education/list-online-education.component';
import { RouterModule, Routes } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { OnlineEducationDetailsComponent } from './online-education-details/online-education-details.component';
export const route: Routes = [
  {path:'', component : ListOnlineEducationComponent},
  {path:':slug',component:OnlineEducationDetailsComponent}
]

@NgModule({
  declarations: [ListOnlineEducationComponent,OnlineEducationDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    NgxPaginationModule
  ]
})
export class OnlineEducationModule { }
