import { Component, OnInit, Input } from '@angular/core';
import { FormSetService } from '../../../services/form-set.service';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { CertificateComponent } from '../certificate.component';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-certificate-lista',
  templateUrl: './certificate-lista.component.html',
  styleUrls: ['./certificate-lista.component.css']
})
export class CertificateListaComponent implements OnInit {
  public _isAddActive: Subject<boolean> = new Subject<boolean>();
  public _isAddActiveObservable: Observable<any> = this._isAddActive.asObservable();

  isAddActive = true;

  @Input('certificateForm')
  public certificateForm;

  // isAddActive = true;

  constructor(
    private _formSet: FormSetService
  ) { }

  ngOnInit() {
    this._isAddActive.subscribe((value: boolean) => this.isAddActive = value);
    }

  addCertificat(): void {
    const newCertificatForm = this._formSet.certificate('newCertificat');
    const arrayControl = this.certificateForm.get('certificate') as FormArray;
    arrayControl.insert(0, newCertificatForm);
    this._isAddActive.next(false);
  }

   // de mutat in child
  makeActive(): void {
    this._isAddActive.next(true);
  }

}
