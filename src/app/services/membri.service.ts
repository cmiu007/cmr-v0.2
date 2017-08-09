import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { GlobalDataService } from './global-data.service';

// TODO: de refacut totul cu denumirile corecte, acum este varza
// TODO: de focut acelasi lucru pt Membru
// import { User } from '../shared/models/user.model';

@Injectable()
export class MembriService {
  apiAddress: string;

  constructor(
    private http: Http,
    private globalVars: GlobalDataService
    ) {
      this.apiAddress = this.globalVars.shareObj['apiAdress'];
    }

  getAll(actiune: string, searchVal: string) {
    return this.http.put( this.apiAddress + 'api/lista', this.setPutValueLista(actiune, searchVal))
      .map((response: Response) => {
        return response.json();
      });
  }

  adaugaMembruDate() {

  }

  modificaMembruDate() {

  }

  listaMembruDate(actiune: string, id: string) {
    return this.http.put(this.apiAddress + 'api/lista', this.setPutValueGet(actiune, id))
      .map((response: Response) => {
        return response.json();
      });
  }

  getMembruDate(actiune: string, id: string) {
    return this.http.put(this.apiAddress + 'api/get/' + id, this.setPutValueGet(actiune, id))
        .map((response: Response) => {
          return response.json();
        });
  }

  get_certificatMembruDate() {

  }

  setPutValueGet(actiune: string, searchVal: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return JSON.stringify({
      'token' : currentUser.token,
      'actiune': actiune,
      'id' : searchVal
    });
  }

  setPutValueLista(actiune: string, searchVal: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return JSON.stringify({
      'token' : currentUser.token,
      'actiune': actiune,
      'cautare' : searchVal
    });
  }
}
