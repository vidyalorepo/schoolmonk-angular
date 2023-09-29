import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css']
})
export class BlogEditComponent implements OnInit {
  public tools: object = {
    items: [
      'Undo',
      'Redo',
      '|',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      'Bold',
      'Italic',
      'Underline',
      '|',
      'OrderedList',
      'UnorderedList',
      'Outdent',
      'Indent',
      '|',
      'CreateTable',
      'image',
      'CreateLink',
    ],
  };

  public quickTools: object = {
    image: [
      'Replace',
      'Align',
      'Caption',
      'Remove',
      'InsertLink',
      '-',
      'Display',
      'AltText',
      'Dimension',
    ],
  };
  constructor() { }

  ngOnInit(): void {
  }

}
