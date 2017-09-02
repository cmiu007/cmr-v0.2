import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class FormValidatorsService {

  constructor() { }

  checkDate(control: FormGroup): { [s: string]: boolean } {
    // check if null pt cazul in care nu este required
    if (control.value === '') {
      return null;
    }
    const validateDateISO =
      /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/i;
    return validateDateISO.test(control.value) ? null : { 'invalidDateFormat': true };
  }

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
      if ((sum % 11) !== +splitCNP[12]) {
        return { 'cnpCtrlSumInvalid': true };
      } else {
        return null;
      }
    }
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
