import { Component, OnInit } from '@angular/core';
import { MembriService } from '../../services/membri.service';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  loading = true;
  formData; // de pus tip
  printActive = false;
  tipCert = '';

  constructor(
    private _memService: MembriService,
    private _snack: MdSnackBar,
    private _router: Router
  ) { }

  ngOnInit() {
    this.setPageName();
    this.getFormData();
  }

  setPageName(): void {
    localStorage.setItem('currentPage', 'Certificat');
  }

  getFormData(): void {
    this.loading = true;
    this._memService.getCertificatMembru(localStorage.getItem('currentMemId'))
      .subscribe(data => {
        if (data.result === '12') {
          this._snack.open(data.mesaj, 'inchide', { duration: 5000 });
          this._router.navigate(['/login']);
        } else {
          this.formData = data;
          // this.sortDlp();
          this.loading = false;
          this.tipCert = data.tip_cert;
          // this.toFormGroupTest();
        }
      });
  }

  print(pag: number): void {
    const nativeWindow = window;
    let urlRoot = 'https://devel-rm.cmr.ro/genpdf.php?token=';
    urlRoot = urlRoot
      + localStorage.getItem('userToken')
      + '&id='
      + localStorage.getItem('currentMemId');

    if (pag === 1) {
      nativeWindow.open(urlRoot + '&actiune=fata');
      return;
    }
    nativeWindow.open(urlRoot + '&actiune=spate');
  }
}
