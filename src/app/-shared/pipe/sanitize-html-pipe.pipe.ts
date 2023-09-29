import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
    
  transform(html: string): any {
      return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
