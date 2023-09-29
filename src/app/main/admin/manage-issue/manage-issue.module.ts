import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueListComponent } from './issue-list/issue-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxPaginationModule } from 'ngx-pagination';
import { DemoMaterialModule } from 'src/app/material-module';
import { ViewIssueComponent } from './view-issue/view-issue.component';
import { TagModule } from 'primeng-lts/tag';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
import {ButtonModule} from 'primeng-lts/button';

export const routes: Routes = [
  { path: 'issue-list', component: IssueListComponent },
  { path: 'issue-list/view-issue/:id', component: ViewIssueComponent },
];

@NgModule({
  declarations: [IssueListComponent, ViewIssueComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MultiSelectModule,
    MatSortModule,
    NgxPaginationModule,
    DemoMaterialModule,
    TagModule,
    MessagesModule,
    MessageModule,
    ButtonModule
  ],
})
export class ManageIssueModule {}
