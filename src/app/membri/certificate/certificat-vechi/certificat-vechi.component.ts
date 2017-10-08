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
  memId = localStorage.getItem('currentMemId');

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
      // console.log(this.formData);
      // this.setForm('populate', this.certificateData);
      this.loading = false;
    });
  return;
  }

  print(pag: number): void {
    const nativeWindow = window;
    let url = this.genPDFAddress + 'genpdf.php?token=' + localStorage.getItem('userToken');
    if (pag === 1) {
      url = url + '&actiune=fata';
      url = url + '&id=' + this.certificatId; // TODO: de gasit ID
      nativeWindow.open(url);
    } else {
      // url = url + '&actiune=spate';
      this._router.navigate(['/membri/' + this.memId + '/avizari']);
      return;
    }
  }
}
