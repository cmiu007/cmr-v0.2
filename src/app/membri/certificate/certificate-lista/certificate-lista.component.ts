import { Component, OnInit, Input } from '@angular/core';
import { FormSetService } from '../../../services/form-set.service';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { CertificateComponent } from '../certificate.component';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-certificate-lista',
  templateUrl: './certificate-lista.component.html',
  styleUrls: ['./certificate-lista.component.css']
})
export class CertificateListaComponent implements OnInit {
  loading: Subject<any> = new Subject<any>();
  loadingObservable: Observable<any> = this.loading.asObservable();

  @Input('certificateForm')
  public certificateForm;

  isAddActive = true;

  constructor(
    private _formSet: FormSetService
  ) { }

  ngOnInit() {
    this.loadingObservable.subscribe(status => this.isAddActive = status.addActive);
  }

  addCertificat(): void {
    const newCertificatForm = this._formSet.certificate('newCertificat');
    const arrayControl = this.certificateForm.get('certificate') as FormArray;
    arrayControl.insert(0, newCertificatForm);
    this.isAddActive = false;
  }

   // de mutat in child
  makeActive(): void {
    this.loading.next({addActive: true});
  }

}
