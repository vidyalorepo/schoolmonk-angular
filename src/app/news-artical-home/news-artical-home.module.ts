import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsArticalDetailsComponent } from './news-artical-details/news-artical-details.component';
import { NewsArticalListComponent } from './news-artical-list/news-artical-list.component';
import { RouterModule, Routes } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../-shared/-shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';


export const route: Routes = [
  {path:'', component : NewsArticalListComponent},
  {path:'news-details/:slug',component:NewsArticalDetailsComponent}

]

@NgModule({
  declarations: [NewsArticalDetailsComponent, NewsArticalListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CarouselModule
  ]
})
export class NewsArticalHomeModule { }
