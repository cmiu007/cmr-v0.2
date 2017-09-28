import { Component, OnInit, Input } from '@angular/core';
import { MembriService } from '../../../services/membri.service';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ApiDataService } from '../../../services/api-data.service';
import { AlertSnackbarService } from '../../../services/alert-snackbar.service';
import { ApiData } from '../../../shared/interfaces/message.interface';
import { Certificat } from '../../../shared/interfaces/certificate.interface';
import { GlobalDataService } from '../../../services/global-data.service';

@Component({
  selector: 'app-certificat-vechi',
  templateUrl: './certificat-vechi.component.html',
  styleUrls: ['./certificat-vechi.component.css']
})
export class CertificatVechiComponent implements OnInit {
  @Input ('certificatId')
  public certificatId;

  loading = true;
  formData: Certificat; // de pus tip
  printActive = false;
  tipCert = '';
  genPDFAddress = '';

  constructor(
    private _router: Router,
    private _apiData: ApiDataService,
    private _snack: AlertSnackbarService,
    private _globalVars: GlobalDataService,
  ) {
    this.genPDFAddress = this._globalVars.shareObj['genPDFAddress'];
  }

  ngOnInit() {
    this.getFormData();
  }

  getFormData(): void {
    this.loading = true;
    this._apiData.apiGet('certificat', this.certificatId)
    .subscribe((response: ApiData) => {
      if (response.status === 0) {
        return;
      }
      const a = response.data;
      this.formData = JSON.parse(a.continut);
      // console.log(this.formData.continut);
      // this.setForm('populate', this.certificateData);
      this.loading = false;
    });
  return;
  }

  print(pag: number): void {
    const nativeWindow = window;
    this.genPDFAddress = this.genPDFAddress + localStorage.getItem('userToken');
    if (pag === 1) {
      this.genPDFAddress = this.genPDFAddress + '&actiune=fata';
    } else {
      this.genPDFAddress = this.genPDFAddress + '&actiune=spate';
    }
    this.genPDFAddress = this.genPDFAddress + '&id=' + this.certificatId; // TODO: de gasit ID
    nativeWindow.open(this.genPDFAddress);
  }
}
