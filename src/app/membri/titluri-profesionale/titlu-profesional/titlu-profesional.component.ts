import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormSetService } from '../../../services/form-set.service';
import { ItemRegFac } from '../../../shared/interfaces/fac.interface';
import { ItemRegLista } from '../../../shared/interfaces/listareg.interface';
import { AlertSnackbarService } from '../../../services/alert-snackbar.service';
import { Titlu } from '../../../shared/interfaces/titluri.interface';
import { ApiDataService } from '../../../services/api-data.service';
import { ApiData } from '../../../shared/interfaces/message.interface';


@Component({
  selector: 'app-titlu-profesional',
  templateUrl: './titlu-profesional.component.html',
  styleUrls: ['./titlu-profesional.component.css']
})
export class TitluProfesionalComponent implements OnInit {

  @Input('titluriForm')
  public titluriForm;

  @Input('arrayIndex')
  public arrayIndex;

  @Input('regFacultati')
  public regFacultati;
  filteredFacultati;

  @Input('regTitluri')
  public regTitluri;
  filteredTitluri;

  loading = false;
  titluForm: FormGroup;
  itemStatus;
  // 0 - Draf / New
  // 1 - Complet - nu se foloseste pt formul acesta
  // 2 - Activ - produce efecte
  // 3 - Inactiv
  itemTip;
  itemTitlu;
  itemSubtitlu;
  univ = true;

  constructor(
    private _formSet: FormSetService,
    private _snackBar: AlertSnackbarService,
    private _apiData: ApiDataService
  ) {
  }
  ngOnInit() {
    this.setForm();
    this.setFormStatus();
    this.setRegistre();
  }

  private setForm(): void {
    const data = (<FormArray>this.titluriForm.get('titluri')).at(this.arrayIndex).value;
    this.titluForm = this._formSet.titluri('add', data);
    this.titluForm.get('id_mem').setValue(sessionStorage.getItem('currentMemId'));
    console.log(this.titluriForm);
  }

  private setFormStatus(): void {
    // avem de setat itemStatus -> vine din DB
    // avem de setat itemType -> se calculeaza:
    //    - din registru tip titlu
    //    - input user pt nou

    // este un formular nou? nu are data de start


    if (this.titluForm.get('status').value === null) {
      this.itemStatus = 0;
      this.itemTitlu = 'Titlu Profesional Nou';
      return;
    }

    if (this.titluForm.get('status').value === 1) {
      this.itemStatus = 1;
      this.itemSubtitlu = 'incepand cu data: ' + this.titluForm.get('data_start').value.toString();
      this.titluForm.disable();
      this.titluForm.get('data_start').enable();
      this.titluForm.get('data_end').enable();
    }

    if (this.titluForm.get('status').value === 2) {
      this.itemStatus = 2;
      this.titluForm.disable();
      this.itemSubtitlu = 'Inactiv';
    }

    const valueTitlu = this.titluForm.get('reg_titlu_id').value;
    const numeTitlu = this.regTitluri.find(item => item.id === valueTitlu).nume;
    this.itemTitlu = numeTitlu;
    this.checkTipTitlu();
  }

  checkTipTitlu(): void {
    const valueTitlu = this.titluForm.get('reg_titlu_id').value;
    if (valueTitlu) {
      const tipTitlu = this.regTitluri.find(item => item.id === valueTitlu).tip;
      if (tipTitlu !== 'U') {
        if (this.itemStatus === 'Inactiv') {
          this.titluForm.get('reg_facultate_id').disable();
        } else {
          this.titluForm.get('reg_facultate_id').enable();
        }
        this.univ = true;
        return;
      }
      this.univ = false;
    }
  }

  private setRegistre(): void {
    this.filteredFacultati = this.titluForm.get('reg_facultate_id').valueChanges
      .startWith(null)
      .map(fac => fac && typeof fac === 'object' ? fac.nume : fac)
      .map(nume => nume ? this.filterFacultate(nume) : this.regFacultati.slice());
    this.filteredTitluri = this.titluForm.get('reg_titlu_id').valueChanges
      .startWith(null)
      .map(tip => tip && typeof tip === 'object' ? tip.nume : tip)
      .map(nume => nume ? this.filterTitlu(nume) : this.regTitluri.slice());
  }

  displayFnFacultate(option: number): string {
    if (option) {
      return this.regFacultati.find(item => item.id === option).nume;
    }
  }

  filterFacultate(nume: string): ItemRegLista[] {
    return this.regFacultati.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  displayFnTitlu(option: number): string {
    if (option) {
      return this.regTitluri.find(item => item.id === option).nume;
    }
  }

  filterTitlu(nume: string): ItemRegLista[] {
    return this.regTitluri.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  onSubmit(actiune): void {
    if (this.titluForm.valid === false) {
      console.log(this.titluForm);
      this._snackBar.showSnackBar('Formular Invalid');
      return;
    }

    if (this.loading === true) {
      this._snackBar.showSnackBar('Submiterea datelor catre server este in proges');
      return;
    }

    this.loading = true;
    this.titluForm.enable();
    const titluData: Titlu = this.titluForm.value;
    const idItem = titluData.id_titlu;
    delete titluData.id_titlu;

    switch (actiune) {
      case 'adauga':
        delete titluData.data_end;
        titluData.status = 1;
        this._apiData.apiAdauga('titlu', titluData)
          .subscribe((response: ApiData) => {
            if (response.status === 0) {
              return;
            }
            this.loading = false;
          });
          // AvizareComponent._formDataChangedAvizare.next();
        break;

      case 'modifica':
      delete titluData.id_mem;
      // delete titluData.reg_facultate_id;
      // delete titluData.reg_titlu_id;
      console.log(titluData);
      console.log(idItem);
        this._apiData.apiModifica('titlu', idItem, titluData)
          .subscribe((response: ApiData) => {
            if (response.status === 0) {
              return;
            }
            this.loading = false;
            // AvizariComponent._formDataChanged.next();
          });
          // AvizareComponent._formDataChangedAvizare.next();
        break;

      default:
        break;
    }
    return;
  }

}
