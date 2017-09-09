import { Component, OnInit, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

import { FormSetService } from '../../../services/form-set.service';
import { Asigurator } from '../../../shared/models/registre.model';
import { Avizare } from '../../../shared/interfaces/avizari.interface';

@Component({
  selector: 'app-avizari-list',
  templateUrl: './avizari-list.component.html',
  styleUrls: ['./avizari-list.component.css']
})
export class AvizariListComponent implements OnInit {
  @Input('formAvizariData')
  public formAvizariData: Avizare[];

  @Input('formAvizari')
  public formAvizari;

  @Input ('registruAsiguratori')
  public registruAsiguratori: Asigurator[];

  addActive = true;

  constructor(
    private _formSet: FormSetService
  ) { }

  ngOnInit() {
    this.formAvizari.addControl('avizari', new FormArray([]));
  }

  addAvizare() {
    // const newAvizareData = this._formSet.avizare(null).value;
    this.formAvizariData.unshift({});
    this.addActive = !this.addActive;
  }
}
