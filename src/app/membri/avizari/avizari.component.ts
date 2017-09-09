import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { FormSetService } from '../../services/form-set.service';
import { MembriService } from '../../services/membri.service';
import { Asigurator } from '../../shared/models/registre.model';
import { Avizare } from '../../shared/interfaces/avizari.interface';

@Component({
  selector: 'app-avizari',
  templateUrl: './avizari.component.html',
  styleUrls: ['./avizari.component.css']
})
export class AvizariComponent implements OnInit {
  loading = true;
  registruAsiguratori: Asigurator[];
  formAvizariData: Avizare[];
  formAvizari: FormGroup;
  formArrayAvizare: FormArray;

  constructor(
    private _aRoute: ActivatedRoute,
    private _router: Router,
    private _memService: MembriService,
    private _snack: MdSnackBar,
    private _formSet: FormSetService,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    localStorage.setItem('currentPage', 'Avizari');
    this.setRegistre();
    this.getFormData();
    this.formAvizari = this.toFormGroup();
  }

  setRegistre(): void {
    // TODO: de mutat unde ne trebuie, acum il plimbam aiurea peste tot
    this.registruAsiguratori = this._aRoute.snapshot.data['regAsiguratori'];
  }

  getFormData(): void {
    this.loading = true;
    this._memService.listaMembruDate('dlp', localStorage.getItem('currentMemId'))
      .subscribe(data => {
        if (data.result === '12') {
          this._snack.open(data.mesaj, 'inchide', { duration: 5000 });
          this._router.navigate(['/login']);
        } else {
          this.formAvizariData = data;
          this.sortDlp();
          this.loading = false;
          this.toFormGroupTest();
        }
      });
    // TODO: de ordonat datele in functie de data calendaristica descrescator
  }

  sortDlp(): void {
    this.formAvizariData.sort((a: Avizare, b) => {
      return a.dlp_data_start > b.dlp_data_start ? -1 : 1;
    });
  }

  toFormGroup(): FormGroup {
    this.formArrayAvizare = this._fb.array([]);
    const formGroup = this._fb.group({
      avizari: this.formArrayAvizare
    });
    return formGroup;
  }

  toFormGroupTest() {
    // console.log('form initial');
    // console.log(this.formAvizari);
    this.formAvizariData.forEach((avizareData: Avizare) => {
      // console.log(avizareData);
      const avizareForm = this._formSet.avizare(avizareData);
      this.formArrayAvizare.push(avizareForm);
      // aici luam sir si ii bagam un item in lista
      // console.log(this._formSet.avizare(avizareData));
      // this.formAvizari.addControl('avizari', this._formSet.avizare(avizareData));
    });
  }
}
