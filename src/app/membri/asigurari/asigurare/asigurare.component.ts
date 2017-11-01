import { Component, OnInit, Input } from '@angular/core';
import { Asigurator } from '../../../shared/models/registre.model';
import { ItemRegCpp } from '../../../shared/interfaces/listacpp.interface';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormArray } from '@angular/forms';
import { FormSetService } from '../../../services/form-set.service';
import { DataCalService } from '../../../services/data-cal.service';
import { ApiDataService } from '../../../services/api-data.service';
import { AlertSnackbarService } from '../../../services/alert-snackbar.service';
import { ApiData } from '../../../shared/interfaces/message.interface';
import { ItemRegLista } from '../../../shared/interfaces/listareg.interface';
import { Cpp } from '../../../shared/interfaces/cpps.interface';
import { AvizareComponent } from '../../avizari/avizare/avizare.component';
import { AvizariComponent } from '../../avizari/avizari.component';

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
    { id: 9, nume: 'Nu există grup pentru această specialitate' },
  ];

  // in DB este registru DLP tip
  public registruAsigurareTip: ItemRegLista[] = [
    { id: 1, nume: 'Full' },
    { id: 2, nume: 'Drept de practică SUPRAVEGHEATĂ' },
    { id: 3, nume: 'COMPETENȚE LIMITATE' },
    { id: 4, nume: 'Drept de libera practică - Medicina Generala' },
    { id: 9, nume: 'FĂRĂ drept de practică' }
  ];

  public optiuni = [
    'Da',
    'Nu'
  ];

  raspuns: string;

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

  avizareStatus = 0;
  areAvizare: string;
  avizareStart: string;
  avizareEnd: string;
  asigurareStatus = 0;
  isDisabled = false;

  parentFormStatus: number;

  loading = false;

  constructor(
    private _formSet: FormSetService,
    private _dataCal: DataCalService,
    private _apiData: ApiDataService,
    private _snackBar: AlertSnackbarService,

  ) { }

  ngOnInit() {
    // console.log(this.avizareForm);
    this.setForm();
    this.getCppData();
    this.setFormStatus();
    // console.log(this.formStatus);
    // this.setFormTitle();
    this.setFilterRegistre();
  }


  ////////////////////////////////////////////////


  private setForm(): void {
    const a = this.avizareForm.get('asigurare') as FormArray;
    this.asigurareForm = this._formSet.asigurare(a.at(this.arrayIndex).value);
    this.avizareStart = this.avizareForm.get('dlp_data_start').value;
    // console.log('avizare start :' + this.avizareStart);
    this.avizareEnd = this.avizareForm.get('dlp_data_end').value;
    // console.log('avizare end :' + this.avizareStart);
    // console.log(this.avizareForm);
  }


  private getCppData(): void {
    this._apiData.apiGet('cpp', this.asigurareForm.get('id_cpp').value)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.cppData = response.data;
        this.setFormTitle();
        this.setAreAvizare();
        return;
      });
  }

  private setFormTitle(): void {
    // console.log(this.avizareForm.get('tip').value);
    if (this.avizareForm.get('tip').value === 1 || this.avizareForm.get('tip').value === 3) {
      const specialitate = this.displayFnCpp(this.cppData.reg_cpp_id);
      let grad = '';
      if (this.cppData.grad_prof_cpp_id === null) {
        grad = 'Rezident';
        this.avizareForm.get('tip').setValue(3);
      } else {
        grad = this.displayFnCppGrad(this.cppData.grad_prof_cpp_id);
        this.avizareForm.get('tip').setValue(1);
      }
      const grup = this.displayFnCppGrp(this.cppData.reg_cpp_id);
      this.itemTitle1 = grup;
      this.itemTitle2 = specialitate + ' - ' + grad;
      return;
    }

    if (this.avizareForm.get('tip').value === 2) {
      this.itemTitle1 = 'Specialități MEDICALE';
      this.itemTitle2 = 'Medic cu competețe limitate';
      this.avizareForm.get('tip').setValue(2);
      return;
    }

    if (this.avizareForm.get('tip').value === 4) {
      console.log('hit med gen');
      this.itemTitle1 = 'Specialități MEDICALE';
      this.itemTitle2 = ' Medic de Medicină Generală';
      this.avizareForm.get('tip').setValue(4);
      return;
    }
  }

  private setAreAvizare(): void {
    switch (this.asigurareForm.get('status').value) {
      case 0:
        this.raspuns = null;
        break;

      case 1:
        this.raspuns = 'Da';
        break;

      case 2:
        this.raspuns = 'Nu';
        break;

      default:
        break;
    }
  }
  private setFormStatus(): void {
    this.asigurareStatus = this.asigurareForm.get('status').value;
    // console.log('asigurareStatus:' + this.asigurareStatus);
    this.avizareStatus = this.avizareForm.get('status').value;
    // console.log('avizareStatus: ' + this.avizareStatus);

    // console.log (this.asigurareForm.get('status').value);
    // TODO: de folosit campul status al asigurarii
    // 0 - nu are asigurare (default)
    // 1 - are asigurare
    // cel mai bine sa ii faca asigurare din avizare si pe urma sa faca edit aici
    // problema este ca daca ii sterge avizarea raman asigurari orfane
    // console.log(this.asigurareForm.get('status').value);
    if (this.asigurareStatus === 1) {
      this.areAvizare = 'Da';
    }

    if (this.asigurareStatus === 2) {
      this.areAvizare = 'Nu';
    }

    if (this.avizareStatus !== 0 ) {
      this.isDisabled = true;
      // this.areAvizare = 'Da';
      Object.keys(this.asigurareForm.controls).forEach(
        key => {
          this.asigurareForm.get(key).disable();
        });
    }

    // de printat emsaj de eroare cu status invalid
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

  displayFnAsigTip(id: number): string {
    if (id) {
      return this.registruAsigurareTip.find(item => item.id === id).nume;
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
    console.log(this.asigurareForm);
    if (this.asigurareForm.valid === false) {
      console.log(this.asigurareForm);
      this._snackBar.showSnackBar('Formular Invalid');
      return;
    }

    if (this.loading === true) {
      this._snackBar.showSnackBar('Submiterea datelor catre server este in proges');
      return;
    }

    this.loading = true;
    this.asigurareForm.enable();
    const asigData = this.asigurareForm.value;
    const idItem = asigData.id_asig;
    delete asigData.id_asig;
    // console.log(asigData);

    if (this.asigurareStatus === 0) {
      console.log(asigData);
      this._apiData.apiAdauga('asigurare', asigData)
        .subscribe((response: ApiData) => {
          if (response.status === 0) {
            return;
          }
          this.loading = false;
        });
        AvizariComponent._formDataChanged.next();
        // AvizareComponent._formDataChangedAvizare.next();
        return;
      }

      this._apiData.apiModifica('asigurare', idItem, asigData)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.loading = false;
        AvizariComponent._formDataChanged.next();
        // AvizareComponent._formDataChangedAvizare.next();
      });
    return;
  }


  onRaspunsChange(): void {
    // TODO: update validators pt formular
    // update field status 2 nu are; 1 pt are avizare
    if (this.areAvizare === 'Da') {
      this.asigurareForm.get('status').setValue(1);
      console.log(this.avizareForm.get('tip').value);
      this.asigurareForm.get('tip').setValue(this.avizareForm.get('tip').value);
      return;
    }
    if (this.areAvizare === 'Nu') {

      const asigFormValues = {
        id_mem: this.avizareForm.get('id_mem').value,
        id_asigurator: null,
        status: 2,
        tip: 9,
        polita_serie: null,
        polita_nr: null,
        data_start: this.avizareStart,
        data_end: this.avizareEnd
      };
      this.asigurareForm.patchValue(asigFormValues);
      this.asigurareForm.get('status').setValue(2);
      return;
    }
  }
}
