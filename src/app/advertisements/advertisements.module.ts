import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisementDetailsComponent } from './advertisement-details/advertisement-details.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
 
  { path: 'advertisement-details', component: AdvertisementDetailsComponent }
]

@NgModule({
  declarations: [AdvertisementDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AdvertisementsModule { }
