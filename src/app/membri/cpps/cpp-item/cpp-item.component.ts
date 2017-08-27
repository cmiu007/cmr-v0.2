import { Component, OnInit, Input } from '@angular/core';
import { Cpp } from '../../../shared/interfaces/cpps.interface';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { NomenclatorService } from '../../../services/nomenclator.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cpp-item',
  templateUrl: './cpp-item.component.html',
  styleUrls: ['./cpp-item.component.css']
})
export class CppItemComponent implements OnInit {

  @Input('cppCtrl')
  public cppCtrl: FormArray;

  @Input('cppData')
  public cppData: Cpp;

  regCpp;

  public cppForm: FormGroup;

  listaCpp = [];

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

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.cppForm = this.toFormGroup(this.cppData);
    this.regCpp = this._route.snapshot.data['regCpp'];
  }

  displayFnCpp(option) {
    if (option) {
        return this.regCpp.find( item => item.id === option).nume;
    }
  }

  toFormGroup(data: Cpp) {
    const formGroup = this._fb.group({
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
    // clean 0000-00-00
    Object.keys(this.cppData).forEach(
      key => {
        if (this.cppData[key] === '0000-00-00') {
          this.cppData[key] = '';
        }
      }
    );
    formGroup.patchValue(data);
    return formGroup;
  }
}
