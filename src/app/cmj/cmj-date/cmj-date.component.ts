import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../../services/api-data.service';
import { ApiData } from '../../shared/interfaces/message.interface';
import { Judet } from '../../shared/interfaces/judet-date.interface';
import { FormSetService } from '../../services/form-set.service';
import { FormGroup } from '@angular/forms';
import { AlertSnackbarService } from '../../services/alert-snackbar.service';
import { FormValidatorsService } from '../../services/form-validators.service';
import { RegLista } from '../../shared/interfaces/listareg.interface';
import { ActivatedRoute } from '@angular/router';
import { RegValue } from '../../shared/models/registre.model';

@Component({
  selector: 'app-cmj-date',
  templateUrl: './cmj-date.component.html',
  styleUrls: ['./cmj-date.component.css']
})
export class CmjDateComponent implements OnInit {

  loading = true;
  formStatus: number;
  judetId = sessionStorage.getItem('userGroup');
  judetNume = 'Test';
  judetDate: Judet;
  judetForm: FormGroup;

  registruJud: RegValue[];

  constructor(
    private _apiData: ApiDataService,
    private _formSet: FormSetService,
    private _snackBar: AlertSnackbarService,
    private _validator: FormValidatorsService,
    private _aRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.setRegistre();
    this.setHeader();
    this.setForm();
    this.loading = false;
  }

  private setRegistre(): void {
    this.registruJud = this._aRoute.snapshot.data['regJud'];
  }

  private setHeader(): void {
    sessionStorage.removeItem('currentMemNume');
    sessionStorage.removeItem('currentMemId');
    sessionStorage.removeItem('currentMemCuim');
    this.judetNume = this.displayFnJudet(this.judetId);
    const titluHeader = 'Date generale pentru C.M. ' + this.judetNume;
    sessionStorage.setItem('currentPage', titluHeader);
  }


  private setForm(): void {
    this.judetForm = this._formSet.cmj('init');
    this._apiData.apiLista('cmj', this.judetId)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        const listaCMJ = response.data;
        this.judetDate = listaCMJ.filter(item => +item.id_reg_jud === +this.judetId)[0];
        if (typeof this.judetDate.id_cmj === 'undefined') {
          this.judetForm.get('id_reg_jud').setValue(this.judetId);
          this.judetForm.get('id_cmj').setValidators([]);
          this.judetForm.get('id_cmj').updateValueAndValidity();
          this.formStatus = 0;
          return;
        }
        this.judetForm = this._formSet.cmj('populate', this.judetDate);
        this.formStatus = 1;
        this.loading = false;
      });

  }

  onSubmit(): void {
    console.log(this.judetForm);
    if (this.judetForm.valid === false) {
      this._snackBar.showSnackBar('Formular Invalid');
      return;
    }
    if (this.loading === true) {
      return;
    }
    this.loading = true;
    const data: Judet = this.judetForm.value;
    const idItem = data.id_cmj;
    delete data.id_cmj;

    switch (this.formStatus) {
      case 0:
        this._apiData.apiAdauga('cmj', data)
        .subscribe((response: ApiData) => {
          if (response.status === 0) {
            return;
          }
          this.loading = false;
          // AvizariComponent._formDataChanged.next();
        });
      return;

      case 1:
      this._apiData.apiModifica('cmj', idItem, data)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.loading = false;
        // AvizariComponent._formDataChanged.next();
      });
      return;

      default:
        break;
    }
  }

  private displayFnJudet(option) {
    if (option) {
      return this.registruJud.find(item => item.id === +option).nume;
    }
  }
}

