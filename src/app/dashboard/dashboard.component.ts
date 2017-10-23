import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

import { User } from '../shared/models/user.model';
import { UserService } from '../services/user.service';
import { MembriService } from '../services/membri.service';
import { ApiDataService } from '../services/api-data.service';
import { ApiData } from '../shared/interfaces/message.interface';
import { AlertSnackbarService } from '../services/alert-snackbar.service';
import { DialogService } from '../services/dialog.service';
import { Judet } from '../shared/models/registre.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchForm: FormGroup;
  searchFormCMR: FormGroup;
  currentUser: User;
  users: User[] = [];
  membri: any[];
  membriCMR: any[];
  emptySearchResult = false;
  emptySearchResultCMR = false;
  loading = false;
  loadingCMR = false;
  dialogResult: any;
  registruJudete: Judet[];
  nuAvemJudet = false;

  constructor(private userService: UserService,
    private membriService: MembriService,
    private router: Router,
    private snackBar: MatSnackBar,
    private _apiData: ApiDataService,
    private _snackBarService: AlertSnackbarService,
    private _dialogService: DialogService,
    private _title: Title,
    private _aRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.setRegistre();
    this._title.setTitle(environment.titluAplicatie);
    this.setForm();
    this.resetMedicSelectatDate();
    this.checkDateCMJ();
  }


  setRegistre(): void {
    this.registruJudete = this._aRoute.snapshot.data['regJud'];
    const delValRegJud = ['ADM', 'CMR'];
    delValRegJud.forEach(element => {
      this.registruJudete = this.registruJudete.filter(option => option.nume !== element);
    });
  }

  setForm() {
    this.searchForm = new FormGroup({
      'searchMem': new FormControl(null, [Validators.required, Validators.minLength(3)])
    });
    this.searchFormCMR = new FormGroup({
      'searchMemCMR': new FormControl(null, [Validators.required, Validators.minLength(3)])
    });
  }

  resetMedicSelectatDate(): void {
    sessionStorage.removeItem('currentMemNume');
    sessionStorage.removeItem('currentMemId');
    sessionStorage.removeItem('currentMemCuim');
    sessionStorage.setItem('currentPage', 'Pagina de start');
  }

  // TODO: de verificat daca avem nevoie de ambele
  filterJud(nume: string): Judet[] {
    return this.registruJudete
      .filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  displayFnJudet(option) {
    if (option) {
      return this.registruJudete.find(item => item.id === +option).nume;
    }
  }

  onSearch(searchVal: string, searchType: string) {
    this.membri = [];
    this.membriCMR = [];
    switch (searchType) {
      case 'cmj':
        if (this.searchForm.valid === false) {
          this._snackBarService.showSnackBar('Formular Invalid');
          return;
        }
        searchVal = searchVal.trim();
        this.loading = true;
        this.emptySearchResult = false;
        this._apiData.apiCautaMembru('list', searchVal)
          .subscribe((response: ApiData) => {
            this.loading = false;
            if (response.data === null || response.data.length === 0 || response.status === 0) {
              this.emptySearchResult = true;
              return;
            }
            this.membri = response.data;
          });
        return;

      case 'cmr':
        if (this.searchFormCMR.valid === false) {
          this._snackBarService.showSnackBar('Formular Invalid');
          return;
        }
        searchVal = searchVal.trim();
        this.loadingCMR = true;
        this.emptySearchResultCMR = false;
        this._apiData.apiCautaMembru('list_national', searchVal)
          .subscribe((response: ApiData) => {
            this.loadingCMR = false;
            if (response.data === null || response.data.length === 0 || response.status === 0) {
              this.emptySearchResultCMR = true;
              return;
            }
            this.membriCMR = response.data;
          });
        break;

      default:
        break;
    }


  }

  onSearchFocus(field: string): void {
    this.searchForm.reset();
    this.searchFormCMR.reset();
    switch (field) {
      case 'cmj':
        this.emptySearchResult = false;
        // this.searchForm.get('searchMem').setValue('');
        this.membri = [];
        return;

      case 'cmr':
        this.emptySearchResultCMR = false;
        // this.searchFormCMR.get('searchMemCMR').setValue('');
        this.membriCMR = [];
        return;

      default:
        break;

    }
  }

  onClickMem(id: string, actiune: string) {
    this.setMedicSelectatDate(id);
    this.router.navigate(['/membri', id, actiune]);
  }

  onClickCMJ() {
    this.router.navigate(['/cmj/date']);
  }

  onNewMember(): void {
    this.setMedicSelectatDate('');
    this.router.navigate(['/membri/nou']);
  }

  setMedicSelectatDate(id: string): void {
    if (id === '') {
      sessionStorage.setItem('currentMemNume', 'Membru Nou');
      return;
    }
    sessionStorage.setItem('currentMemNume',
      this.membri.find(item => item.id === id).nume
      + ' '
      + this.membri.find(item => item.id === id).prenume);
    sessionStorage.setItem('currentMemId', id);
    sessionStorage.setItem('currentMemCuim', this.membri.find(item => item.id === id).cuim);
    return;
  }

  private checkDateCMJ(): void {
    this._apiData.apiLista('cmj', sessionStorage.getItem('userGroup'))
    .subscribe((response: ApiData) => {
      if (response.status === 0) {
        return;
      }
      const listaCMJ = response.data;
      const judetId = sessionStorage.getItem('userGroup');
      const judetDate = listaCMJ.filter(item => +item.id_reg_jud === +judetId)[0];
      if (typeof judetDate === 'undefined') {
        this.nuAvemJudet = true;
        return;
      }
    });
  }
}
