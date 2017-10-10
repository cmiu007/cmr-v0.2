import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Certificat } from '../../../shared/interfaces/certificate.interface';
import { FormSetService } from '../../../services/form-set.service';
import { DataCalService } from '../../../services/data-cal.service';
import { CertificateListaComponent } from '../certificate-lista/certificate-lista.component';
import { AlertSnackbarService } from '../../../services/alert-snackbar.service';
import { ApiDataService } from '../../../services/api-data.service';
import { ApiData } from '../../../shared/interfaces/message.interface';
import { IsAddActiveService } from '../../../services/is-add-active.service';

@Component({
  selector: 'app-certificat',
  templateUrl: './certificat.component.html',
  styleUrls: ['./certificat.component.css']
})
export class CertificatComponent implements OnInit {

  @Input('certificateForm')
  certificateForm: FormGroup;

  @Input('arrayIndex')
  arrayIndex: number;

  // formStatus = 0;
  // 0 - new
  // 1 - draft
  // 2 - activ
  // 3 - inactiv
  itemName = '';
  itemStatus = '';
  // TODO: de facut style pe Activ
  formStatusStyle;
  certificatForm;
  loading = false;

  constructor(
    private _formSet: FormSetService,
    private _dataCal: DataCalService,
    private _snackBar: AlertSnackbarService,
    private _apiData: ApiDataService,
    private _setAddBtn: IsAddActiveService
  ) { }

  ngOnInit() {
    this.setForm();
    this.setFormStatus();
  }

  private setForm(): void {
    const data = (<FormArray>this.certificateForm.get('certificate')).at(this.arrayIndex).value;
    this.certificatForm = this._formSet.certificate('add', data);
  }

  private setFormStatus(): void {
    let dataStart: Date = null;
    let dataEnd: Date = null;
    const dataStartVal = this.certificatForm.get('data_start').value;
    if (dataStartVal !== null) {
      dataStart = this._dataCal.strToDate(dataStartVal) as Date;
    }
    const dataEndVal = this.certificatForm.get('data_invalidare').value;
    if (dataEndVal !== null) {
      dataEnd = this._dataCal.strToDate(dataEndVal) as Date;
    }
    if (dataStartVal === null && dataEndVal === null) {
      this.itemStatus = 'Nou';
      this._setAddBtn.setStatus(false);
      return;
    }
    if (this._dataCal.isInThePast(dataStart) && dataEnd !== null) {
      this.itemStatus = 'Inactiv';
      this.itemName = 'valid de la ' + this._dataCal.dateToString(dataStart) + ' pana la ' + this._dataCal.dateToString(dataEnd);
      this._setAddBtn.setStatus(false);
      return;
    }
    if (this._dataCal.isInTheFuture(dataStart) && dataEnd === null) {
      this.itemStatus = 'In Lucru';
      // TODO: disable add daca avem un certificat in lucru
      // CertificateListaComponent.
      this._setAddBtn.setStatus(false);
      return;
    }
    if (this._dataCal.isInThePast(dataStart) && dataEnd === null) {
      this.itemStatus = 'Activ';
      this.itemName = 'valid de la ' + this._dataCal.dateToString(dataStart);
      return;
    }
  }

  delCertificat(): void {
    const control = <FormArray>this.certificateForm.controls['certificate'];
    control.removeAt(0);
    this._setAddBtn.setStatus(true);
  }

  onClickCert(): void {
    if (this.certificatForm.invalid) {
      this._snackBar.showSnackBar('Formular Invalid');
      console.log(this.certificatForm.value);
      return;
    }
    this.loading = true;
    const data = this.certificatForm.value as Certificat;
    const idItem = data.id_certificat;
    console.log(data);
    if (this.itemStatus !== 'Nou') {
      this._apiData.apiModifica('certificat', idItem, data)
        .subscribe((response: ApiData) => {
          console.log(response);
          if (response.status === 0) {
            return;
          }
          this.loading = false;
          // TODO: reload lista avizari
          // AvizariComponent._formDataChanged.next();
        });
      this.loading = false;
      return;
    }
    // this._apiData.apiAdauga('certificat', data);
    this._apiData.apiAdauga('certificat', data)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.loading = false;
        // TODO: reload lista avizari
        // AvizariComponent._formDataChanged.next();
      });
    // TODO: data invalidari nu poate fi mai mica ca data start

  }
  // print(pag: number): void {
  //   const nativeWindow = window;
  //   let urlRoot = 'https://devel-rm.cmr.ro/genpdf.php?token=';
  //   urlRoot = urlRoot
  //     + localStorage.getItem('userToken')
  //     + '&id='
  //     + localStorage.getItem('currentMemId');

  //   if (pag === 1) {
  //     nativeWindow.open(urlRoot + '&actiune=fata');
  //     return;
  //   }
  //   nativeWindow.open(urlRoot + '&actiune=spate');
  // }
}
