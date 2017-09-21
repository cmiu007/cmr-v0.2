import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Certificat } from '../../../shared/interfaces/certificate.interface';
import { FormSetService } from '../../../services/form-set.service';

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

  formStatus = 0;
  // 0 - new
  // 1 - draft
  // 2 - activ
  // 3 - inactiv
  isHidden = false;
  itemName = '';
  itemStatus = '';
  formStatusStyle;
  certificatForm;

  constructor(
    private _formSet: FormSetService,
  ) { }

  ngOnInit() {
    this.setForm();
  }

  private setForm(): void {
    const data = (<FormArray>this.certificateForm.get('certificate')).at(this.arrayIndex).value;
    this.certificatForm =  this._formSet.certificate('add', data);
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
