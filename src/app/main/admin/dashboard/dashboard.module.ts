import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CardModule} from 'primeng-lts/card';

export const route: Routes = [
  {path:'admin-dashboard', component : AdminDashboardComponent},
]

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    CardModule
  ]
})
export class DashboardModule { }
