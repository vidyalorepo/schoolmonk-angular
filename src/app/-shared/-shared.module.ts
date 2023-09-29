import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskPipePipe } from './pipe/mask-pipe.pipe';
import { MessageService } from 'primeng-lts/api';
import { PhonePipePipe } from './pipe/phone-pipe.pipe';
import { ConvertFrom24To12FormatPipe } from './pipe/convert-from24-to12-format.pipe';
import { SanitizeHtmlPipePipe } from './pipe/sanitize-html-pipe.pipe';
import { HtmlToPlaintextPipe } from './pipe/html-to-plaintext.pipe';
import { ReplaceSpacePipe } from './pipe/replace-space.pipe';
import { SortByPipe } from './pipe/sort-by.pipe';




@NgModule({
  declarations: [MaskPipePipe, PhonePipePipe, ConvertFrom24To12FormatPipe, SanitizeHtmlPipePipe, HtmlToPlaintextPipe, ReplaceSpacePipe, SortByPipe],
  imports: [
    CommonModule
  ],
  exports:[MaskPipePipe,PhonePipePipe,ConvertFrom24To12FormatPipe,SanitizeHtmlPipePipe,HtmlToPlaintextPipe,ReplaceSpacePipe,SortByPipe],
  providers:[MaskPipePipe,MessageService,ConvertFrom24To12FormatPipe,SanitizeHtmlPipePipe,HtmlToPlaintextPipe,ReplaceSpacePipe,SortByPipe],
})
export class SharedModule { }
