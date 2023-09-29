import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phonePipe'
})
export class PhonePipePipe implements PipeTransform {

  transform(rawNum: string): unknown {
    rawNum = '+91' + rawNum;

    const countryCodeStr = rawNum.slice(0, 3);
    const areaCodeStr = rawNum.slice(3, 8);
    const midSectionStr = rawNum.slice(8, 13);
    // const lastSectionStr = rawNum.slice(8);

    return `${countryCodeStr} ${areaCodeStr} ${midSectionStr}`;
  }

}
