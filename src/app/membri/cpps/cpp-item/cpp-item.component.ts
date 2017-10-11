import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';

import { Cpp } from '../../../shared/interfaces/cpps.interface';
import { NomenclatorService } from '../../../services/nomenclator.service';
import { MembriService } from '../../../services/membri.service';
import { FormValidatorsService } from '../../../services/form-validators.service';
import { CppNume, RegValue, RegValueString, CppTip, CppGrad, CppEmitent } from '../../../shared/models/registre.model';
import { RegCpp } from '../../../shared/interfaces/listacpp.interface';
import { CppsComponent } from '../cpps.component';
import { CppListComponent } from '../cpp-list/cpp-list.component';
import { ItemRegLista } from '../../../shared/interfaces/listareg.interface';
import { FormSetService } from '../../../services/form-set.service';
import { ApiDataService } from '../../../services/api-data.service';
import { ApiData } from '../../../shared/interfaces/message.interface';
import { AlertSnackbarService } from '../../../services/alert-snackbar.service';

@Component({
  selector: 'app-cpp-item',
  templateUrl: './cpp-item.component.html',
  styleUrls: ['./cpp-item.component.css']
})
export class CppItemComponent implements OnInit {

  @Input('cppsForm')
  public cppsForm: FormArray;

  @Input('cppFormData')
  public cppFormData: Cpp;

  isHidden = true;

  // Vechi:
  // 0 - new - all field are enabled - addBtn
  // 1 - admin - all fields are enabled - editBtn
  // 2 - edit - some of fields are enabled - editBtn
  // 3 - read-only - all fields are disabled - noBtn

  // formStatus:
  // 0 - admin - vine din local storage cmj -
  // 1 - read-only - vine din json
  // 2 - newCpp - vine din cale
  // 3 - edit - vine din json

  formStatus = 'ro'; // read - only
  isAdmin = false;
  isSpecialitate = false; // hide grad_prog_cpp_id
  formTitle: { nume: string, tip: string };
  formStatusActive = false;
  public cppForm: FormGroup;
  loading = false;

  @Input('registruCpp')
  registruCpp: CppNume[];
  filtruCpp: Observable<CppNume[]>;

  @Input('registruCppTip')
  registruCppTip: CppTip[];
  filtruCppTip: Observable<CppTip[]>;

  @Input('registruCppGrad')
  registruCppGrad: CppGrad[];
  filtruCppGrad: Observable<CppGrad[]>;

