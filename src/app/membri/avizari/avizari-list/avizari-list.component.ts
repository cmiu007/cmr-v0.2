import { Component, OnInit, Input, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormArray } from '@angular/forms';

import { FormSetService } from '../../../services/form-set.service';
import { Asigurator } from '../../../shared/models/registre.model';
import { Avizare } from '../../../shared/interfaces/avizari.interface';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { IsAddActiveService } from '../../../services/is-add-active.service';

@Component({
  selector: 'app-avizari-list',
  templateUrl: './avizari-list.component.html',
  styleUrls: ['./avizari-list.component.css']
})
export class AvizariListComponent implements OnInit, AfterViewInit, OnDestroy {
  isAddActive = true;

  @Input('formAvizari')
  public formAvizari;

  subscription: Subscription;

  constructor(
    private _formSet: FormSetService,
    private _setAddBtn: IsAddActiveService,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscription = this._setAddBtn.isAddBtnActive
      .subscribe(isActive => {
        this.isAddActive = isActive;
      });
  }

  ngAfterViewInit() {
    this._cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addAvizare() {
    const newAvizareForm = this._formSet.avizare(null);
    const arrayControl: FormArray = this.formAvizari.get('avizari') as FormArray;
    arrayControl.insert(0, newAvizareForm);
    this._setAddBtn.setStatus(false);
  }
}
