import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentListComponent } from './student-list/student-list.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxPaginationModule } from 'ngx-pagination';
import { DemoMaterialModule } from 'src/app/material-module';
import { AddStudentComponent } from './add-student/add-student.component';
import { ViewStudentComponent } from './view-student/view-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import {ButtonModule} from 'primeng-lts/button';
import { TagModule } from 'primeng-lts/tag';
import { SharedModule } from 'src/app/-shared/-shared.module';
import {InputSwitchModule} from 'primeng-lts/inputswitch';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
import {InputTextModule} from 'primeng-lts/inputtext';
import {ConfirmPopupModule} from 'primeng-lts/confirmpopup';
export const route: Routes = [
  { path: 'student-list', component: StudentListComponent },
  { path: 'student-list/add-student', component: AddStudentComponent },
  { path: 'student-list/view-student/:id', component: ViewStudentComponent },
  { path: 'student-list/edit-student/:id', component: EditStudentComponent },
];

@NgModule({
  declarations: [
    StudentListComponent,
    AddStudentComponent,
    ViewStudentComponent,
    EditStudentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MultiSelectModule,
    MatSortModule,
    NgxPaginationModule,
    DemoMaterialModule,
    ButtonModule,
    TagModule,
    SharedModule,
    InputSwitchModule,
    MessagesModule,
    MessageModule,
    InputTextModule,
    ConfirmPopupModule
  ],
})
export class ManageStudentModule {}
