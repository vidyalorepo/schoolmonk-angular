import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskPipe'
})
export class MaskPipePipe implements PipeTransform {

  transform(phrase: string) {    
    console.log(phrase);
    let toBeReplaced = phrase.slice(0, 7);
    return phrase.replace(toBeReplaced, "xxx-xxx");
}

}
