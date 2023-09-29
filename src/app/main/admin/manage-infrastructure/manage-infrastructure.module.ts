import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfrastructureListComponent } from './infrastructure-list/infrastructure-list.component';
import { AddInfrastructureComponent } from './add-infrastructure/add-infrastructure.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {ButtonModule} from 'primeng-lts/button';
import {MessagesModule} from 'primeng-lts/messages';
import {MessageModule} from 'primeng-lts/message';


export const route: Routes = [
  {path:'infrastructure-list',component: InfrastructureListComponent},
  {path: 'manage-school/add-infrastructure/:id' , component: AddInfrastructureComponent}
]

@NgModule({
  declarations: [InfrastructureListComponent, AddInfrastructureComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    ButtonModule,
    MessagesModule,
    MessageModule
  ]
})
export class ManageInfrastructureModule { }
