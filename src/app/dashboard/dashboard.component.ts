import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { User } from '../shared/models/user.model';
import { UserService } from '../services/user.service';
import { MembriService } from '../services/membri.service';
import { ApiDataService } from '../services/api-data.service';
import { ApiData } from '../shared/interfaces/message.interface';
import { AlertSnackbarService } from '../services/alert-snackbar.service';
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchForm: FormGroup;
  currentUser: User;
  users: User[] = [];
  membri: any[];
  emptySearchResult = false;
  loading = false;
  dialogResult: any;

  constructor(private userService: UserService,
    private membriService: MembriService,
    private router: Router,
    private snackBar: MdSnackBar,
    private _apiData: ApiDataService,
    private _snackBarService: AlertSnackbarService,
    private _dialogService: DialogService
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      'searchMem': new FormControl(null, [Validators.required, Validators.minLength(3)])
    });
    this.resetMedicSelectatDate();
  }

  resetMedicSelectatDate(): void {
    localStorage.removeItem('currentMemNume');
    localStorage.removeItem('currentMemId');
    localStorage.removeItem('currentMemCuim');
    localStorage.setItem('currentPage', 'Pagina de start');
  }


  onSearch(searchVal: string) {
    if (this.searchForm.valid) {
      this.loading = true;
      this.emptySearchResult = false;
      this._apiData.apiCautaMembru('list', searchVal)
        .subscribe((response: ApiData) => {
          this.loading = false;
          if (response.data.length === 0 || response.status === 0) {
            this.emptySearchResult = true;
            return;
          }
          this.membri = response.data;
        });
    }
  }

  onClickMem(id: string, actiune: string) {
    this.setMedicSelectatDate(id);
    this.router.navigate(['/membri', id, actiune]);
  }

  onNewMember(): void {
    this.setMedicSelectatDate('');
    this.router.navigate(['/membri/nou']);
  }

  setMedicSelectatDate(id: string): void {
    if (id === '') {
      localStorage.setItem('currentMemNume', 'Membru Nou');
      return;
    }
    localStorage.setItem('currentMemNume',
      this.membri.find(item => item.id === id).nume
      + ' '
      + this.membri.find(item => item.id === id).prenume);
    localStorage.setItem('currentMemId', id);
    localStorage.setItem('currentMemCuim', this.membri.find(item => item.id === id).cuim);
    return;
  }
}
