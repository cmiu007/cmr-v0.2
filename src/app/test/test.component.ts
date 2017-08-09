import { Component, OnInit } from '@angular/core';
import {  FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { NomenclatorService } from '../services/nomenclator.service';
import { Judet } from '../shared/models/registre.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent implements OnInit {
  myControl: FormControl;
  judete = [];
  filteredOptions: Observable<Judet[]>;

  constructor( private nomeclatorService: NomenclatorService ) { }

  ngOnInit() {
    this.myControl = new FormControl();
    this.nomeclatorService.getNomenclator('jud')
      .subscribe( data => {
        // TODO: de scos Buc Sectoare din lista
        // acelasi lucru sa fie facut dinamic si pt CPP
        this.judete = data
        .filter(option => option.nume !== 'ADM' )
        .filter(option => option.nume !== 'CMR' )
        .filter(option => option.nume !== new RegExp(`Alb`, 'gm'));
      });
    this.filteredOptions = this.myControl.valueChanges
      .startWith(null)
      .map( judet => judet && typeof judet === 'object' ? judet.nume : judet)
      .map( nume => nume ? this.filter(nume) : this.judete.slice())
  }

  filter(nume: string): Judet[] {
    return this.judete
        .filter(option => new RegExp(`^${nume}`, 'gi').test(option.nume));
  }

  show() {
    console.log(this.myControl.value);
  }

displayFn(judet) {
    if (judet) {
      let selected = this.judete.find(item => item.id === +judet)
      // console.log('judet : ' + judet);
      // console.log('selected : ' + selected.nume);
      // console.log(this.judete.includes(judet));
      // return selected.nume;
      return this.judete.find(item => item.id === +judet).nume
    }
  }

  resetValue(formName: FormControl) {
    formName.patchValue('');
  }

  // de folosit inainte de submit pt inlocuirea obiectului cu id-ul
  patch(formName: FormControl) {
    formName.patchValue('102');
  }

}
