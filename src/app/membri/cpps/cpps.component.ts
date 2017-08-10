import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Cpp } from '../../shared/interfaces/cpps.interface';
import { MembriService } from '../../services/membri.service';
import { NumeCpp } from '../../shared/models/registre.model';
import { NomenclatorService } from '../../services/nomenclator.service';

@Component({
  selector: 'app-cpps',
  templateUrl: './cpps.component.html',
  styleUrls: ['./cpps.component.css']
})
export class CppsComponent implements OnInit {
  loading = true;
  formCpps: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _memService: MembriService,
    private _aRoute: ActivatedRoute,
    private _router: Router,
    private _snack: MdSnackBar
  ) { }

  ngOnInit() {
    this.formCpps = this._fb.group({
      cpps: this._fb.array([
        // this.initCpps()
      ])
    });
    this.getFormCppData();
    // get form data
    // get autocomplete data
    // this.loading = false;
  }

  getFormCppData() {
    this._memService.listaMembruDate('cpp', this._aRoute.snapshot.params['id'])
      .subscribe(
        data => {
          if (data.result === '12') {
            this._snack.open( data.mesaj, 'inchide', {duration: 5000});
            this._router.navigate(['/login']);
          } else {
            for (let i = 0; i < data.length; i++) {
              // this.initCpps(data[i]);
              const control = <FormArray>this.formCpps.controls['cpps'];
              control.push(this.initCpps());
              control.patchValue(data);
            }
          }
        }
      );
      this.loading = false;
  }

  initCpps() {
    return this._fb.group({
        'id_cpp': [{ value: '' }], // 212,
        'id_mem': [{ value: '' }], // 126,
        'reg_cpp_tip_id': [{ value: ''}], // 2,
        'reg_cpp_id': [{ value: ''}], // 1034,
        'grad_prof_cpp_id': [{ value: ''}], // 1,
        'date_start': [{ value: '' }], // '2007-12-01',
        'date_end': [{ value: '' }], // '0000-00-00',
        'emitent': [{ value: ''}], // 'MS',
        'act_serie': [{ value: '' }], // 'ZX',
        'act_numar': [{ value: '' }], // 1234,
        'act_data': [{ value: '' }], // '2008-01-08',
        'act_descriere': [{ value: '' }], // '',
        'obs': [{ value: '' }], // 'nu are',
        'updated': [{ value: '' }], // '2017-04-08 09:59:32',
        'ro': [{ value: '' }], // 'false'
    });
  }

  addCpp() {
    const control = <FormArray>this.formCpps.controls['cpps'];
    // control.push(this.initCpps('a'));
  }

  removeCpp(i: number) {
    const control = <FormArray>this.formCpps.controls['cpps'];
    control.removeAt(i);
  }

  save(model: Cpp) {
    console.log(this.formCpps);
  }

}
