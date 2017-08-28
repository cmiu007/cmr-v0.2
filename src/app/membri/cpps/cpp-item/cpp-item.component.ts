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

  // formStatus:
  // 0 - new - all field are enabled - addBtn
  // 1 - admin - all fields are enabled - editBtn
  // 2 - edit - some of fields are enabled - editBtn
  // 3 - read-only - all fields are disabled - noBtn
  // TODO: de implementat roluri pt dezvoltarea ulterioara
  formStatus = 0; // new form
  isAdmin = false;
  isSpecialitate = true; // hide grad_prog_cpp_id
  regCpp;

  public cppForm: FormGroup;

  listaCpp = [];

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

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.cppForm = this.toFormGroup(this.cppData);
    this.regCpp = this._route.snapshot.data['regCpp'];
    // TODO: set form type ro/rw/admin
    this.setFormStatus();
    this.setFormFields();
    // TODO: set form type specialitateMedicala/altul
    if (this.cppData.reg_cpp_tip_id !== 2) {
      this.isSpecialitate = false;
    }
  }

  displayFnCpp(option) {
    if (option) {
      return this.regCpp.find(item => item.id === option).nume;
    }
  }

  displayFn(option, reg) {
    if (reg === 'cppTip') {
      if (option) {
        return this.listaCppTip.find(item => item.id === option).nume;
      }
    }
    if (reg === 'cppGrad') {
      if (option) {
        return this.listaGradCpp.find(item => item.id === option).nume;
      }
    }
    return 'Not Found';
  }

  displayFnActiv() {
    if (this.cppData.date_end === '') {
      return 'Activ';
    } else {
      return 'Inactiv';
    }
  }

  toFormGroup(data: Cpp) {
    const formGroup = this._fb.group({
      'id_cpp': [{ value: '' }], // 212,
      'id_mem': [{ value: '' }], // 126,
      'reg_cpp_tip_id': [{ value: '' }], // 2,
      'reg_cpp_id': [{ value: '' }], // 1034,
      'grad_prof_cpp_id': [{ value: '' }], // 1,
      'date_start': [{ value: '' }], // '2007-12-01',
      'date_end': [{ value: '' }], // '0000-00-00',
      'emitent': [{ value: '' }], // 'MS',
      'act_serie': [{ value: '' }], // 'ZX',
      'act_numar': [{ value: '' }], // 1234,
      'act_data': [{ value: '' }], // '2008-01-08',
      'act_descriere': [{ value: '' }], // '',
      'obs': [{ value: '' }], // 'nu are',
      'updated': [{ value: '' }], // '2017-04-08 09:59:32',
      'ro': [{ value: '' }], // 'false'
    });
    // clean 0000-00-00 and 0
    Object.keys(this.cppData).forEach(
      key => {
        if (this.cppData[key] === '0000-00-00' || this.cppData[key] === 0 ) {
          this.cppData[key] = '';
        }
      }
    );
    // this.tipCpp = this.displayFn();
    formGroup.patchValue(data);
    // this.cppCtrl.push(formGroup);
    return formGroup;
  }

  setFormStatus() {
    if (this.isAdmin === true) {
      this.formStatus = 1;
    } else {
      if (this.cppData.date_end === '') {
        this.formStatus = 2;
      } else {
        this.formStatus = 3;
      }
    }
  }

  setFormFields() {
    switch (this.formStatus) {
      case 0:
        break;

      case 1:
        break;

      case 2:
        const fieldsDisabled = [ 'reg_cpp_tip_id', 'reg_cpp_id', 'grad_prof_cpp_id', 'date_start'];
        fieldsDisabled.forEach(
          key => {
            this.cppForm.controls[key].disable() ;
          }
        );
        // this.cppForm.controls['reg_cpp_tip_id'].disable();
        // console.log(this.cppForm.controls['reg_cpp_tip_id'].value) ;
        break;

      case 3:
        this.cppForm.disable();
        // Object.keys(this.cppForm.controls).forEach(
        //   key => {
        //     this.cppForm.controls[key].disable() ;
        //   }
        // );

        break;

      default:
        break;
    }
  }

  onClick() {
    console.log(this.cppForm);
  }
}
