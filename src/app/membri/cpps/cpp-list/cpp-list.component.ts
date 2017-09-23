import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Cpp } from '../../../shared/interfaces/cpps.interface';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import { FormSetService } from '../../../services/form-set.service';
import { CppTip, CppGrad, CppEmitent } from '../../../shared/models/registre.model';

@Component({
  selector: 'app-cpp-list',
  templateUrl: './cpp-list.component.html',
  styleUrls: ['./cpp-list.component.css']
})
export class CppListComponent implements OnInit {
  // child notifies if new add is finished
  public static addNewActive: Subject<boolean> = new Subject();

  @Input('cppFormData')
  public cppFormData: Cpp[];

  public formCpps: FormGroup;

  public registruCpp;

  public registruCppTip: CppTip[] = [
    { id: 1, nume: 'Rezident' },
    { id: 2, nume: 'Specialitate Medicala' },
    { id: 3, nume: 'Supraspecializare' },
    { id: 4, nume: 'Competenta' },
    { id: 5, nume: 'Atestat de studii complementare' },
    { id: 6, nume: 'Abilitate' }
  ];

  public registruCppGrad: CppGrad[] = [
    { id: 1, nume: 'Specialist' },
    { id: 2, nume: 'Primar' }
  ];

  public   registruCppEmitent: CppEmitent[] = [
    { id: 'MS', nume: 'Ministerul Sanatatii' },
    { id: 'AL', nume: 'Alt Emitent' }
  ];

  addActive = true;

  constructor(
    private _cd: ChangeDetectorRef,
    private _rounterSnapshot: ActivatedRoute,
    private _formSet: FormSetService,


    private _fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.registruCpp = this._rounterSnapshot.snapshot.data['regCpp'];
    this.setForm();
    CppListComponent.addNewActive.subscribe(res => {
      this.addActive = res;
    });
  }

  private setForm(): void {
    this.formCpps = this._formSet.cpps('initFormCpps', null, this.formCpps);
    // TODO; de revazut daca nu il putem baga in serviciul de mai sus
    this.formCpps.addControl('cpps', new FormArray([]));
  }

  addCpp() {
    const newCppData: Cpp = {
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
    this.cppFormData.unshift(newCppData);
    this._cd.detectChanges();
    this.addActive = !this.addActive;
    return false;
  }
}
