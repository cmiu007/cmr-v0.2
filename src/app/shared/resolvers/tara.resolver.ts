import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { NomenclatorService } from '../../services/nomenclator.service';

import { RegLista } from '../interfaces/listareg.interface';

@Injectable()
export class TaraResolve implements Resolve<RegLista> {

  constructor(
    private _nomenclator: NomenclatorService,
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this._nomenclator.getNomenclator('tara');
 }
}
