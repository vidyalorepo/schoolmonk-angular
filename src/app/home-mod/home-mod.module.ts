import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterModule, Routes } from '@angular/router';

export const authRoute: Routes = [
  {path:'', component : HomePageComponent,
    data: {
        seo: {
          title: 'Vidyalo',
          metaTags: [
            { property: 'og:title', content: 'vidyalo' },
            { name: 'keywords', content: 'kendriya vidyalaya,private schools near me,play school near me,international school,kindergarten near me,military school,best private schools in WB' },
            { name: 'description', content: 'Schools in West Bengal along with address and details of school. Vidyalo gives you the information on top English Medium Schools in Kolkata, Govt English Medium School, Private English Medium School etc.' }
            // { proprety: 'og:description', content: 'Some description goes here!!!!' },
          ]
        }
      }
  },

]

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(authRoute),
    FormsModule,
    ReactiveFormsModule,
    CarouselModule
  ]
})
export class HomeModModule { }
