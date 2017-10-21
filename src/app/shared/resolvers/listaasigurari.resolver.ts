import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ApiDataService } from '../../services/api-data.service';

import { Asigurare } from '../interfaces/asigurari.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ListaAsigurari implements Resolve<Asigurare[]> {

  constructor(
    private _apiData: ApiDataService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any>|Promise<any>|any {
    // luam din route id-ul membrului
    const idMem = route.params.id;
    return this._apiData.apiLista('asigurare', idMem);
  }
}
