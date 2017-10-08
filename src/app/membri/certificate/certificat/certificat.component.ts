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
import { CertificateComponent } from '../certificate.component';

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
  showCertDetails = false;
  certificatId: number;

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
    this.certificatId = this.certificatForm.get('id_certificat').value;
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
      this.certificatForm.get('data_start').setValue(this._dataCal.today());
      this.certificatForm.get('id_mem').setValue(+localStorage.getItem('currentMemId'));
      this._setAddBtn.setStatus(false);
      return;
    }
    if (this._dataCal.isInThePast(dataStart) && dataEnd !== null) {
      this.itemStatus = 'Inactiv';
      this.itemName = 'valid de la ' + this._dataCal.dateToString(dataStart) + ' pana la ' + this._dataCal.dateToString(dataEnd);
      this.certificatForm.disable();
      return;
    }
    // if (this._dataCal.isInTheFuture(dataStart) && dataEnd === null) {
    //   this.itemStatus = 'In Lucru';
    //   // TODO: disable add daca avem un certificat in lucru
    //   // CertificateListaComponent.
    //   this._setAddBtn.setStatus(false);
    //   return;
    // }
    if (this._dataCal.isInThePast(dataStart) && dataEnd === null) {
      this.itemStatus = 'Activ';
      this.itemName = 'valid de la ' + this._dataCal.dateToString(dataStart);
      this.certificatForm.get('data_start').disable();
      this._setAddBtn.setStatus(false);
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
      return;
    }
    this.loading = true;
    this.certificatForm.get('data_start').enable();
    const data = this.certificatForm.value as Certificat;
    const idItem = data.id_certificat;
    // data.status = 99;
    if (this.itemStatus !== 'Nou') {
      data.status = 3;
      this._apiData.apiModifica('certificat', idItem, data)
        .subscribe((response: ApiData) => {
          if (response.status === 0) {
            return;
          }
          this.loading = false;
          CertificateComponent._formDataChanged.next();
        });
      this.loading = false;
      CertificateComponent._formDataChanged.next();
      return;
    }
    data.status = 2;
    delete data.id_certificat;
    data.data_invalidare = null;
    this._apiData.apiAdauga('certificat', data)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.loading = false;
        CertificateComponent._formDataChanged.next();
      });
    // TODO: data invalidari nu poate fi mai mica ca data start
  }

  onDetalii(): void {
    this.showCertDetails = true;
  }
}
