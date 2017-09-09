import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
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
    private globalVars: GlobalDataService,
    private router: Router,
    private snackBar: MdSnackBar
    ) {
      this.apiAddress = this.globalVars.shareObj['apiAdress'];
    }

  getAll(actiune: string, searchVal: string) {
    return this.http.put( this.apiAddress + 'api/lista', this.setPutValueLista(actiune, searchVal))
      .map((response: Response) => {
        this.checkResponse(response);
        return response.json();
      });
  }

  adaugaMembruDate(actiune: string, data: any) {
    // de pus tip data
    const token = localStorage.getItem('userToken');
    const memData = JSON.stringify({
      'token': token,
      'actiune': actiune,
      'data': data
    });
    console.log(memData);
    return this.http.put( this.apiAddress + 'api/adauga', memData)
      .map((response: Response) => {
        console.log(response.json());
        this.checkResponse(response);
        return response.json();
      });
  }

  modificaMembruDate(actiune: string, id: number, data: string) {
    return this.http.put(this.apiAddress + 'api/modifica', JSON.stringify({
      'token': localStorage.getItem('userToken'),
      'actiune': actiune,
      'id': id,
      'data': data
    }))
    .map((response: Response) => {
      this.checkResponse(response);
      return response.json();
    });
  }

  // nu are aceiasi forma cu celelante adauga !!!!
  adaugaMembruContact(actiune: string, id: number, data: string) {
    return this.http.put(this.apiAddress + 'api/adauga', JSON.stringify({
      'token': localStorage.getItem('userToken'),
      'actiune': actiune,
      'id': id,
      'data': data
    }))
    .map((response: Response) => {
      this.checkResponse(response);
      return response.json();
    });
  }

  listaMembruDate(actiune: string, id: string) {
    return this.http.put(this.apiAddress + 'api/lista', this.setPutValueGet(actiune, +id))
      .map((response: Response) => {
        this.checkResponse(response);
        return response.json();
      });
  }

  getMembruDate(actiune: string, id: string) {
    return this.http.put(this.apiAddress + 'api/get/' + id, this.setPutValueGet(actiune, +id))
        .map((response: Response) => {
          this.checkResponse(response);
          return response.json();
        });
  }

  get_certificatMembruDate() {

  }

  setPutValueGet(actiune: string, searchVal: number) {
    return JSON.stringify({
      'token' : localStorage.getItem('userToken'),
      'actiune': actiune,
      'id' : searchVal
    });
  }

  setPutValueLista(actiune: string, searchVal: string) {
    return JSON.stringify({
      'token' : localStorage.getItem('userToken'),
      'actiune': actiune,
      'cautare' : searchVal
    });
  }

  checkResponse(response) {
    if (response.json().result === '12') {
      this.snackBar.open(response.json().mesaj, 'inchide', { duration: 5000 });
      // TODO: de rezolvat
      // this.router.navigate(['/login'], {queryParams: { returnUrl: this.router.url }});
      this.router.navigate(['/login']);
    }
  }
}
