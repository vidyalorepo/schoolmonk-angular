import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProgressiveProgramsComponent } from './list-progressive-programs/list-progressive-programs.component';
import { RouterModule, Routes } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { ProgressiveProgramDetailsComponent } from './progressive-program-details/progressive-program-details.component';
export const route: Routes = [
  {path:'', component : ListProgressiveProgramsComponent},
  {path:':slug',component:ProgressiveProgramDetailsComponent}

]

@NgModule({
  declarations: [ListProgressiveProgramsComponent,ProgressiveProgramDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    NgxPaginationModule
  ]
})
export class ProgressiveProgramsModule { }
