import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNoticeComponent } from './add-notice/add-notice.component';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EditNoticeComponent } from './edit-notice/edit-notice.component';
import {NgxPaginationModule} from 'ngx-pagination';

export const route: Routes = [
  {path:'',component: NoticeListComponent},
  {path: 'add-notice' , component: AddNoticeComponent},
  {path: 'edit-notice/:token' , component: EditNoticeComponent}
]

@NgModule({
  declarations: [AddNoticeComponent, NoticeListComponent, EditNoticeComponent],
  imports: [
    CommonModule,
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class ManageNoticeModule { }
