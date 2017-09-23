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

  constructor(
  ) { }

  ngOnInit() {
  }

}
