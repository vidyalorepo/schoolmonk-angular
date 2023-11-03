import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddHeaderTagComponent } from './add-header-tag/add-header-tag.component';
import { ListHeaderTagComponent } from './list-header-tag/list-header-tag.component';
import { RouterModule, Routes } from '@angular/router';
import {InputSwitchModule} from 'primeng-lts/inputswitch';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import {ButtonModule} from 'primeng-lts/button';
import {InputTextModule} from 'primeng-lts/inputtext';
import {DialogModule} from 'primeng-lts/dialog';
export const route: Routes = [
  {path:'',component: ListHeaderTagComponent},
  {path: 'add-header' , component: AddHeaderTagComponent}
]

@NgModule({
  declarations: [AddHeaderTagComponent, ListHeaderTagComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    InputSwitchModule,
    MessagesModule,
    MessageModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ButtonModule,
    InputTextModule,
    DialogModule
  ]
})
export class ManageHeaderTagModule { }
