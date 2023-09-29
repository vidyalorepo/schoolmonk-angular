import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NewsarticlesListComponent } from './newsarticles-list/newsarticles-list.component';
import { NewsarticlesAddComponent } from './newsarticles-add/newsarticles-add.component';
import { NewsarticlesEditComponent } from './newsarticles-edit/newsarticles-edit.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {InputSwitchModule} from 'primeng-lts/inputswitch';
import {ButtonModule} from 'primeng-lts/button';
import {DropdownModule} from 'primeng-lts/dropdown';
import {ConfirmPopupModule} from 'primeng-lts/confirmpopup';
import {DialogModule} from 'primeng-lts/dialog';
import {InputTextModule} from 'primeng-lts/inputtext';
import {CalendarModule} from 'primeng-lts/calendar';
import {InputTextareaModule} from 'primeng-lts/inputtextarea';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
import { SharedModule } from 'src/app/-shared/-shared.module';
import { HtmlEditorService, ImageService, LinkService, RichTextEditorAllModule, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { MatSortModule } from '@angular/material/sort';




export const route: Routes = [
  { path: 'news-artical-list', component: NewsarticlesListComponent },
  { path: 'add-news-artical', component: NewsarticlesAddComponent },
  { path: 'edit-news-artical/:id', component: NewsarticlesEditComponent },
];

@NgModule({
  declarations: [NewsarticlesListComponent, NewsarticlesAddComponent, NewsarticlesEditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule,
    ButtonModule,
    DropdownModule,
    ConfirmPopupModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    InputTextareaModule,
    MessagesModule,
    MessageModule,
    SharedModule,
    RichTextEditorAllModule,
    MatSortModule
  ],
  providers: [HtmlEditorService, TableService,LinkService, ImageService,]
})
export class NewsArticlesModule { }
