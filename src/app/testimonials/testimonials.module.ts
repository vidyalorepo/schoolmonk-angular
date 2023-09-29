import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialsListComponent } from './testimonials-list/testimonials-list.component';
import { TestimonialsDetailsComponent } from './testimonials-details/testimonials-details.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng-lts/inputtext';
import {InputTextareaModule} from 'primeng-lts/inputtextarea';


export const route: Routes = [
  {path:'testimonials-list', component : TestimonialsListComponent},
  {path:'testimonials-details/:id', component : TestimonialsDetailsComponent},
]


@NgModule({
  declarations: [TestimonialsListComponent, TestimonialsDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule
  ]
})
export class TestimonialsModule { }
