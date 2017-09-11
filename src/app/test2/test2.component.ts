import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

// import { GlobalDataService } from '../services/global-data.service';

import { NomenclatorService } from '../services/nomenclator.service';
import { CppNume } from '../shared/models/registre.model';
import { RegCpp } from '../shared/interfaces/listacpp.interface';

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.css']
})
export class Test2Component implements OnInit {
  myControl = new FormControl();
  filteredNumeCpp: Observable<CppNume[]>;
  regCpp: CppNume[];

  constructor(
    // private nomeclatorService: NomenclatorService,
    // private globalVar: GlobalDataService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.globalVar.shareObj['global'] = 'data';
    // console.log(this.globalVar.shareObj['apiAdress']);
    this.regCpp = this._route.snapshot.data['regCpp'];
    this.filteredNumeCpp = this.myControl.valueChanges
      .startWith(null)
      .map(cppNume => cppNume && typeof cppNume === 'object' ? cppNume.nume : cppNume)
      .map(name => name ? this.filterRegCpp(name) : this.regCpp.slice());
    // this.myControl.setValue(1101);
  }

  filterRegCpp(name: string): CppNume[] {
    return this.regCpp.filter(option => new RegExp(`${name}`, 'gi').test(option.nume));
  }

  displayRegCpp(numeCpp): string {
    if (numeCpp) {
      return this.regCpp.find(item => item.id === +numeCpp).nume;
    }
  }
}
