import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import { Cpp, Cpps } from '../../shared/interfaces/cpps.interface';
import { ApiDataService } from '../../services/api-data.service';
import { ApiData } from '../../shared/interfaces/message.interface';

@Component({
  selector: 'app-cpps',
  templateUrl: './cpps.component.html',
  styleUrls: ['./cpps.component.css']
})
export class CppsComponent implements OnInit {
  // asculta pt nou cpp din child
  public static needReload: Subject<any> = new Subject();

  public formData: Cpps;

  loading = true;
  formStatus = 1;
  // formStatus:
  // 0 - admin - vine din local storage cmj -
  // 1 - read-only - vine din json
  // 2 - newMember - vine din cale
  // 3 - edit - vine din json

  constructor(
    private _apiData: ApiDataService,
    private _fb: FormBuilder,
    private _aRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    sessionStorage.setItem('currentPage', 'Pregatire Postuniversitara');
    this.getFormData();
    // reincarca datele pt formular daca child s a schimbat
    CppsComponent.needReload.subscribe(res => {
      this.getFormData();
    });
  }


  private getFormData(): void {
    this.loading = true;
    this._apiData.apiLista('cpp', this._aRoute.snapshot.params['id'])
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        this.formData = response.data;
        this.sortCpp();
        this.loading = false;
      });
  }

  private sortCpp(): void {
    // 1. Ordonare dupa data
    Object(this.formData).sort((a, b) => {
      return a.date_start > b.date_start ? -1 : 1;
    });
    // 2. ordonare dupa tip_cpp
    Object(this.formData).sort((a, b) => {
      return a.reg_cpp_tip_id < b.reg_cpp_tip_id ? -1 : 1;
    });
  }
}
