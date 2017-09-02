import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Judet } from '../shared/models/registre.model';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) { }

  login(username: string, password: string) {
    const test = JSON.stringify({ email: username, password: password });
    return this.http.put('https://devel-api.cmr.ro/api/auth', JSON.stringify({ email: username, password: password }))
      .map((response: Response) => {
        const user = response.json();
        if ( user && user.token) {
          localStorage.setItem('userToken', user.token);
          localStorage.setItem('userName', user.nume);
          localStorage.setItem('userGroup', user.cmj);
          localStorage.setItem('userJudet', user.judet);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
      });
  }

  logout() {
    // localStorage.removeItem('currentUser');
    localStorage.clear();
  }
}
