import { Component, OnInit, Input } from '@angular/core';
import { Asigurator } from '../../../shared/models/registre.model';
import { ItemRegCpp } from '../../../shared/interfaces/listacpp.interface';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormArray } from '@angular/forms';
import { FormSetService } from '../../../services/form-set.service';
import { DataCalService } from '../../../services/data-cal.service';
import { ApiDataService } from '../../../services/api-data.service';
import { AlertSnackbarService } from '../../../services/alert-snackbar.service';
import { Router } from '@angular/router';
import { ApiData } from '../../../shared/interfaces/message.interface';
import { ItemRegLista } from '../../../shared/interfaces/listareg.interface';
import { Cpp } from '../../../shared/interfaces/cpps.interface';

@Component({
  selector: 'app-asigurare',
  templateUrl: './asigurare.component.html',
  styleUrls: ['./asigurare.component.css']
})
export class AsigurareComponent implements OnInit {
  @Input('arrayIndex')
  public arrayIndex;

  @Input('avizareForm')
  public avizareForm;

  @Input('registruAsiguratori')
  public registruAsiguratori: Asigurator[];

  @Input('registruCpp')
  public registruCpp: ItemRegCpp[];

  public cppData: Cpp;

  // TODO: de luat cu api
  public registruCppGrad: ItemRegLista[] = [
    { id: 1, nume: 'Specialist' },
    { id: 2, nume: 'Primar' }
  ];

  public registruCppGrp: ItemRegLista[] = [
    { id: 1, nume: 'Specialități MEDICALE' },
    { id: 2, nume: 'Specialități CHIRURGICALE' },
    { id: 3, nume: 'Specialități PARACLINICE' },
    { id: 4, nume: 'Nu există grup pentru această specialitate' },
  ];

  public registruAvizareTip: ItemRegLista[] = [
    { id: 1, nume: 'Full' },
    { id: 2, nume: 'Răspundere limitată' },
    { id: 9, nume: 'FĂRĂ drept de a practica specialitatea' }
  ];

  public optiuni = [
    'Da',
    'Nu'
  ];

  filteredAsiguratori: Observable<Asigurator[]>;

  asigurareForm: FormGroup;
  formStatus = 0;
  // formStatus = 0;
  // 0 - new - in curs de completare
  // 1 - draft - completare finazilata
  // 2 - activ
  // 3 - inactiv
  itemTitle1: string;
  itemTitle2: string;

  areAvizare = 'Nu';
  isDisabled = false;

  parentFormStatus: number;

  loading = false;

  constructor(
    private _formSet: FormSetService,
    private _dataCal: DataCalService,
    private _apiData: ApiDataService,
    private _snackBar: AlertSnackbarService,
    private _router: Router

  ) { }

  ngOnInit() {
    // console.log(this.avizareForm);
    this.setForm();
    this.getCppData();
    this.setFormStatus();
    // this.setFormTitle();
    this.setFilterRegistre();
  }


////////////////////////////////////////////////

  private getCppData(): void {
    this._apiData.apiGet('cpp', this.asigurareForm.get('id_cpp').value)
    .subscribe((response: ApiData) => {
      if (response.status === 0) {
        return;
      }
      this.cppData = response.data;
      this.setFormTitle();
      return;
    });
  }

  private setForm(): void {
    const a = this.avizareForm.get('asigurare') as FormArray;
    this.asigurareForm = this._formSet.asigurare(a.at(this.arrayIndex).value);
    // console.log(this.avizareForm);
  }

  private setFormStatus(): void {
    this.formStatus = this.avizareForm.get('status').value;
    // console.log (this.asigurareForm.get('status').value);
    // TODO: de folosit campul status al asigurarii
    // 0 - nu are asigurare (default)
    // 1 - are asigurare
    // cel mai bine sa ii faca asigurare din avizare si pe urma sa faca edit aici
    // problema este ca daca ii sterge avizarea raman asigurari orfane
    // console.log(this.asigurareForm.get('status').value);
    if  (this.asigurareForm.get('status').value === 1) {
      this.areAvizare = 'Da';
    }
    if ( this.asigurareForm.get('data_end').value === '') {
      this.formStatus = null;
      return;
    }
    if (this.formStatus !== 0) {
      this.isDisabled = true;
      // this.areAvizare = 'Da';
      Object.keys(this.asigurareForm.controls).forEach(
        key => {
          this.asigurareForm.get(key).disable();
        });
    }

  }

  private setFormTitle(): void {
    const specialitate = this.displayFnCpp(this.cppData.reg_cpp_id);
    const grad = this.displayFnCppGrad(this.cppData.reg_cpp_tip_id);
    const grup = this.displayFnCppGrp(this.cppData.reg_cpp_id);
    this.itemTitle1 = grup;
    this.itemTitle2 = specialitate + ' - ' +  grad;
  }

  setFilterRegistre(): void {
    this.filteredAsiguratori = this.asigurareForm.get('id_asigurator').valueChanges
      .startWith('null')
      .map(asigurator => asigurator && typeof asigurator === 'object' ? asigurator.nume : asigurator)
      .map(nume => nume ? this.filterAsigurator(nume) : this.registruAsiguratori.slice());
  }


  displayFnAsigurator(option: number): string {
    if (option) {
      return this.registruAsiguratori.find(item => item.id === option).nume;
    }
  }


  filterAsigurator(nume: string): Asigurator[] {
    return this.registruAsiguratori.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }


  displayFnCppGrad(id: number): string {
    if (id) {
      return this.registruCppGrad.find(item => item.id === id).nume;
    }
  }

  displayFnCppGrp(id_cpp: number): string {
    if (id_cpp) {
      let id_cpp_grp = this.registruCpp.find(item => item.id === id_cpp).grp_cpp;
      if (id_cpp_grp === null) {
        id_cpp_grp = 4;
      }
      return this.registruCppGrp.find(item => item.id === id_cpp_grp).nume;
    }
  }

  displayFnCppTip(id: number): string {
    if (id) {
      return this.registruAvizareTip.find(item => item.id === id).nume;
    }
  }

  displayFnCpp(option: number): string {
    if (option) {
      return this.registruCpp.find(item => item.id === option).nume;
    }
  }

  addAsigDateEnd(): void {
    if (this.asigurareForm.get('data_start').value !== '') {
      this.asigurareForm.get('data_end').setValue(this._dataCal.addOneYear(this.asigurareForm.get('data_start').value));
    }
  }

  onClickAsigurare(): void {

    if (this.asigurareForm.valid === false) {
      this._snackBar.showSnackBar('Formular Invalid');
      return;
    }

    if (this.loading === true) {
      return;
    }

    this.loading = true;
    const asigData = this.asigurareForm.value;
    const idItem = asigData.id_asig;
    delete asigData.id_asig;
    if (this.formStatus === null) {
      this._apiData.apiAdauga('asigurare', asigData)
        .subscribe((response: ApiData) => {
          if (response.status === 0) {
            return;
          }
          this.loading = false;
          // AvizareComponent._formDataChanged.next();
          // AsigurariListComponent.addActiveSubj.next();
        });
      return;
    }

    this._apiData.apiModifica('asigurare', idItem, asigData)
    .subscribe((response: ApiData) => {
      if (response.status === 0) {
        return;
      }
      this.loading = false;
    });
    return;
  }

  onRaspunsChange(): void {
    if (this.areAvizare === 'Da') {
      this.asigurareForm.get('status').setValue(1);
    }
    // update validators pt formular
    // update field status 0 nu are; are
  }
}
