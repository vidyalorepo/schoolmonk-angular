import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBlogComponent } from './list-blog/list-blog.component';
import { BlogAddComponent } from './blog-add/blog-add.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { RouterModule, Routes } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng-lts/button';
import {InputTextModule} from 'primeng-lts/inputtext';
import {CalendarModule} from 'primeng-lts/calendar';
import {InputTextareaModule} from 'primeng-lts/inputtextarea';
import { HtmlEditorService, ImageService, LinkService, RichTextEditorAllModule, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import {InputSwitchModule} from 'primeng-lts/inputswitch';
import {ConfirmPopupModule} from 'primeng-lts/confirmpopup';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
export const route: Routes = [
  { path: '', component: ListBlogComponent },
  {path:'add-blog',component:BlogAddComponent},
  {path:'edit-blog/:id',component:BlogEditComponent}
]

@NgModule({
  declarations: [ListBlogComponent, BlogAddComponent, BlogEditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    InputTextareaModule,
    RichTextEditorAllModule,
    InputSwitchModule,
    ConfirmPopupModule,
    MessagesModule,
    MessageModule
  ],
  providers: [HtmlEditorService, TableService,LinkService, ImageService,]
})
export class ManageBlogModule { }
