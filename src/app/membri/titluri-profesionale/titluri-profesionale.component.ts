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
    localStorage.setItem('currentPage', 'Titluri Profesionale');
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

  }

  private getFormData(): void {
    const memId = +localStorage.getItem('currentMemId');

    // this._apiData.apiLista('titluri', memId)
    //   .subscribe((response: ApiData) => {
    //     if (response.status === 0) {
    //       return;
    //     }
    //     this.titluriData = response.data;
    //     this.sortData();
    //     this.setForm('populate', this.titluriData);
    //     this.loading = false;
    //   });


    // ========================= //
    // temp pt teste
    const temp: Titlu[] = [{
      'id_cdu': 1,
      'id_mem': memId,
      'reg_titlu_id': 1,
      'reg_facultate_id': null,
      'status': 0,
      'data_start': '2017-01-01',
      'data_end': ''
    },
    {
      'id_cdu': 2,
      'id_mem': memId,
      'reg_titlu_id': 2,
      'reg_facultate_id': null,
      'status': 0,
      'data_start': '2017-01-01',
      'data_end': ''
    },
    {
      'id_cdu': 3,
      'id_mem': memId,
      'reg_titlu_id': 9,
      'reg_facultate_id': 11,
      'status': 0,
      'data_start': '2017-01-01',
      'data_end': ''
    },
    {
      'id_cdu': 3,
      'id_mem': memId,
      'reg_titlu_id': 9,
      'reg_facultate_id': 11,
      'status': 0,
      'data_start': '2017-01-01',
      'data_end': '2018-01-01'
    }];
    this.titluriData = temp;
    this.setForm('populate', this.titluriData);
    this.loading = false;

    // ============================== //
    return;
  }

  private sortData(): void {
    this.titluriData
      .sort((a: Titlu, b) => {
        return a.data_start > b.data_start ? -1 : 1;
      });
  }
}
