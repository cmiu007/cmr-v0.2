import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Asigurator } from '../../../shared/models/registre.model';
import { ItemRegCpp } from '../../../shared/interfaces/listacpp.interface';
import { Cpp } from '../../../shared/interfaces/cpps.interface';

@Component({
  selector: 'app-asigurari-list',
  templateUrl: './asigurari-list.component.html',
  styleUrls: ['./asigurari-list.component.css']
})
export class AsigurariListComponent implements OnInit {

  @Input('avizareForm')
  public avizareForm;

  @Input('formStatus')
  public formStatus;

  registruAsiguratori: Asigurator[];
  registruCpp: ItemRegCpp[];
  cppData: Cpp;

  constructor(
    private _aRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.setRegistre();
  }

  setRegistre(): void {
    this.registruAsiguratori = this._aRoute.snapshot.data['regAsiguratori'];
    this.registruCpp = this._aRoute.snapshot.data['regCpp'];
  }

}
