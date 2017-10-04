import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormSetService } from '../../../services/form-set.service';
import { ItemRegFac } from '../../../shared/interfaces/fac.interface';
import { ItemRegLista } from '../../../shared/interfaces/listareg.interface';


@Component({
  selector: 'app-titlu-profesional',
  templateUrl: './titlu-profesional.component.html',
  styleUrls: ['./titlu-profesional.component.css']
})
export class TitluProfesionalComponent implements OnInit {

  @Input('titluriForm')
  public titluriForm;

  @Input('arrayIndex')
  public arrayIndex;

  @Input('regFacultati')
  public regFacultati;
  filteredFacultati;

  @Input('regTitluri')
  public regTitluri;
  filteredTitluri;

  loading = false;
  titluForm: FormGroup;
  itemStatus;
  // 0 - Draf / New
  // 1 - Complet - nu se foloseste pt formul acesta
  // 2 - Activ - produce efecte
  // 3 - Inactiv
  itemTip;

  constructor(
    private _formSet: FormSetService,
  ) {
  }
  ngOnInit() {
    this.setForm();
    this.setFormStatus();
    this.setRegistre();
  }

  private setForm(): void {
    const data = (<FormArray>this.titluriForm.get('titluri')).at(this.arrayIndex).value;
    this.titluForm = this._formSet.titluri('add', data);
  }

  private setFormStatus(): void {
    // avem de setat itemStatus -> vine din DB
    // avem de setat itemType -> se calculeaza:
    //    - din registru tip titlu
    //    - input user pt nou

  }

  private setRegistre(): void {
    this.filteredFacultati = this.titluForm.get('reg_facultate_id').valueChanges
      .startWith(null)
      .map(fac => fac && typeof fac === 'object' ? fac.nume : fac)
      .map(nume => nume ? this.filterFacultate(nume) : this.regFacultati.slice());
    this.filteredTitluri = this.titluForm.get('reg_titlu_id').valueChanges
      .startWith(null)
      .map(tip => tip && typeof tip === 'object' ? tip.nume : tip)
      .map(nume => nume ? this.filterTitlu(nume) : this.regTitluri.slice());
  }

  displayFnFacultate(option: number): string {
    if (option) {
      return this.regFacultati.find(item => item.id === option).nume;
    }
  }

  filterFacultate(nume: string): ItemRegLista[] {
    return this.regFacultati.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  displayFnTitlu(option: number): string {
    if (option) {
      return this.regTitluri.find(item => item.id === option).nume;
    }
  }

  filterTitlu(nume: string): ItemRegLista[] {
    return this.regTitluri.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }
}
