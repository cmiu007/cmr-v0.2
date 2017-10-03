import { Component, OnInit, Input, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormSetService } from '../../../services/form-set.service';
import { IsAddActiveService } from '../../../services/is-add-active.service';
import { Subscription } from 'rxjs/Subscription';
import { FormArray } from '@angular/forms';
import { ItemRegLista } from '../../../shared/interfaces/listareg.interface';
import { RegTitluri } from '../../../shared/interfaces/titluri.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-titluri-profesionale-lista',
  templateUrl: './titluri-profesionale-lista.component.html',
  styleUrls: ['./titluri-profesionale-lista.component.css']
})
export class TitluriProfesionaleListaComponent implements OnInit, AfterViewInit, OnDestroy {

  subscription: Subscription;
  @Input('titluriForm')
  public titluriForm;

  isAddActive = true;

  regFacultati: ItemRegLista[];
  regTitluri: RegTitluri[];

  constructor(
    private _cd: ChangeDetectorRef,
    private _formSet: FormSetService,
    private _setAddBtn: IsAddActiveService,
    private _aRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.setRegistre();
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

  private setRegistre(): void {
    this.regFacultati = this._aRoute.snapshot.data['regFac'];
    this.regTitluri = this._aRoute.snapshot.data['regTitluri'];
  }

  addTitlu(): void {
    const newTitluForm = this._formSet.titluri('newTitlu');
    const arrayControl = this.titluriForm.get('titluri') as FormArray;
    arrayControl.insert(0, newTitluForm);
    this._setAddBtn.setStatus(false);
  }

}
