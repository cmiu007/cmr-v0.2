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
    this.setFormStatus();
    this.setFilterRegistre();
  }


////////////////////////////////////////////////


  private setForm(): void {
    const a = this.avizareForm.get('asigurare') as FormArray;
    this.asigurareForm = this._formSet.asigurare(a.at(this.arrayIndex).value);
  }

  setFormStatus(): void {
    const status = this.avizareForm.get('status').value;

    if (status !== 0) {
      Object.keys(this.asigurareForm.controls).forEach(
        key => {
          this.asigurareForm.get(key).disable();
        });
    }
  }

  setFilterRegistre(): void {
    this.filteredAsiguratori = this.asigurareForm.get('id_asigurator').valueChanges
      .startWith('null')
      .map(asigurator => asigurator && typeof asigurator === 'object' ? asigurator.nume : asigurator)
      .map(nume => nume ? this.filterAsigurator(nume) : this.registruAsiguratori.slice());
  }

  setNewForm(): void {
    // id mem
    this.asigurareForm.get('id_mem').setValue(
      sessionStorage.getItem('currentMemId')
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
}
