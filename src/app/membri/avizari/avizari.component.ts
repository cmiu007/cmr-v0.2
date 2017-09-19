import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { FormSetService } from '../../services/form-set.service';
import { Avizare } from '../../shared/interfaces/avizari.interface';
import { ApiDataService } from '../../services/api-data.service';
import { ApiData } from '../../shared/interfaces/message.interface';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-avizari',
  templateUrl: './avizari.component.html',
  styleUrls: ['./avizari.component.css']
})
export class AvizariComponent implements OnInit {
  public static _formDataChanged: Subject<boolean> = new Subject;
  loading = true;
  formAvizariData: Avizare[];
  formAvizari: FormGroup;
  formArrayAvizare: FormArray;

  constructor(
    private _apiData: ApiDataService,
    private _formSet: FormSetService,
    private _fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.setHeader();
    this.getFormData();
    this.formAvizari = this.toFormGroup();
    AvizariComponent._formDataChanged
      .subscribe(result => {
        this.getFormData();
        this.formAvizari = this.toFormGroup();
      });
  }

  private setHeader(): void {
    localStorage.setItem('currentPage', 'Avizari');
  }

  private getFormData(): void {
    this.loading = true;
    const memId = localStorage.getItem('currentMemId');
    this._apiData.apiLista('dlp', memId)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.formAvizariData = response.data;
        this.sortDlp();
        this.toFormGroupTest();
        this.loading = false;
      });
  }

  private sortDlp(): void {
    this.formAvizariData.sort((a: Avizare, b) => {
      return a.dlp_data_start > b.dlp_data_start ? -1 : 1;
    });
  }

  private toFormGroup(): FormGroup {
    this.formArrayAvizare = this._fb.array([]);
    const formGroup = this._fb.group({
      avizari: this.formArrayAvizare
    });
    return formGroup;
  }

  private toFormGroupTest(): void {
    this.formAvizariData.forEach((avizareData: Avizare) => {
      const avizareForm = this._formSet.avizare(avizareData);
      this.formArrayAvizare.push(avizareForm);
    });
  }
}
