import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';

import { Cpp } from '../../../shared/interfaces/cpps.interface';
import { NomenclatorService } from '../../../services/nomenclator.service';
import { MembriService } from '../../../services/membri.service';
import { NumeCpp } from '../../../shared/models/registre.model';
import { RegCpp } from '../../../shared/interfaces/listacpp.interface';
import { CppsComponent } from '../cpps.component';
import { CppListComponent } from '../cpp-list/cpp-list.component';

@Component({
  selector: 'app-cpp-item',
  templateUrl: './cpp-item.component.html',
  styleUrls: ['./cpp-item.component.css']
})
export class CppItemComponent implements OnInit {

  @Input('cppCtrl')
  public cppCtrl: FormArray;

  @Input('cppItem')
  public cppItem: Cpp;

  isHidden = true;

  // formStatus:
  // 0 - new - all field are enabled - addBtn
  // 1 - admin - all fields are enabled - editBtn
  // 2 - edit - some of fields are enabled - editBtn
  // 3 - read-only - all fields are disabled - noBtn
  // TODO: de implementat roluri pt dezvoltarea ulterioara
  formStatus = 0; // new form
  isAdmin = false;
  isSpecialitate = false; // hide grad_prog_cpp_id
  filteredNumeCpp: Observable<NumeCpp[]>;
  regCpp: NumeCpp[];
  formTitle: string;

