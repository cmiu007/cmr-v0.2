import { Component, OnInit } from '@angular/core';

import { ApiDataService } from '../../services/api-data.service';
import { ApiData } from '../../shared/interfaces/message.interface';
import { Subject } from 'rxjs/Subject';
import { CertificatComponent } from './certificat/certificat.component';
import { ListaCertificate, Certificat } from '../../shared/interfaces/certificate.interface';
import { FormSetService } from '../../services/form-set.service';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})

export class CertificateComponent implements OnInit {
  public static _formDataChanged: Subject<boolean> = new Subject;
  loading = true;
  printActive = false;
  tipCert = '';
  certificateData: Certificat[];
  certificateForm: FormGroup;

  constructor(
    private _apiData: ApiDataService,
    private _formSet: FormSetService
  ) { }

  ngOnInit() {
    this.setPageName();
    this.setForm('init');
    this.getFormData();
    CertificateComponent._formDataChanged
      .subscribe(result => {
        this.setForm('init');
        this.getFormData();
      });
  }

  private setPageName(): void {
    localStorage.setItem('currentPage', 'Certificat');
  }

  private getFormData(): void {
    this.loading = true;
    const memId = localStorage.getItem('currentMemId');
    this._apiData.apiLista('certificat', memId)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.certificateData = response.data;
        this.sortData();
        this.setForm('populate', this.certificateData);
        this.loading = false;
      });
    return;
  }

  private sortData(): void {
    this.certificateData
      .sort((a: Certificat, b) => {
        return a.data_start > b.data_start ? -1 : 1;
      });
  }

  private setForm(actiune: string, data?: Certificat[], form?: FormGroup): void {
    switch (actiune) {
      case 'init':
        this.certificateForm = this._formSet.certificate('initForm');
        break;

      case 'populate':
        const certForm = this.certificateForm.get('certificate') as FormArray;
        this.certificateData.forEach((item: Certificat) => {
          certForm.push(this._formSet.certificate('add', item, form));
        });
        break;

      default:
        break;
    }

  }
}
