import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Adresa } from '../../../shared/interfaces/contact.interface';
import { MembriService } from '../../../services/membri.service';
import { FormValidatorsService } from '../../../services/form-validators.service';
import { FormSetService } from '../../../services/form-set.service';
import { Judet, Tara } from '../../../shared/models/registre.model';
import { RegLista } from '../../../shared/interfaces/listareg.interface';

@Component({
  selector: 'app-adresa',
  templateUrl: './adresa.component.html',
  styleUrls: ['./adresa.component.css']
})
export class AdresaComponent implements OnInit {
  @Input('formAdresaData')
  formAdresaData: Adresa;

  @Input('registruTara')
  registruTara: Tara[];

  @Input('registruJudet')
  registruJudet: Judet[];

  formStatus = 0;
  isAdmin = false;
  isHidden = true; // true
  itemName: string;
  adresaForm: FormGroup;
  listaTipAdresa = [
    { id: 'DO', nume: 'Domiciliu' },
    { id: 'CO', nume: 'Contact' },
    { id: 'LM', nume: 'Loc de Munca' }
  ];

  // TODO: de revazut unde e cel mai  bine sa stea rezolvarea registrelor
  filteredTara;
  filteredJudet;

  constructor(
    private _fb: FormBuilder,
    private _membriService: MembriService,
    private _snackBar: MdSnackBar,
    private _router: Router,
    private _validator: FormValidatorsService,
    private _formSet: FormSetService,
    private _aRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.adresaForm = this._formSet.adresa(this.formAdresaData);
    this.setFormStatus();
    this.setFormName();
    this.setFilterRegistre();
  }

  setFormStatus(): void {
    if (this.adresaForm.get('id_adresa').value) {
      this.formStatus = 1;
    }
  }

  setFormName(): void {
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

  setFilterRegistre(): void {
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
    const data = this.adresaForm.value;
    const idItem = data.id_adresa;
    delete data.id_adresa;
    if (this.formStatus === 1) {
      this._membriService.modificaMembruDate('adresa', idItem, data)
        .subscribe(
        returned => {
          if (returned.result !== '00') {
            this._snackBar.open(returned.mesaj, 'inchide', { duration: 5000 });
            if (returned.result === '12') {
              this._router.navigate(['/login']);
            }
          } else {
            this._snackBar.open(returned.mesaj, 'inchide', { duration: 5000 });
          }
        });
      return;
    }
    data.id_mem = +localStorage.getItem('currentMemId');
    this._membriService.adaugaMembruContact('adresa', null, data)
      .subscribe(
      returned => {
        if (returned.result !== '00') {
          this._snackBar.open(returned.mesaj, 'inchide', { duration: 5000 });
          if (returned.result === '12') {
            this._router.navigate(['/login']);
          }
        } else {
          this._snackBar.open(returned.mesaj, 'inchide', { duration: 5000 });
        }
      });
    return;
  }

  onClickTest(): void {
    console.log(this.adresaForm);
  }
}
