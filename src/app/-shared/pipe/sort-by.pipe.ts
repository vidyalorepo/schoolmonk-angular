import { Pipe, PipeTransform } from '@angular/core';
export type SortOrder = 'asc' | 'desc';
@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
  transform(value: string[]): string[] {
  // Use a copy of your array if you want to keep the original untouched
  return [...value].sort((a, b) => {
    a = a.toLowerCase(); // or a.toLocaleLowerCase()
    b = b.toLowerCase(); // or b.toLocaleLowerCase()
    return a.localeCompare(b);
  })
}

}
