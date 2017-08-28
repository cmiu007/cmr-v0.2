import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { MembriService } from '../../services/membri.service';
import { NumeCpp } from '../../shared/models/registre.model';
import { NomenclatorService } from '../../services/nomenclator.service';


@Component({
  selector: 'app-cpp',
  templateUrl: './cpp.component.html',
  styleUrls: ['./cpp.component.css']
})
export class CppComponent implements OnInit {
  loading = true;
  tempData: any;
  formCpps: FormGroup; //  de schimbat in form Array
  formStatus = 0;

  //  listaTipCpp = [];
  //  filtruTipCpp: Observable<Tip[]>;
  listaCppTip = [
    { id: 1, nume: 'Rezident' },
    { id: 2, nume: 'Specialitate Medicala' },
    { id: 3, nume: 'Supraspecializare' },
    { id: 4, nume: 'Competenta' },
    { id: 5, nume: 'Atestat de studii complementare' },
    { id: 6, nume: 'Abilitate' }
  ];

  listaGradCpp = [
    { id: 1, nume: 'Specialist' },
    { id: 2, nume: 'Primar' }
  ];

  listaEmitent = [
    { id: 'MS', nume: 'M.S.' },
    { id: 'AL', nume: 'Altul' }
  ];

  listaCpp = [];
  filtruCpp: Observable<NumeCpp[]>;


  constructor(
    private membriService: MembriService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MdSnackBar,
    private formBuilder: FormBuilder,
    private nomenclatorService: NomenclatorService
  ) {
    this.formCpps = formBuilder.group({
      cpp: formBuilder.array([])
    });
  }

  ngOnInit() {
    this.fillFormData();
    this.nomenclatorService.getNomenclator('cpp')
      .subscribe(data => this.listaCpp);
    //  populeaza liste dropdown
  }

  filterCpp(nume: string): NumeCpp[] {
    return this.listaCpp
      .filter(option => new RegExp(`^${nume}`, 'gi').test(option.nume));
  }

  fillFormData() {
    this.membriService.listaMembruDate('cpp', this.route.snapshot.params['id'])
      .subscribe(
      data => {
        if (data.result === '12') {
          this.snackbar.open(data.mesaj, 'inchide', { duration: 5000 });
          this.router.navigate(['/login']);
          //  TODO: trebuie sa se intoarca tot aici, vezi tutorial angular
        } else {
          for (let i = 0; i < data.length; i++) {
            this.genNewCppForm(data[i]);
          }
          console.log(this.formCpps.get('cpp'));
        }
        this.loading = false;

      }
      );
  }

  genNewCppForm(formData) {
    const newCpp = this.formBuilder.group({
      'id_cpp': [{ value: '', disabled: true }], // 212,
      'id_mem': [{ value: '', disabled: true }], // 126,
      'reg_cpp_tip_id': [{ value: '' }], // 2,
      'reg_cpp_id': [{ value: '' }], // 1034,
      'grad_prof_cpp_id': [{ value: '' }], // 1,
      'date_start': [{ value: '', disabled: true }], // '2007-12-01',
      'date_end': [{ value: '', disabled: true }], // '0000-00-00',
      'emitent': [{ value: '' }], // 'MS',
      'act_serie': [{ value: '', disabled: true }], // 'ZX',
      'act_numar': [{ value: '', disabled: true }], // 1234,
      'act_data': [{ value: '', disabled: true }], // '2008-01-08',
      'act_descriere': [{ value: '', disabled: true }], // '',
      'obs': [{ value: '', disabled: true }], // 'nu are',
      'updated': [{ value: '', disabled: true }], // '2017-04-08 09:59:32',
      'ro': [{ value: '', disabled: true }], // 'false'
    });
    newCpp.patchValue(formData);
    (<FormArray>this.formCpps.get('cpp')).push(newCpp);
  }

  displayFnCpp(option) {
    console.log('option:');
    console.log(this.listaCpp);
    //  if (option) {
    //    return this.listaCpp.find(item => item.id === option).nume;
    //  }
    return 'test';
  }

  setFormMode() {
    //  TODO: toate CPP vin cu 'ro' = 'false'
    //  if(this.formCpps.get('ro').value === 'false') {
    //    Object.keys(this.formCpps.controls).forEach(key => {
    //        this.formCpps.get(key).enable();
    //      })
    //  }
    if (this.formCpps.get('ro').value === 'false') {
      Object.keys(this.formCpps.controls).forEach(key => {
        this.formCpps.get(key).enable();
      });
    }
  }


  log() {
    console.log(this.formCpps);
  }

}
