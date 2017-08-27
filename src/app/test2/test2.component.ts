import { Component, OnInit } from '@angular/core';
import {  FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { GlobalDataService } from '../services/global-data.service';

import { NomenclatorService } from '../services/nomenclator.service';
import { Judet } from '../shared/models/judet.model';

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.css']
})
export class Test2Component implements OnInit {
  myControl: FormControl;
  options = [];
  filteredOptions: Observable<Judet[]>;
  cpp;

  constructor(
    private nomeclatorService: NomenclatorService,
    private globalVar: GlobalDataService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.globalVar.shareObj['global'] = 'data';
    // console.log(this.globalVar.shareObj['apiAdress']);
    this.cpp = this._route.snapshot.data['regCpp'];
    console.log(this.cpp);
  }

  show() {
    console.log(this.myControl.value);
  }

}
