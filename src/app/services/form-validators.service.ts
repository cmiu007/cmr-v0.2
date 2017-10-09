import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class FormValidatorsService {

  constructor() { }

  checkCNP(control: FormGroup): { [s: string]: boolean } {
    // TODO: de verificat daca mai exista in baza de date!!
    const testValCNP = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
    let splitCNP = [];
    splitCNP = String(control.value).split('');
    let sum = 0;
    if (splitCNP.length !== 13) {
      return { 'cnpLengthIsInvalid': true };
    } else {
      for (let i = 0; i < testValCNP.length; i++) {
        sum = sum + splitCNP[i] * testValCNP[i];
      }
      if ( sum % 11 === 10) {
        sum = 1;
      }
      if ((sum % 11) !== +splitCNP[12]) {
        return { 'cnpCtrlSumInvalid': true };
      } else {
        return null;
      }
    }
  }

  checkDate(control: FormGroup): { [s: string]: boolean } {
    // check if null pt cazul in care nu este required
    if (control.value === null || control.value === '') {
      return null;
    }
    const validateDateISO =
      /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/i;
    return validateDateISO.test(control.value) ? null : { 'invalidDateFormat': true };
  }

  isInTheFuture(control: FormGroup): { [s: string]: boolean } {
    if (control.value === null || control.value === '') {
      return null;
    }
    const now = new Date(Date.now());
    now.setUTCHours(0, 0, 0, 0);
    const date = new Date(control.value);
    date.setUTCHours(0, 0, 0, 0);
    if ( +date > +now ) {
      return { 'isInTheFuture': true};
    }
    return null;
  }

  isInThePast(control: FormGroup): { [s: string]: boolean } {
    if (control.value === null || control.value === '') {
      return null;
    }
    const now = new Date(Date.now());
    now.setUTCHours(0, 0, 0, 0);
    const date = new Date(control.value);
    date.setUTCHours(0, 0, 0, 0);
    if ( +date < +now ) {
      return {'isInThePast': true} ;
    }
    return null;
  }

  isToday(control: FormGroup): { [s: string]: boolean } {
    if (control.value === null || control.value === '') {
      return null;
    }
    const now = new Date(Date.now());
    now.setUTCHours(0, 0, 0, 0);
    const date = new Date(control.value);
    date.setUTCHours(0, 0, 0, 0);
    if ( +date === +now ) {
      return null;
    }
    return {'isNotToday': true} ;
  }

  checkAnPromotie(control: FormGroup): { [s: string]: boolean } {
    const today = new Date();
    if (control.value < 1950) {
      return { 'yearIsTooSmall': true };
    }
    if (control.value > today.getFullYear()) {
      return { 'yearIsInTheFuture': true };
    }
    return null;
  }

  checkIfNumber(control: FormGroup): { [s: string]: boolean} {
    // TODO: de pus si in form date personale
    if (control.value === '') {
      return null;
    }
    if (isNaN(control.value)) {
      return { 'invalidId': true};
    }
    return null;
  }
}