  public cppForm: FormGroup;


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
    private _route: ActivatedRoute,
    private _memService: MembriService,
    private _snackBar: MdSnackBar,
    private _router: Router
  ) { }

  ngOnInit() {
    this.cppForm = this.toFormGroup(this.cppItem);
    this.regCpp = this._route.snapshot.data['regCpp'];
    this.setFormStatus();
    this.setFormFields();
    this.setFormTitle();
    // TODO: set form type specialitateMedicala/nou sau altul pt grad cpp
    if (this.cppItem.reg_cpp_tip_id === 2 || this.formStatus === 0) {
      this.isSpecialitate = true;
    }
    // console.log(this.cppForm.get('reg_cpp_id').valueChanges);
    // console.log(this.cppForm);
    this.filteredNumeCpp = this.cppForm.get('reg_cpp_id').valueChanges
      .startWith(null)
      .map(cppNume => cppNume && typeof cppNume === 'object' ? cppNume.nume : cppNume)
      .map(name => name ? this.filterCpp(name) : this.regCpp.slice());
  }

  filterCpp(nume: string): NumeCpp[] {
    return this.regCpp.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  displayFnCpp(numeCpp: number): string {
    if (numeCpp) {
      return this.regCpp.find(item => item.id === numeCpp).nume;
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
    if (this.cppItem.date_end === '') {
      return 'Activ';
    } else {
      return 'Inactiv';
    }
  }

  toFormGroup(data: Cpp) {
    const formGroup = this._fb.group({
      'id_cpp': [{ value: '' }], // 212,
      'id_mem': [{ value: '' }], // 126,
      'reg_cpp_tip_id': [{ value: '' }, [this.checkIfNumber, Validators.required]], // 2,
      'reg_cpp_id': [{ value: '' }, [this.checkIfNumber, Validators.required]], // 1034,
      'grad_prof_cpp_id': [{ value: '' }, [this.checkIfNumber]], // 1,
      'date_start': [{ value: '' }, [Validators.required, this.checkDate]], // '2007-12-01',
      'date_end': [{ value: '' }, [this.checkDate]], // '0000-00-00',
      'emitent': [{ value: '' }, [Validators.required]], // 'MS',
      'act_serie': [{ value: '' }], // 'ZX',
      'act_numar': [{ value: '' }], // 1234,
      'act_data': [{ value: '' }], // '2008-01-08',
      'act_descriere': [{ value: '' }], // '',
      'obs': [{ value: '' }], // 'nu are',
      'updated': [{ value: '' }], // '2017-04-08 09:59:32',
      'ro': [{ value: '' }], // 'false'
    });
    // clean 0000-00-00 and 0
    Object.keys(this.cppItem).forEach(
      key => {
        if (this.cppItem[key] === '0000-00-00' || this.cppItem[key] === 0) {
          this.cppItem[key] = '';
        }
      }
    );
    // this.tipCpp = this.displayFn();
    formGroup.patchValue(data);
    this.cppCtrl['cpps'].controls.push(formGroup);
    return formGroup;
  }

  setFormStatus() {
    if (this.cppForm.get('id_cpp').value === null) {
      this.formStatus = 0;
      this.isHidden = false;
      return false;
    }
    if (this.isAdmin === true) {
      this.formStatus = 1;
      return false;
    } else {
      if (this.cppItem.date_end === '') {
        this.formStatus = 2;
      } else {
        this.formStatus = 3;
      }
    }
  }

  setFormTitle(): void {
    if (this.formStatus === 0) {
      this.formTitle = 'Inregistrare noua';
      return;
    }
    const cppTip = this.displayFn(this.cppForm.controls['reg_cpp_tip_id'].value, 'cppTip');
    const cppNume = this.displayFnCpp(this.cppForm.controls['reg_cpp_id'].value);
    this.formTitle = cppNume + ' - ' + cppTip;
  }
  setFormFields() {
    switch (this.formStatus) {
      case 0:
        break;

      case 1:
        break;

      case 2:
        const fieldsDisabled = ['reg_cpp_tip_id', 'reg_cpp_id', 'grad_prof_cpp_id', 'date_start'];
        fieldsDisabled.forEach(
          key => {
            this.cppForm.controls[key].disable();
          }
        );
        break;

      case 3:
        this.cppForm.disable();
        break;

      default:
        break;
    }
  }

  onClickCpp(): void {
    if (this.formStatus === 0) {
      const newCppData = {
        id_mem: localStorage.getItem('currentMemId'),
        reg_cpp_tip_id: this.cppForm.get('reg_cpp_tip_id').value,
        reg_cpp_id: this.cppForm.get('reg_cpp_id').value,
        grad_prof_cpp_id: this.cppForm.get('grad_prof_cpp_id').value,
        date_start: this.cppForm.get('date_start').value,
        date_end: this.cppForm.get('date_end').value,
        emitent: this.cppForm.get('emitent').value,
        act_serie: this.cppForm.get('act_serie').value,
        act_numar: this.cppForm.get('act_numar').value,
        act_data: this.cppForm.get('act_data').value,
        act_descriere: this.cppForm.get('act_descriere').value,
        obs: this.cppForm.get('obs').value
      };
      this._memService.adaugaMembruDate('cpp', newCppData)
        .subscribe(
        data => {
          if (data.result !== '00') {
            this._snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
            if (data.result === '12') {
              this._router.navigate(['/login']);
            }
          } else {
            this._snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
            // CppListComponent.addActive = true;
            CppsComponent.returned.next('test');
            CppListComponent.addNewActive.next(true);
          }
        }
      );
      return;
    }
    // modifica cpp
    this._memService.modificaMembruDate('cpp', this.cppForm.get('id_cpp').value, this.cppForm.value)
    .subscribe(
      data => {
        if (data.result !== '00') {
          this._snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
          if (data.result === '12') {
            this._router.navigate(['/login']);
          }
        } else {
          this._snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
        }
      }
      );
    return;
    // TO DO: de facut reload
  }

  checkDate(control: FormGroup): { [s: string]: boolean } {
    // check if null pt cazul in care nu este required
    if (control.value === '') {
      return null;
    }
    const validateDateISO =
      /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/i;
    return validateDateISO.test(control.value) ? null : { 'invalidDateFormat': true };
    // TODO: check if date is in the past or in the future
    // let today = new Date();
    // let formDate = new Date(control.value);
    // if (today > formDate ) {
    //   console.log('Date is in the past');
    // } else {
    //   console.log('Date is in the future');
    // }
  }

  checkIfNumber(control: FormGroup): { [s: string]: boolean} {
    // TODO: de pus si in form date personale
    if (control.value === '') {
      return null;
    }
    if (isNaN(control.value)) {
      return { 'invalidId': true};
    }
    return null;
  }

  checkRegTipId() {
    if (this.cppForm.get('reg_cpp_tip_id').value === null ) {
      return;
    }
    if ( this.cppForm.get('reg_cpp_tip_id').value !== 2 ) {
      console.log('not specialitate');
      this.cppForm.get('grad_prof_cpp_id').disable();
      return;
    }
    this.cppForm.get('grad_prof_cpp_id').enable();
  }
}
