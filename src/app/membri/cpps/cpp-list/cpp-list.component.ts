import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Cpp } from '../../../shared/interfaces/cpps.interface';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-cpp-list',
  templateUrl: './cpp-list.component.html',
  styleUrls: ['./cpp-list.component.css']
})
export class CppListComponent implements OnInit {
  @Input('formCpps')
  public formCpps: FormGroup;

  @Input('cppFormData')
  public cppFormData: Cpp[];

  @Input('regCpp')
  public regCpp;

  addActive = true;

  constructor(
    private _cd: ChangeDetectorRef,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.formCpps.addControl('cpps', new FormArray([]));
  }

  addCpp() {
    const newCpp: Cpp = {
      'id_cpp': null, // 212,
      'id_mem': null, // 126,
      'reg_cpp_tip_id': null, // 2,
      'reg_cpp_id': null, // 1034,
      'grad_prof_cpp_id': null, // 1,
      'date_start': '', // '2007-12-01',
      'date_end': '', // '0000-00-00',
      'emitent': '', // 'MS',
      'act_serie': '', // 'ZX',
      'act_numar': '', // 1234,
      'act_data': '', // '2008-01-08',
      'act_descriere': '', // '',
      'obs': '', // 'nu are',
      'updated': '', // '2017-04-08 09:59:32',
      'ro': '', // 'false'
    };
    this.cppFormData.unshift(newCpp);
    this._cd.detectChanges();
    this.addActive = false;
    return false;
  }
}
