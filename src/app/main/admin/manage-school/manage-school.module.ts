import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddSchoolComponent } from './add-school/add-school.component';
import { ViewSchoolComponent } from './view-school/view-school.component';
import { EditSchoolComponent } from './edit-school/edit-school.component';
import { SchoolListComponent } from './school-list/school-list.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { TimingListComponent } from './timing-list/timing-list.component';
import { AddTimingComponent } from './add-timing/add-timing.component';
import { AcademicListComponent } from './academic-list/academic-list.component';
import { AcademicSaveComponent } from './academic-save/academic-save.component';
import { MatSortModule } from '@angular/material/sort';
import { NgxPaginationModule } from 'ngx-pagination';
import { DemoMaterialModule } from 'src/app/material-module';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import {ButtonModule} from 'primeng-lts/button';
import { TagModule } from 'primeng-lts/tag';
import { SharedModule } from 'src/app/-shared/-shared.module';
import {CalendarModule} from 'primeng-lts/calendar';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';
import {InputTextModule} from 'primeng-lts/inputtext';
import {CheckboxModule} from 'primeng-lts/checkbox';
import {DropdownModule} from 'primeng-lts/dropdown';
import {InputTextareaModule} from 'primeng-lts/inputtextarea';
import { HtmlEditorService, ImageService, LinkService, RichTextEditorAllModule, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AcademicEditComponent } from './academic-edit/academic-edit.component';


export const route: Routes = [
  {path:'school-list/:status', component : SchoolListComponent},
  {path:'school-list/add-school/:id', component : AddSchoolComponent},
  {path:'school-list/view-school/:id', component : ViewSchoolComponent}, 
  {path:'school-list/edit-school/:id', component : EditSchoolComponent},
  {path:'school-list/school-profile-edit/:id', component : EditSchoolComponent},
  {path: 'timing-list', component: TimingListComponent},
  {path: 'add-timing', component: AddTimingComponent},
  {path: 'academic-save/:id', component: AcademicSaveComponent},
  {path: 'academic-edit/:id/:schoolid', component: AcademicEditComponent},
  {path: 'academic-list', component: AcademicListComponent},
  {path: 'school-list/bulk-upload', component: BulkUploadComponent}
]

@NgModule({
  declarations: [AddSchoolComponent, ViewSchoolComponent, EditSchoolComponent, SchoolListComponent, TimingListComponent, AddTimingComponent, AcademicListComponent, AcademicSaveComponent, BulkUploadComponent, AcademicEditComponent],
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
    NgxStarRatingModule,
    ButtonModule,
    TagModule,
    SharedModule,
    CalendarModule,
    MessagesModule,
    MessageModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    InputTextareaModule,
    RichTextEditorAllModule,
    TimePickerModule
  ],
  providers:[HtmlEditorService,ImageService,LinkService,TableService]
})
export class ManageSchoolModule { }
