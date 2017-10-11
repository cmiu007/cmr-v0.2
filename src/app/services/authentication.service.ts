import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Judet } from '../shared/models/registre.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http,
    private _router: Router) { }

  login(username: string, password: string) {
    const test = JSON.stringify({ email: username, password: password });
    return this.http.put('https://devel-api.cmr.ro/api/auth', JSON.stringify({ email: username, password: password }))
      .map((response: Response) => {
        this.setLocalStorage(response);
        // de revazut ce intoarcem si de ce intoarcem ceva
        return JSON.parse(response.text());
      });
  }

  reLogin(data) {
    // 2. login
    return this.http
      .put('https://devel-api.cmr.ro/api/auth', data)
      .map((response: Response) => {
        this.setLocalStorage(response);
        return JSON.parse(response.text());
      });
    // trebuie sa aiba si un catch pt erori.
    // in caz de eroare stop joc
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
  }

  setLocalStorage(response: Response): string {
    const data = JSON.parse(response.text());
    if (data.result === '00') {
      sessionStorage.setItem('userToken', data.token);
      sessionStorage.setItem('userName', data.nume);
      sessionStorage.setItem('userGroup', data.cmj);
      sessionStorage.setItem('userJudet', data.judet);
      sessionStorage.setItem('currentUser', JSON.stringify(data));
    }
    if (data.result === '10') {
      // auth error
      return;
    }
    // dumnezeu cu mila
  }
}
