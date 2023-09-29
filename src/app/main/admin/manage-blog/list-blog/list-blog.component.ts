import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-blog',
  templateUrl: './list-blog.component.html',
  styleUrls: ['./list-blog.component.css']
})
export class ListBlogComponent implements OnInit {
  _blogList:any=[];
  itemsPerPage=25;
  currentPage=1;
  sizeArr=[10,20,30];
  currentPageStartingIndex:any;
  currentPageEndingIndex:any;
  _blogListSize=0;
  constructor() { }

  ngOnInit(): void {
  }

}
