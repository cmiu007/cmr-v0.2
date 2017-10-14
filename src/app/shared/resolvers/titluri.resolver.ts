import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { NomenclatorService } from '../../services/nomenclator.service';

import { RegTitluri } from '../interfaces/titluri.interface';

@Injectable()
export class TitluriResolve implements Resolve<RegTitluri> {

  constructor(
    private _nomenclator: NomenclatorService,
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this._nomenclator.getNomenclator('titluri');
 }
}
