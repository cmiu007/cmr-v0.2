import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { NomenclatorService } from '../../services/nomenclator.service';

import { RegCpp } from '../interfaces/listacpp.interface';

@Injectable()
export class CppResolve implements Resolve<RegCpp> {

  constructor(
    private _nomenclator: NomenclatorService,
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this._nomenclator.getNomenclator('cpp');
 }
}
