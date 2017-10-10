import { Component, OnInit, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

import { FormSetService } from '../../../services/form-set.service';
import { Asigurator } from '../../../shared/models/registre.model';
import { Avizare } from '../../../shared/interfaces/avizari.interface';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-avizari-list',
  templateUrl: './avizari-list.component.html',
  styleUrls: ['./avizari-list.component.css']
})
export class AvizariListComponent implements OnInit {
  public static addActiveSubj: Subject<boolean> = new Subject;

  @Input('formAvizari')
  public formAvizari;


  addActive = true;

  constructor(
    private _formSet: FormSetService
  ) { }

  ngOnInit() {
    // this.formAvizari.addControl('avizari', new FormArray([]));
    AvizariListComponent.addActiveSubj
      .subscribe( result => this.addActive = !this.addActive);
  }

  addAvizare() {
    const newAvizareForm = this._formSet.avizare(null);
    const arrayControl: FormArray = this.formAvizari.get('avizari');
    arrayControl.insert(0, newAvizareForm);
    this.addActive = !this.addActive;
  }
}
