import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { NomenclatorService } from '../../services/nomenclator.service';
import { Judet, Tara, Fac, ActIdentTip, DocFacTip } from '../../shared/models/registre.model';
import { FormValidatorsService } from '../../services/form-validators.service';
import { ItemRegLista } from '../../shared/interfaces/listareg.interface';
import { ItemRegFac } from '../../shared/interfaces/fac.interface';
import { FormSetService } from '../../services/form-set.service';
import { ApiDataService } from '../../services/api-data.service';
import { ApiData } from '../../shared/interfaces/message.interface';
import { DatePersonale } from '../../shared/interfaces/datepersonale.interface';
import { getTestBed } from '@angular/core/testing';
import { AlertSnackbarService } from '../../services/alert-snackbar.service';

@Component({
  selector: 'app-date-personale',
  templateUrl: './date-personale.component.html',
  styleUrls: ['./date-personale.component.css']
})
export class DatePersonaleComponent implements OnInit {
  // formStatus:
  // 0 - admin - vine din local storage cmj -
  // 1 - read-only - vine din json
  // 2 - newMember - vine din cale
  // 3 - edit - vine din json
  // TODO: sa vina din json direct in functie de user e mai sigur
  // TODO: de implementat roluri pt dezvoltarea ulterioara
  formStatus = 1; // case read-only (default), edit, newMember, admin
  formDatePersonale: FormGroup;
  formDatePersonaleData;
  loading = true;
  reloading = true;

  registruJudete: ItemRegLista[];
  filtruJudete: Observable<Judet[]>;

  registruTari: ItemRegLista[];
  filtruTari: Observable<Tara[]>;

  registruFac: ItemRegLista[];
  filtruFac: Observable<Fac[]>;

  // TODO: de adus din api | extindere api
  registruActIdentTip: ActIdentTip[] = [
    { id: 1, nume: 'Carte de identitate' },
    { id: 2, nume: 'Buletin de identitate' },
    { id: 3, nume: 'Pasaport' },
    { id: 4, nume: 'Permis de sedere' }
  ];
  filtruActIdentTip: Observable<ActIdentTip[]>;

  // TODO: de adus din api | extindere api
  registruDocFacTip: DocFacTip[] = [
    { id: 1, nume: 'Diploma Licenta' },
    { id: 2, nume: 'Adeverinta' },
    { id: 3, nume: '(UE) Diploma' },
    { id: 4, nume: 'Confirmare MS' } // TODO: de clarificat la avizari denumirea pt medicii care au absolvit in alte tari
  ];
  filtruDocFacTip: Observable<DocFacTip[]>;

  constructor(
    private _formSet: FormSetService,
    private _formValidators: FormValidatorsService,
    private _apiData: ApiDataService,
    private _aRoute: ActivatedRoute,
    private _snackBar: AlertSnackbarService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.setHeader();
    this.getFormData();
    // get nomeclatoare & set filters
  }

  private setHeader(): void {
    localStorage.setItem('currentPage', 'Date Personale');
  }

  private getFormData(): void {
    this.loading = true;
    if (this._aRoute.snapshot.params['id']) {
      this._apiData.apiGet('date_personale', this._aRoute.snapshot.params['id'])
        .subscribe((response: ApiData) => {
          this.loading = false;
          this.reloading = false;
          this.formDatePersonaleData = response.data;
          this.setForm();
          this.setFormMode();
          this.setRegistre();
        });
    } else {
      this.loading = false;
      this.reloading = false;
      this.setForm();
      this.setFormMode();
      this.setRegistre();
    }
  }

  private setForm(): void {
    this.formDatePersonale = this._formSet.datePersonale(this.formDatePersonaleData);
  }

  private setFormMode() {
    if ((JSON.parse(localStorage.getItem('userGroup'))) === 160) {
      this.formStatus = 0;
      this.enableAdmin();
      return;
    }
    if (this.formDatePersonale.get('cetatenie').value === null
      || this.formDatePersonale.get('cetatenie').value === '') {
      this.formStatus = 2;
      this.enableNewMember();
      return;
    }

    if (this.formDatePersonale.get('ro').value === 'true') {
      this.formStatus = 1;
      return;
    }

    this.formStatus = 3;
    this.enableRW();
  }

  private enableRW() {
    this.formDatePersonale.get('nume').enable();
    this.formDatePersonale.get('initiala').enable();
    this.formDatePersonale.get('prenume').enable();
    this.formDatePersonale.get('nume_ant').enable();
    this.formDatePersonale.get('act_ident_tip_id').enable();
    this.formDatePersonale.get('act_ident_serie').enable();
    this.formDatePersonale.get('act_ident_nr').enable();
    this.formDatePersonale.get('act_ident_exp_date').enable();
    // TODO: de facut if pt tipul actului de fac
    // daca act === diploma nu face enable
    this.formDatePersonale.get('fac_doc_tip').enable();
    this.formDatePersonale.get('fac_dipl_serie').enable();
    this.formDatePersonale.get('fac_dipl_nr').enable();
    this.formDatePersonale.get('fac_dipl_data').enable();
    // TODO: daca cod_parafa !== null ramane disabled
    this.formDatePersonale.get('cod_parafa').enable();
  }

