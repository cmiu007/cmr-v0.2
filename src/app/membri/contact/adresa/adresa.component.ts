import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Adresa } from '../../../shared/interfaces/contact.interface';
import { MembriService } from '../../../services/membri.service';
import { FormValidatorsService } from '../../../services/form-validators.service';
import { FormSetService } from '../../../services/form-set.service';

@Component({
  selector: 'app-adresa',
  templateUrl: './adresa.component.html',
  styleUrls: ['./adresa.component.css']
})
export class AdresaComponent implements OnInit {
  @Input('formAdresaData')
  formAdresaData: Adresa;
  formStatus = 0;
  isAdmin = false;
  isHidden = true; // true
  itemName: string;
  filteredTara;
  filteredJud;
  adresaForm: FormGroup;
  listaTipAdresa = [
    {id: 'LO' , nume: 'Adresa Domiciliu'},
    {id: 'CO' , nume: 'Adresa Contact'},
    {id: 'LM' , nume: 'Adresa Loc de Munca'}
  ];

  constructor(
    private _fb: FormBuilder,
    private _membriService: MembriService,
    private _snackBar: MdSnackBar,
    private _router: Router,
    private _validator: FormValidatorsService,
    private _formSet: FormSetService
  ) { }

  ngOnInit() {
    this.adresaForm = this._formSet.adresa(this.formAdresaData);
    this.setFormStatus();
    this.setFormName();
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
    this._membriService.adaugaMembruContact('adresa', null , data)
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
}
