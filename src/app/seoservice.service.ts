import { Injectable } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(private title: Title, private meta: Meta) { }
  updateTitle(title: string){
    this.title.setTitle(title);
  }
  updateMetaTags(metaTags: MetaDefinition[]){
    metaTags.forEach(m=> this.meta.updateTag(m));
  }
  updateMetaKeyword(keyword:string,Desc:string){
    this.meta.updateTag({name: 'keywords',content: keyword})
    this.meta.updateTag({ name: 'description', content: Desc });
  }
}