  private enableNewMember() {
    this.enableRW();
    this.formDatePersonale.get('cnp').enable();
    this.formDatePersonale.get('data_juramant').enable();
    this.formDatePersonale.get('cetatenie').enable();
    this.formDatePersonale.get('cetatenie').setValue('1183');
    this.formDatePersonale.get('fac_absolv').enable();
    this.formDatePersonale.get('fac_promotie').enable();
    // TODO: completeaza automat judet pe baza jud_id al operatorului
    this.formDatePersonale.get('jud_id').enable();
    // judet ADM nu exista in lista de judete filtrate :)
    if (this.formStatus !== 0) {
      this.formDatePersonale.patchValue({ 'jud_id': localStorage.getItem('userGroup') });
    }
  }

  private enableAdmin() {
    this.enableRW();
    this.enableNewMember();
    this.formDatePersonale.get('jud_id').enable();
  }


  // log submit
  onSubmit() {
    if (this.formDatePersonale.valid === false) {
      this._snackBar.showSnackBar('Formular Invalid');
      return;
    }

    this.reloading = true;
    if (this.formStatus === 2) {
      this.adaugaMembru();
      return;
    }
    this.editeazaMembru();
  }

  private editeazaMembru() {
    this.formDatePersonale.get('jud_id').enable();
    this._apiData.apiModifica('date_personale', +localStorage.getItem('currentMemId'), this.formDatePersonale.value)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.getFormData();
        return;
      });
  }

  private adaugaMembru() {
    const memData = this.formDatePersonale.value;
    this._apiData.apiAdauga('date_personale', this.formDatePersonale.value)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          this._snackBar.showSnackBar(response.data);
          return;
        }
        localStorage.setItem('currentMemNume',
          (this.formDatePersonale.get('nume').value + ' ' + this.formDatePersonale.get('prenume').value));
        localStorage.setItem('currentMemId', response.data.id_med);
        this._router.navigate(['/membri', response.data.id_med, 'datepersonale']); // de adaugat id-ul
      });
    return;
  }

  checkCNP(): void {
    const controlValid = this.formDatePersonale.get('cnp').valid;
    if (controlValid === true) {
      this.reloading = true;
      const cnp = this.formDatePersonale.get('cnp').value;
      this._apiData.apiCautaMembru('list', cnp)
        .subscribe((response: ApiData) => {
          this.reloading = false;
          console.log(response);
          const cnpResponse = response.data;
          if (cnpResponse.length !== 0) {
            this.formDatePersonale.controls['cnp'].setErrors({ 'isUsed': true });
            this._snackBar.showSnackBar('CNP-ul exista deja in baza de date, verifica folosind cautarea globala');
          }
        });
    }
  }
  private isRequired(data) {
    console.log(data);
  }

  private log() {
    console.log(this.formDatePersonale.value);
  }
  private test() {
    console.log(this.formDatePersonale);
  }

  private setRegistre(): void {
    this.registruJudete = this._aRoute.snapshot.data['regJud'];
    const delValRegJud = ['ADM', 'CMR'];
    delValRegJud.forEach(element => {
      this.registruJudete = this.registruJudete.filter(option => option.nume !== element);
    });
    this.filtruJudete = this.formDatePersonale.get('jud_id').valueChanges
      .startWith(null)
      .map(judet => judet && typeof judet === 'object' ? judet.nume : judet)
      .map(nume => nume ? this.filterJud(nume) : this.registruJudete.slice());

    this.registruTari = this._aRoute.snapshot.data['regTara'];
    this.filtruTari = this.formDatePersonale.get('cetatenie').valueChanges
      .startWith(null)
      .map(tara => tara && typeof tara === 'object' ? tara.nume : tara)
      .map(nume => nume ? this.filterTari(nume) : this.registruTari.slice());

    this.registruFac = this._aRoute.snapshot.data['regFac'];
    this.filtruFac = this.formDatePersonale.get('fac_absolv').valueChanges
      .startWith(null)
      .map(fac => fac && typeof fac === 'object' ? fac.nume : fac)
      .map(nume => nume ? this.filterFac(nume) : this.registruFac.slice());

    this.filtruActIdentTip = this.formDatePersonale.get('act_ident_tip_id').valueChanges
      .startWith(null)
      .map(idTip => idTip && typeof idTip === 'object' ? idTip.nume : idTip)
      .map(nume => nume ? this.filterActIdentTip(nume) : this.registruActIdentTip.slice());

    this.filtruDocFacTip = this.formDatePersonale.get('fac_doc_tip').valueChanges
      .startWith(null)
      .map(docFacTip => docFacTip && typeof docFacTip === 'object' ? docFacTip.nume : docFacTip)
      .map(nume => nume ? this.filterDocFacTip(nume) : this.registruDocFacTip.slice());
  }

  filterJud(nume: string): Judet[] {
    return this.registruJudete
      .filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  filterTari(nume: string): Tara[] {
    return this.registruTari
      .filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  filterFac(nume: string): Fac[] {
    return this.registruFac
      .filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  filterActIdentTip(nume: string): ActIdentTip[] {
    return this.registruActIdentTip
      .filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  filterDocFacTip(nume: string): ActIdentTip[] {
    return this.registruDocFacTip
      .filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  displayFnTara(option) {
    if (option) {
      return this.registruTari.find(item => item.id === +option).nume;
    }
  }

  displayFnJudet(option) {
    if (option) {
      return this.registruJudete.find(item => item.id === +option).nume;
    }
  }

  displayFnFac(option) {
    if (option) {
      return this.registruFac.find(item => item.id === +option).nume;
    }
  }

  displayFnActIdentTip(option) {
    if (option) {
      return this.registruActIdentTip.find(item => item.id === +option).nume;
    }
  }

  displayFnDocFacTip(option) {
    if (option) {
      return this.registruDocFacTip.find(item => item.id === +option).nume;
    }
  }

}
