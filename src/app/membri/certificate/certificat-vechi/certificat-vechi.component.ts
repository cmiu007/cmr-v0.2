import { Component, OnInit, Input } from '@angular/core';
import { MembriService } from '../../../services/membri.service';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ApiDataService } from '../../../services/api-data.service';
import { AlertSnackbarService } from '../../../services/alert-snackbar.service';
import { ApiData } from '../../../shared/interfaces/message.interface';
import { Certificat } from '../../../shared/interfaces/certificate.interface';

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

  constructor(
    private _router: Router,
    private _apiData: ApiDataService,
    private _snack: AlertSnackbarService,

  ) { }

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


    // this._memService.getCertificatMembru(localStorage.getItem('currentMemId'))
    //   .subscribe(data => {
    //     if (data.result === '12') {
    //       this._snack.open(data.mesaj, 'inchide', { duration: 5000 });
    //       this._router.navigate(['/login']);
    //     } else {
    //       this.formData = data;
    //       // this.sortDlp();
    //       this.loading = false;
    //       this.tipCert = data.tip_cert;
    //       // this.toFormGroupTest();
    //     }
    //   });
  }

  print(pag: number): void {
    const nativeWindow = window;
    let urlRoot = 'https://devel-rm.cmr.ro/genpdf.php?token=';
    urlRoot = urlRoot + localStorage.getItem('userToken');
    if (pag === 1) {
      urlRoot = urlRoot + '&actiune=fata';
    } else {
      urlRoot = urlRoot + '&actiune=spate';
    }
    urlRoot = urlRoot + '&id=' + this.certificatId; // TODO: de gasit ID
    nativeWindow.open(urlRoot);
  }
}
