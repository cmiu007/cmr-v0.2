import { Injectable } from '@angular/core';

interface SharedObj {
  [id: string]: any;
}

@Injectable()
export class GlobalDataService {

  constructor() { }

  shareObj: SharedObj = {
    'apiAdress': 'https://devel-api.cmr.ro/',
    'userName': 'Gigu'
  }

}
