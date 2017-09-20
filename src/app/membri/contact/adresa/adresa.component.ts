import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Adresa } from '../../../shared/interfaces/contact.interface';
import { MembriService } from '../../../services/membri.service';
import { FormValidatorsService } from '../../../services/form-validators.service';
import { FormSetService } from '../../../services/form-set.service';
import { Judet, Tara } from '../../../shared/models/registre.model';
import { RegLista } from '../../../shared/interfaces/listareg.interface';
import { ContactComponent } from '../contact.component';
import { AlertSnackbarService } from '../../../services/alert-snackbar.service';
import { ApiDataService } from '../../../services/api-data.service';
import { ApiData } from '../../../shared/interfaces/message.interface';
import { AdreseListComponent } from '../adrese-list/adrese-list.component';

@Component({
  selector: 'app-adresa',
  templateUrl: './adresa.component.html',
  styleUrls: ['./adresa.component.css']
})
export class AdresaComponent implements OnInit {
  @Input('adresaData')
  adresaData: Adresa;

  @Input('adreseForm')
  adreseForm: FormGroup;

  @Input('registruTara')
  registruTara: Tara[];
  filteredTara;

  @Input('registruJudet')
  registruJudet: Judet[];
  filteredJudet;

  loading = false;
  formStatus = 'new';
  isHidden = true; // true
  itemName: string;
  adresaForm: FormGroup;
  listaTipAdresa = [
    { id: 'DO', nume: 'Domiciliu' },
    { id: 'CO', nume: 'Contact' },
    { id: 'LM', nume: 'Loc de Munca' }
  ];

  // TODO: de revazut unde e cel mai  bine sa stea rezolvarea registrelor


  constructor(
    private _fb: FormBuilder,
    private _snackBar: AlertSnackbarService,
    private _router: Router,
    private _validator: FormValidatorsService,
    private _formSet: FormSetService,
    private _aRoute: ActivatedRoute,
    private _apiData: ApiDataService,

    private _membriService: MembriService,
  ) { }

  ngOnInit() {
    this.setForm();
    this.setFormStatus();
    this.setFormName();
    this.setRegistre();
  }

  private setForm(): void {
    this.adresaForm = this._formSet.adresa(this.adresaData);
  }

  private setFormStatus(): void {
    if (this.adresaForm.get('id_adresa').value) {
      this.formStatus = 'edit';
    }
  }

  private setFormName(): void {
    const tip = this.adresaForm.get('tip').value;
    switch (tip) {
      case null:
        this.itemName = 'Adresa Noua';
        this.isHidden = false;
        break;
      case 'DO':
        this.itemName = 'Adresa Domiciliu';
        break;
      case 'CO':
        this.itemName = 'Adresa Contact';
        break;
      case 'LM':
        this.itemName = 'Loc de munca';
        break;
      default:
        this.itemName = 'Nu exista in lista';
    }
  }

  private setRegistre(): void {
    this.filteredTara = this.adresaForm.get('tara_id').valueChanges
      .startWith(null)
      .map(tara => tara && typeof tara === 'object' ? tara.nume : tara)
      .map(nume => nume ? this.filterTara(nume) : this.registruTara.slice());

    this.filteredJudet = this.adresaForm.get('jud_id').valueChanges
      .startWith(null)
      .map(judet => judet && typeof judet === 'object' ? judet.nume : judet)
      .map(nume => nume ? this.filterJudet(nume) : this.registruJudet.slice());
  }

  displayFnTara(option: number): string {
    if (option) {
      return this.registruTara.find(item => item.id === option).nume;
    }
  }

  filterTara(nume: string): Tara[] {
    return this.registruTara.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  displayFnJudet(option) {
    if (option) {
      return this.registruJudet.find(item => item.id === +option).nume;
    }
  }

  filterJudet(nume: string): Judet[] {
    return this.registruJudet.filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  onClickAdresa(): void {
    if (this.adresaForm.valid === false) {
      this._snackBar.showSnackBar('Formular invalid');
      return;
    }
    this.loading = true;
    const formData: Adresa = this.adresaForm.value;
    const adresaId = formData.id_adresa;
    // TODO: aceiasi problema in api
    delete formData.id_adresa;
    if (this.formStatus === 'new') {
      this._apiData.apiAdauga('adresa', formData)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        ContactComponent._formDataChanged.next();
      });
      return;
    }

    this._apiData.apiModifica('adresa', adresaId, formData)
    .subscribe((response: ApiData) => {
      if (response.status === 0) {
        return;
      }
      this.loading = false;
    });
    return;
  }
}
