import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Cpp, Cpps } from '../../shared/interfaces/cpps.interface';
import { RegCpp, ItemRegCpp} from '../../shared/interfaces/listacpp.interface';
import { MembriService } from '../../services/membri.service';
import { NumeCpp } from '../../shared/models/registre.model';
import { NomenclatorService } from '../../services/nomenclator.service';

@Component({
  selector: 'app-cpps',
  templateUrl: './cpps.component.html',
  styleUrls: ['./cpps.component.css']
})
export class CppsComponent implements OnInit, AfterViewInit {
  public formCpps: FormGroup;
  public formData: Cpps;

  loading = true;
  formStatus = 0;

  listaCppTip = [
    { id: 1, nume: 'Rezident'},
    { id: 2, nume: 'Specialitate Medicala'},
    { id: 3, nume: 'Supraspecializare'},
    { id: 4, nume: 'Competenta'},
    { id: 5, nume: 'Atestat de studii complementare'},
    { id: 6, nume: 'Abilitate'}
  ];

    listaGradCpp = [
    { id: 1, nume: 'Specialist'},
    { id: 2, nume: 'Primar'}
  ];

  listaEmitent = [
    { id: 'MS', nume: 'M.S.'},
    { id: 'AL', nume: 'Altul'}
  ];

  // TODO: de facut interface pt listaCpp?
  itemRegCpp: ItemRegCpp[];
  filtruCpp: Observable<ItemRegCpp[]>;

  constructor(
    private _fb: FormBuilder,
    private _memService: MembriService,
    private _aRoute: ActivatedRoute,
    private _router: Router,
    private _snack: MdSnackBar,
    private _nomenclator: NomenclatorService
  ) { }

  ngOnInit() {
    this.formCpps = this.toFormGroup();
    this.getFormCppData();
    // this.formCpps = this._fb.group({
    //   cpps: this._fb.array([
    //     // this.initCpps()
    //   ])
    // });
    // this.formCpps = this.toFormGroup(this.formData);
    this._nomenclator.getNomenclator('cpp')
      .subscribe(data => {
        this.itemRegCpp = data;
      });
  }

  ngAfterViewInit() {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
  }

  getFormCppData() {
    this._memService.listaMembruDate('cpp', this._aRoute.snapshot.params['id'])
      .subscribe(
        data => {
          if (data.result === '12') {
            this._snack.open( data.mesaj, 'inchide', {duration: 5000});
            this._router.navigate(['/login']);
          } else {
            this.formData = data;
            // for (let i = 0; i < data.length; i++) {
            //   // this.initCpps(data[i]);
            //   const control = <FormArray>this.formCpps.controls['cpps'];
            //   control.push(this.initCpps());
            //   control.patchValue(data);
            // }
            this.loading = false;
          }
        }
      );
  }

  // private toFormGroup(data: Cpps): FormGroup {
  toFormGroup() {
    const formGroup = this._fb.group({
      cpps: this._fb.array([
        // this.initCpps(data)
      ])
    });
    return formGroup;
  }

  initCpps(data: Cpps): FormGroup {
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

  filterCpp(nume: string) {
    // return this.itemRegCpp
    //   .filter(option => new RegExp(`^${nume}`, 'gi').test(option.nume));
    // this.filtruCpp = this.formCpps.controls.Cpps.valueChanges
    //   .startWith(null)
    //   .map(nume => nume ? this.filtruCpp(nume): this.listaCpp.slice());
  }

  displayFnCpp(option: number) {
    if (option) {
      return this.itemRegCpp.find(item => item.id === option).nume;
    }
  }

  setFormMode() {
    return;
  }

  save(model: Cpp) {
    console.log(this.formCpps);
  }

}
