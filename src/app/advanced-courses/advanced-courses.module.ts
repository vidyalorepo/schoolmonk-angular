import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAdvancedCoursesComponent } from './list-advanced-courses/list-advanced-courses.component';
import { RouterModule, Routes } from '@angular/router';
import { ArchitectureFinalComponent } from './architecture-final/architecture-final.component';
import { FaShionTechnologyComponent } from './fa-shion-technology/fa-shion-technology.component';
import { FineArtsComponent } from './fine-arts/fine-arts.component';
import { HotelManagementComponent } from './hotel-management/hotel-management.component';
import { MerchantNavyComponent } from './merchant-navy/merchant-navy.component';
import { VidyaloContentComponent } from './vidyalo-content/vidyalo-content.component';

export const route: Routes = [
  {path:'', component : ListAdvancedCoursesComponent},
  {path:'architecture', component : ArchitectureFinalComponent},
  {path:'faShionTechnology', component : FaShionTechnologyComponent},
  {path:'fine-arts', component : FineArtsComponent},
  {path:'hotel-management', component : HotelManagementComponent},
  {path:'merchant-navy', component : MerchantNavyComponent},
  {path:'vidyalo-content-NDA', component : VidyaloContentComponent}

]
@NgModule({
  declarations: [ListAdvancedCoursesComponent, ArchitectureFinalComponent, FaShionTechnologyComponent, FineArtsComponent, HotelManagementComponent, MerchantNavyComponent, VidyaloContentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
  ]
})
export class AdvancedCoursesModule { }
