import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormSetService } from '../../../services/form-set.service';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { CertificateComponent } from '../certificate.component';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IsAddActiveService } from '../../../services/is-add-active.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-certificate-lista',
  templateUrl: './certificate-lista.component.html',
  styleUrls: ['./certificate-lista.component.css']
})
export class CertificateListaComponent implements OnInit, AfterViewInit, OnDestroy {
  isAddActive = true;

  @Input('certificateForm')
  public certificateForm;

  subscription: Subscription;

  constructor(
    private _formSet: FormSetService,
    private _setAddBtn: IsAddActiveService,
    private _cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.subscription = this._setAddBtn.isAddBtnActive
      .subscribe(isActive => {
        this.isAddActive = isActive;
      });
    // this._isAddActive.subscribe((value: boolean) => this.isAddActive = value);
  }

  ngAfterViewInit() {
    this._cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addCertificat(): void {
    const newCertificatForm = this._formSet.certificate('newCertificat');
    const arrayControl = this.certificateForm.get('certificate') as FormArray;
    arrayControl.insert(0, newCertificatForm);
    this._setAddBtn.setStatus(false);
  }
}
