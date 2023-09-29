import { ManageStudentBulkComponent } from './manage-student-bulk/manage-student-bulk.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


export const route: Routes = [
    { path: 'manage-student-bulk', component: ManageStudentBulkComponent },

];

@NgModule({
    declarations: [ManageStudentBulkComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(route),
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class ManageStudentBulkModule { }

