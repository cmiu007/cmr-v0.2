import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormSetService } from '../../../services/form-set.service';
import { DataCalService } from '../../../services/data-cal.service';
import { Asigurator } from '../../../shared/models/registre.model';
import { Observable } from 'rxjs/Observable';
import { AsigurariListComponent } from '../asigurari-list/asigurari-list.component';
import { Asigurare } from '../../../shared/interfaces/asigurari.interface';
import { MembriService } from '../../../services/membri.service';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AlertSnackbarService } from '../../../services/alert-snackbar.service';
import { ApiData } from '../../../shared/interfaces/message.interface';
import { ApiDataService } from '../../../services/api-data.service';
import { AvizareComponent } from '../../avizari/avizare/avizare.component';

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

  filteredAsiguratori: Observable<Asigurator[]>;

  asigurareForm: FormGroup;
  formStatus = 0;
  // 0 - new
  // 1 - edit
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
    this.setForm();
    this.setFilterRegistre();
    this.setFormStatus();
  }

  private setForm(): void {
    const a = this.avizareForm.get('asigurare') as FormArray;
    this.asigurareForm = this._formSet.asigurare(a.at(this.arrayIndex).value);
  }

  setFormStatus(): void {
    const dataStart = this._dataCal.strToDate(this.avizareForm.get('dlp_data_start').value);
    const dataEnd = this._dataCal.strToDate(this.avizareForm.get('dlp_data_end').value);
    if (this._dataCal.isInTheFuture(dataStart)) {
      this.parentFormStatus = 1;
    } else {
      if (this._dataCal.isInTheFuture(dataEnd)) {
        this.parentFormStatus = 1;
      } else {
        if (this._dataCal.isInThePast(dataEnd)) {
          this.parentFormStatus = 3;
        }
      }
    }
    if (this.asigurareForm.get('id_asig').value) {
      this.formStatus = 1;
      if (this.parentFormStatus === 2 || this.parentFormStatus === 3) {
        this.asigurareForm.disable();
      }
    } else {
      this.setNewForm();
    }
  }

  setNewForm(): void {
    // id mem
    this.asigurareForm.get('id_mem').setValue(
      localStorage.getItem('currentMemId')
    );
    // id dlp
    this.asigurareForm.get('id_dlp').setValue(
      this.avizareForm.get('id_dlp').value
    );
  }

  displayFnAsigurator(option: number): string {
    if (option) {
      return this.registruAsiguratori.find(item => item.id === option).nume;
    }
  }

  setFilterRegistre(): void {
    this.filteredAsiguratori = this.asigurareForm.get('id_asigurator').valueChanges
      .startWith('null')
      .map(asigurator => asigurator && typeof asigurator === 'object' ? asigurator.nume : asigurator)
      .map(nume => nume ? this.filterAsigurator(nume) : this.registruAsiguratori.slice());
  }

  filterAsigurator(nume: string): Asigurator[] {
    return this.registruAsiguratori.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  addAsigDateEnd(): void {
    if (this.asigurareForm.get('data_start').value !== '') {
      this.asigurareForm.get('data_end').setValue(this._dataCal.addOneYear(this.asigurareForm.get('data_start').value));
    }
  }

  delAsigurare(): void {
    const control = <FormArray>this.avizareForm.controls['asigurare'];
    control.removeAt(0);
    AsigurariListComponent.addActiveSubj.next();
  }

  onClickAsigurare(): void {
    if (this.asigurareForm.valid === false) {
      this._snackBar.showSnackBar('Formular Invalid');
      return;
    }
    this.loading = true;
    const asigData = this.asigurareForm.value;
    const idItem = asigData.id_asig;
    delete asigData.id_asig;
    if (this.formStatus === 0) {
      this._apiData.apiAdauga('asigurare', asigData)
        .subscribe((response: ApiData) => {
          if (response.status === 0) {
            return;
          }
          this.loading = false;
          AvizareComponent._formDataChanged.next();
          AsigurariListComponent.addActiveSubj.next();
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
}
