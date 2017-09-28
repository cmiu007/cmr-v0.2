import { Injectable } from '@angular/core';

@Injectable()
export class DataCalService {

  constructor() { }

  strToDate(data: string): Date {
    return new Date(data);
  }

  today(): string {
    const now = new Date(Date.now());
    const today = this.dateToString(now);
    return today;
  }

  dateToString (data: Date): string {
    const year = data.getFullYear().toString();
    let month = (data.getMonth() + 1).toString();
    let day = data.getDate().toString();
    if ( month.length === 1 ) {
      const nmonth = month;
      month = '0' + nmonth;
    }
    if ( day.length === 1 ) {
      const nday = day;
      day = '0' + nday;
    }
    return year + '-' + month + '-' + day;
  }

  isInTheFuture(data: Date): boolean {
    const now = new Date(Date.now());
    if (data > now ) {
      return true;
    }
    return false;
  }

  isInThePast(data: Date): boolean {
    const now = new Date(Date.now());
    if (data < now ) {
      return true;
    }
    return false;
  }

  isMoreThan(dataStart: Date, dataEnd: Date): boolean {
    if (dataStart > dataEnd) {
      return true;
    }
    return false;
  }

  addOneYear(data: string): string {
    const a = this.strToDate(data);
    a.setFullYear(a.getFullYear() + 1);
    a.setDate(a.getDate() - 1);
    return this.dateToString(a);
  }
}
