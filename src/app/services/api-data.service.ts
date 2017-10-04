import { Injectable } from '@angular/core';

import { MdSnackBar, MdDialogRef } from '@angular/material';
import { Response, Http } from '@angular/http';
import { MdDialog } from '@angular/material';
import { AuthDialogComponent } from '../shared/auth-dialog/auth-dialog.component';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AlertSnackbarService } from './alert-snackbar.service';
import { GlobalDataService } from './global-data.service';
import { DialogService } from './dialog.service';

@Injectable()
export class ApiDataService {
  private apiAddress = '';

  constructor(
    private _http: Http,
    private _globalVars: GlobalDataService,
    private _snackBarService: AlertSnackbarService,
    private _mdDialog: MdDialog,
    private _router: Router,
    private _dialogService: DialogService
  ) {
    this.apiAddress = this._globalVars.shareObj['apiAdress'];
  }

  apiCautaMembru(actiune: string, searchVal: string) {
    return this._http.put(this.apiAddress + 'api/lista', this.setApiListaData(actiune, searchVal))
      .map((response: Response) => {
        const data = response.json();
        const status = this.checkApiResponse(data);
        return { data: data, status: status };
      });
  }

  apiLista(actiune: string, id: string) {
    return this._http.put(this.apiAddress + 'api/lista', this.setApiGetData(actiune, id))
      .map((response: Response) => {
        const data = response.json();
        const status = this.checkApiResponse(data);
        return { data: data, status: status };
      });
  }

  apiGet(actiune: string, id: string) {
    return this._http.put(this.apiAddress + 'api/get/' + id, this.setApiGetData(actiune, id))
      .map((response: Response) => {
        const data = response.json();
        const status = this.checkApiResponse(data);
        return { data: data, status: status };
      });
  }

  apiAdauga(actiune: string, data: any) {
    return this._http.put(this.apiAddress + 'api/adauga', this.setApiAdaugaData(actiune, data))
      .map((response: Response) => {
        console.log(response);
        const dataApi = response.json();
        const status = this.checkApiResponse(dataApi);
        return { data: dataApi, status: status };
      });
  }

  apiModifica(actiune: string, id: number, data: any) {
    return this._http.put(this.apiAddress + 'api/modifica', this.setApiModificaData(actiune, id, data))
      .map((response: Response) => {
        const dataApi = response.json();
        const status = this.checkApiResponse(dataApi);
        return { data: data, status: status };
      });
  }

  private setApiListaData(actiune: string, searchVal: string) {
    return JSON.stringify({
      'token': localStorage.getItem('userToken'),
      'actiune': actiune,
      'cautare': searchVal
    });
  }

  private setApiGetData(actiune: string, id: string) {
    return JSON.stringify({
      'token': localStorage.getItem('userToken'),
      'actiune': actiune,
      'id': id
    });
  }

  private setApiAdaugaData(actiune: string, data: any) {
    return JSON.stringify({
      'token': localStorage.getItem('userToken'),
      'actiune': actiune,
      'data': data
    });
  }

  private setApiModificaData(actiune: string, id: number, data: string) {
    return JSON.stringify({
      'token': localStorage.getItem('userToken'),
      'actiune': actiune,
      'id': id,
      'data': data
    });
  }


  private checkApiResponse(response): number {
    if (response === null) {
      this._snackBarService.showSnackBar('A aparut o eroare la conectarea cu serverul');
      return 0;
    }
    switch (response.result) {
      case '12':
        this.callAuth();
        return 0;

      case '00':
        this._snackBarService.showSnackBar(response.mesaj);
        return 1;

      case '14':
        this._snackBarService.showSnackBar(response.mesaj);
        return 0;

      default:
        break;
    }

    if (response.result === '12') {
      this.callAuth();
      return 0;
    }
    return 1;
  }

  private callAuth() {
    this._dialogService.authDialog()
      .subscribe(res => {
        return;
      });
  }
}

