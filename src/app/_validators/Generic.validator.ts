import { createAttribute } from '@angular/compiler/src/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import moment from 'moment';
import { __makeTemplateObject } from 'tslib';

const _mobileNoValidationPattern: RegExp = /^([+]\d{2})?\d{10}$/;
const _emailValidationPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const _voterCardValidationPattern: RegExp = /^([a-zA-Z]){3}([0-9]){7}?$/i;
const _adhaarCardValidationPattern: RegExp =
  /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;

export function expressionValidator(expression: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = expression.test(control.value);
    return isValid ? null : { invalid: true };
  };
}

export function usernameValidator(control: AbstractControl): {
  [key: string]: any;
} {
  const isItAPhoneNo = _mobileNoValidationPattern.test(control.value);
  const isItAnEmailId = _emailValidationPattern.test(control.value.trim());

  if (!isItAPhoneNo && !isItAnEmailId) return { invalidUsername: true };
  return null;
}

export function phoneNoValidator(control: AbstractControl): {
  [key: string]: any;
} {
  const isItAPhoneNo = _mobileNoValidationPattern.test(control.value);
  if (!isItAPhoneNo) return { invalidPh: true };
  return null;
}
export function emailValidator(control: AbstractControl): {
  [key: string]: any;
} {
  const isItAnEmail = _emailValidationPattern.test((control.value == null || control.value == undefined)?'':control.value.trim());

  if (!isItAnEmail) return { invalidEmail: true };
  return null;
}

export function cardNoValidator(cardType: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let isValid: boolean = false;

    if (cardType.toLowerCase() === 'voter')
      isValid = _voterCardValidationPattern.test(control.value);

    if (cardType.toLowerCase() === 'aadhar')
      isValid = _adhaarCardValidationPattern.test(control.value);

    return isValid ? null : { invalidCardNo: true };
  };
}

export function minYearValidator(year: number) {
  return (control: AbstractControl) => {
    const validationString = moment(control.value).format("YYYY");
    if(validationString === "Invalid date" || Number(validationString) < year)
     return {ValidateDate: {value: true}}
    return null
  }
}