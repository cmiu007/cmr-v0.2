import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-certificat-vechi',
  templateUrl: './certificat-vechi.component.html',
  styleUrls: ['./certificat-vechi.component.css']
})
export class CertificatVechiComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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
