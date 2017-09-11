import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Adresa } from '../../../shared/interfaces/contact.interface';
import { Avizare } from '../../../shared/interfaces/avizari.interface';
import { Asigurator } from '../../../shared/models/registre.model';
import { FormSetService } from '../../../services/form-set.service';
import { MembriService } from '../../../services/membri.service';
import { DataCalService } from '../../../services/data-cal.service';
import { Asigurare } from '../../../shared/interfaces/asigurari.interface';
import { AvizariListComponent } from '../avizari-list/avizari-list.component';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-avizare',
  templateUrl: './avizare.component.html',
  styleUrls: ['./avizare.component.css']
})
export class AvizareComponent implements OnInit {
  public static addActiveSubj: Subject<boolean> = new Subject;

  @Input('formAvizari')
  public formAvizari: FormGroup;

  @Input('arrayIndex')
  public arrayIndex;

  formStatus = 0;
  // 0 - new
  // 1 - draft
  // 2 - activ
  // 3 - inactiv
  isAdmin = false;
  isHidden = false;
  isListaAsigurariHidden = true;
  itemName = '';
  avizareForm: FormGroup;
  formTitleStyle;
  loading = false;

  asigurariLoading = false;
  asigurariFormData: Asigurare[];
  asigurareFormArray: FormArray;

  filteredAsigurator;

  constructor(
    private _formSet: FormSetService,
    private _membriService: MembriService,
    private _snackBar: MdSnackBar,
    private _router: Router,
    private _dataCal: DataCalService,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    const a = this.formAvizari.get('avizari') as FormArray;
    this.avizareForm = this._formSet.avizare(a.at(this.arrayIndex).value);
    this.setFormStatus();
    this.initArrayInFormGroup();
    AvizareComponent.addActiveSubj
      .subscribe( result => {
        const b = this.formAvizari.get('avizari') as FormArray;
        this.avizareForm = this._formSet.avizare(b.at(this.arrayIndex).value);
        this.setFormStatus();
        this.initArrayInFormGroup();
      });
   }

  setFormStatus(): void {
    const dataStart = this._dataCal.strToDate(this.avizareForm.get('dlp_data_start').value);
    const dataEnd = this._dataCal.strToDate(this.avizareForm.get('dlp_data_end').value);
    if (this._dataCal.isInTheFuture(dataStart)) {
      this.itemName = 'Draft ';
      this.formStatus = 1;
    } else {
      if (this._dataCal.isInTheFuture(dataEnd)) {
        this.itemName = 'Activ ';
        this.formTitleStyle = ['active'];
        this.formStatus = 2;
      } else {
        if (this._dataCal.isInThePast(dataEnd)) {
          this.itemName = 'Inactiv ';
          this.formTitleStyle = ['inactive'];
          this.formStatus = 3;
        }
      }
    }
    this.setForm();
    this.isHidden = true;
    this.itemName = this.itemName +
      this.avizareForm.get('dlp_data_start').value + ' pana la ' +
      this.avizareForm.get('dlp_data_end').value;
    if (this.avizareForm.get('dlp_data_start').value === '') {
      this.itemName = 'Avizare Noua';
      this.isHidden = false;
    }
  }

  setForm(): void {
    if (this.formStatus === 2 || this.formStatus === 3) {
      Object.keys(this.avizareForm.controls).forEach(
        key => {
          this.avizareForm.get(key).disable();
        });
    }
  }

  addDlpDateEnd(): void {
    if (this.avizareForm.get('dlp_data_start').value !== '') {
      this.avizareForm.get('dlp_data_end').setValue(this._dataCal.addOneYear(this.avizareForm.get('dlp_data_start').value));
    }
  }

  onClickAvizare(): void {
    this.loading = true;
    const data = this.avizareForm.value;
    const idItem = data.id_dlp;
    // delete pt api lu' peste
    delete data.id_dlp;
    delete data.inchis;
    delete data.asigurare;
    console.log(data);
    if (this.formStatus !== 0) {
      this._membriService.modificaMembruDate('dlp', idItem, data)
        .subscribe(
        returned => {
          if (returned.result !== '00') {
            this._snackBar.open(returned.mesaj, 'inchide', { duration: 5000 });
            if (returned.result === '12') {
              this._router.navigate(['/login']);
            }
          } else {
            this._snackBar.open(returned.mesaj, 'inchide', { duration: 5000 });
            this._router.navigate(['/reflector']);
          }
        });
      return;
    }
    this._membriService.adaugaMembruContact('dlp', null, data)
      .subscribe(
      returned => {
        if (returned.result !== '00') {
          this._snackBar.open(returned.mesaj, 'inchide', { duration: 5000 });
          if (returned.result === '12') {
            this._router.navigate(['/login']);
          }
        } else {
          this._snackBar.open(returned.mesaj, 'inchide', { duration: 5000 });
          this._router.navigate(['/reflector']);
        }
      });
    return;
  }

  onClickAsigurare(): void {
    this.loading = true;
    // this.initArrayInFormGroup();
    // get asigurari
    this.getAsigurariData();
    this.isListaAsigurariHidden = !this.isListaAsigurariHidden;
  }

  getAsigurariData(): void {
    this.asigurariLoading = true;
    this._membriService.listaMembruDate('asigurare', localStorage.getItem('currentMemId'))
    .subscribe(data => {
      if (data.result === '12') {
        this._snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
        this._router.navigate(['/login']);
      } else {
        this.asigurariFormData = data;
        this.setAsigurariData();
        this.setAsigurariArray();
        this.loading = false;
      }
    });
  }

  initArrayInFormGroup(): void {
    this.asigurareFormArray = this._fb.array([]);
    this.avizareForm.addControl( 'asigurare',  this.asigurareFormArray );
  }

  setAsigurariArray(): void {
    this.asigurariFormData.forEach(
      (asigurareData: Asigurare) => {
        const asigurareForm = this._formSet.asigurare(asigurareData);
        const control = <FormArray>this.avizareForm.controls['asigurare'];
        control.push(asigurareForm);
      }
    );
  }

  setAsigurariData(): void {
    // filtram asigurarile care corespund avizarii active
    this.asigurariFormData = this.asigurariFormData.filter(
      asigurare => asigurare.id_dlp === +this.avizareForm.get('id_dlp').value
    );
  }

  delAvizare(): void {
    const control = <FormArray>this.formAvizari.controls['avizari'];
    control.removeAt(0);
    // show add again
    AvizariListComponent.addActiveSubj.next();
  }

  onClickDetali(): void {

  }
}
