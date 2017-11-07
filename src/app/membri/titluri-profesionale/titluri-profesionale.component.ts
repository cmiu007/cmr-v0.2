import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormArray } from '@angular/forms';
import { Titluri, Titlu } from '../../shared/interfaces/titluri.interface';
import { ApiDataService } from '../../services/api-data.service';
import { FormSetService } from '../../services/form-set.service';
import { ApiData } from '../../shared/interfaces/message.interface';

@Component({
  selector: 'app-titluri-profesionale',
  templateUrl: './titluri-profesionale.component.html',
  styleUrls: ['./titluri-profesionale.component.css']
})
export class TitluriProfesionaleComponent implements OnInit {
  public static _formDataChanged: Subject<boolean> = new Subject;
  loading = true;
  titluriForm: FormGroup;
  titluriData: Titlu[];


  constructor(
    private _apiData: ApiDataService,
    private _formSet: FormSetService
  ) { }

  ngOnInit() {
    this.setPageName();
    this.setForm('init');
    this.getFormData();
    TitluriProfesionaleComponent._formDataChanged
      .subscribe(result => {
        this.setForm('init');
        this.getFormData();
      });
    // TODO: de scos
    // console.log(this.titluriForm);
  }

  private setPageName(): void {
    sessionStorage.setItem('currentPage', 'Titluri Profesionale');
  }

  private setForm(actiune: string, data?: Titlu[], form?: FormGroup): void {
    switch (actiune) {
      case 'init':
        this.titluriForm = this._formSet.titluri('initForm');
        break;

      case 'populate':
        const titluForm = this.titluriForm.get('titluri') as FormArray;
        this.titluriData.forEach((item: Titlu) => {
          titluForm.push(this._formSet.titluri('add', item, form));
        });
        break;

      default:
        break;
    }
    this.loading = false;

  }

  private getFormData(): void {
    const memId = sessionStorage.getItem('currentMemId');
    this.titluriData = [];
    this._apiData.apiLista('titlu', memId)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.titluriData = response.data;
        this.sortData();
        this.setForm('populate', this.titluriData);
        this.loading = false;
      });
    return;
  }

  private sortData(): void {
    this.titluriData
      .sort((a: Titlu, b) => {
        return a.data_start > b.data_start ? -1 : 1;
      });
  }
}
