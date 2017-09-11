import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { NomenclatorService } from '../../services/nomenclator.service';
import { RegFac } from '../interfaces/fac.interface';

@Injectable()
export class FacResolve implements Resolve<RegFac> {
  constructor(
    private _nomeclator: NomenclatorService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this._nomeclator.getNomenclator('facultate');
  }
}
