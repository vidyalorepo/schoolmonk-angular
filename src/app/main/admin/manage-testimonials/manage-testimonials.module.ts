import { NgxPaginationModule } from 'ngx-pagination';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialsListComponent } from './testimonials-list/testimonials-list.component';
import { TestimonialsAddComponent } from './testimonials-add/testimonials-add.component';
import { TestimonialsEditComponent } from './testimonials-edit/testimonials-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {ButtonModule} from 'primeng-lts/button';
import { TagModule } from 'primeng-lts/tag';
import { MatSortModule } from '@angular/material/sort';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
import {InputTextModule} from 'primeng-lts/inputtext';
import {InputTextareaModule} from 'primeng-lts/inputtextarea';

export const route: Routes = [
  { path: 'testimonials-list', component: TestimonialsListComponent },
  { path: 'add-testimonial', component: TestimonialsAddComponent },
  { path: 'edit-testimonial/:id', component: TestimonialsEditComponent },
];

@NgModule({
  declarations: [
    TestimonialsListComponent,
    TestimonialsAddComponent,
    TestimonialsEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ButtonModule,
    TagModule,
    MatSortModule,
    MessagesModule,
    MessageModule,
    InputTextModule,
    InputTextareaModule
  ],
})
export class ManageTestimonialsModule {}
