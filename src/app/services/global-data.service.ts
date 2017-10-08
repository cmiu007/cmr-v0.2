import { Injectable } from '@angular/core';

interface SharedObj {
  [id: string]: any;
}

@Injectable()
export class GlobalDataService {

  constructor() { }

  shareObj: SharedObj = {
    'apiAdress': 'https://api.cmr.ro/',
    'genPDFAddress': 'https://rm.cmr.ro/assets/'
    // 'userName': '',
    // 'userGroup': '',
    // 'activeMember': ''
  };
}
