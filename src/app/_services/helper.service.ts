import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}
  public toCamelCase(input: string) {
    if (input) {
      return input
        .split(' ')
        .map(function (word, index) {
          // If it is the first word make sure to lowercase all the chars.
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    }
    return null;
  }
}
