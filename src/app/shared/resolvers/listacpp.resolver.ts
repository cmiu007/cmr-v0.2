import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ApiDataService } from '../../services/api-data.service';

import { Cpp } from '../interfaces/cpps.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ListaCpp implements Resolve<Cpp[]> {

  constructor(
    private _apiData: ApiDataService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any>|Promise<any>|any {
    // luam din route id-ul membrului
    const idMem = route.params.id;
    return this._apiData.apiLista('cpp', idMem);
  }
}
