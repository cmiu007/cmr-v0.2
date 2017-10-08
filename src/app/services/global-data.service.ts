import { Injectable } from '@angular/core';

interface SharedObj {
  [id: string]: any;
}

@Injectable()
export class GlobalDataService {

  constructor() { }

  shareObj: SharedObj = {
    'apiAdress': 'https://devel-api.cmr.ro/',
    'site': 'https://test-rm.cmr.ro',
    'genPDFAddress': 'https://test-rm.cmr.ro/assets/',
    'Titlu Aplicatie': 'Devel RegMed',

    // 'userName': '',
    // 'userGroup': '',
    // 'activeMember': ''
  };
}