  @Input('registruCppEmitent')
  registruCppEmitent: CppEmitent[];
  filtruCppEmitent: Observable<CppEmitent[]>;

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _memService: MembriService,
    private _router: Router,
    private _formValidators: FormValidatorsService,
    private _formSet: FormSetService,
    private _apiData: ApiDataService,
    private _snackBar: AlertSnackbarService
  ) { }

  ngOnInit() {
    this.setForm();
    this.setFormStatus();
    this.setHeader();
    this.setFormFields();
    this.setRegistre();
    // TODO: set form type specialitateMedicala/nou sau altul pt grad cpp
    if (this.cppFormData.reg_cpp_tip_id === 2 || this.formStatus === 'new') {
      this.isSpecialitate = true;
    }
  }

  private setForm(): void {
    this.cppForm = this._formSet.cpp(this.cppFormData);
    this.cppsForm.controls['cpps'].push(this.cppForm);
  }

  private setFormStatus(): void {
    // daca nu are id_cpp este un form nou
    // daca este setat admin este admin
    //

    if (this.cppForm.get('id_cpp').value === null) {
      this.formStatus = 'new';
      this.isHidden = false;
      this.formStatusActive = true;
      return;
    }
    if (this.isAdmin === true) {
      this.formStatus = 'admin';
      this.formStatusActive = true;
      return;
    } else {
      if (this.cppFormData.date_end === '') {
        this.formStatus = 'edit';
        this.formStatusActive = true;
      }
    }
  }

  private setHeader(): void {
    if (this.formStatus === 'new') {
      this.formTitle = { nume: 'Inregistrare noua', tip: '' };
      return;
    }
    const cppTip = this.displayCppTip(this.cppForm.controls['reg_cpp_tip_id'].value);
    const cppNume = this.displayCpp(this.cppForm.controls['reg_cpp_id'].value);
    this.formTitle = { nume: cppNume, tip: cppTip };
  }

  private setFormFields(): void {
    // enable all fields

    switch (this.formStatus) {
      case 'admin':
        break;

      case 'ro':
        this.cppForm.disable();
        break;

      case 'new':
        break;

      case 'edit':
        const fieldsDisabled = ['reg_cpp_tip_id', 'reg_cpp_id', 'grad_prof_cpp_id', 'date_start'];
        fieldsDisabled.forEach(
          key => {
            this.cppForm.controls[key].disable();
          });
        break;

      default:
        break;
    }
  }

  private onSubmit(): void {
    if (this.cppForm.valid === false) {
      this._snackBar.showSnackBar('Formular Invalid');
      return;
    }
    this.loading = true;
    if (this.formStatus === 'new') {
      // TODO: de inlocuit const blah blah blah cu
      // delet formData.key
      // const newCppdata = this.cppForm.value;
      // delete newCppData.reg_cpp_id;
      const newCppData = {
        id_mem: sessionStorage.getItem('currentMemId'),
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
      this._apiData.apiAdauga('cpp', newCppData)
        .subscribe((response: ApiData) => {
          if (response.status === 0) {
            return;
          }
          CppsComponent.needReload.next();
          CppListComponent.addNewActive.next(true);
        });
    }
    // modifica cpp
    this._apiData.apiModifica('cpp', this.cppForm.get('id_cpp').value, this.cppForm.value)
      .subscribe((response: ApiData) => {
        this.loading = false;
        if (response.status === 0) {
          return;
        }
        return;
      });
  }

  checkRegTipId() {
    if (this.cppForm.get('reg_cpp_tip_id').value === null) {
      return;
    }
    if (this.cppForm.get('reg_cpp_tip_id').value !== 2) {
      this.cppForm.get('grad_prof_cpp_id').disable();
      this.cppForm.get('grad_prof_cpp_id').setValidators(null);
      return;
    }
    this.cppForm.get('grad_prof_cpp_id').enable();
    this.cppForm.get('grad_prof_cpp_id').setValidators([this._formValidators.checkIfNumber, Validators.required]);
  }

  private setRegistre(): void {
    // this.registruCpp = this._route.snapshot.data['regCpp'];
    this.filtruCpp = this.cppForm.get('reg_cpp_id').valueChanges
      .startWith(null)
      .map(cppNume => cppNume && typeof cppNume === 'object' ? cppNume.nume : cppNume)
      .map(name => name ? this.filterCpp(name) : this.registruCpp.slice());

    this.filtruCppTip = this.cppForm.get('reg_cpp_tip_id').valueChanges
      .startWith(null)
      .map(itemNume => itemNume && typeof itemNume === 'object' ? itemNume.nume : itemNume)
      .map(name => name ? this.filterCppTip(name) : this.registruCppTip.slice());

    this.filtruCppGrad = this.cppForm.get('grad_prof_cpp_id').valueChanges
      .startWith(null)
      .map(itemNume => itemNume && typeof itemNume === 'object' ? itemNume.nume : itemNume)
      .map(name => name ? this.filterCppGrad(name) : this.registruCppGrad.slice());

    this.filtruCppEmitent = this.cppForm.get('emitent').valueChanges
      .startWith(null)
      .map(itemNume => itemNume && typeof itemNume === 'object' ? itemNume.nume : itemNume)
      .map(name => name ? this.filterCppEmitent(name) : this.registruCppEmitent.slice());

  }

  private filterCpp(nume: string): CppNume[] {
    return this.registruCpp.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  private filterCppTip(nume: string): CppTip[] {
    return this.registruCppTip.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  private filterCppGrad(nume: string): CppGrad[] {
    return this.registruCppGrad.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  private filterCppEmitent(nume: string): CppEmitent[] {
    return this.registruCppEmitent.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  displayCpp(cppNume: number): string {
    if (cppNume) {
      return this.registruCpp.find(item => item.id === cppNume).nume;
    }
  }

  displayCppTip(id: number): string {
    if (id) {
      return this.registruCppTip.find(item => item.id === id).nume;
    }
  }

  displayCppGrad(id: number): string {
    if (id) {
      return this.registruCppGrad.find(item => item.id === id).nume;
    }
  }

  displayCppEmitent(id: string): string {
    if (id) {
      return this.registruCppEmitent.find(item => item.id === id).nume;
    }
  }

  private displayFnActiv() {
    if (this.cppFormData.date_end === '') {
      return 'Activ';
    } else {
      return 'Inactiv';
    }
  }
}
