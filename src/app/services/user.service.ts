import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../shared/models/user.model';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  apiAddress = ''
  constructor(private http: Http) { this.apiAddress = environment.apiUrl;  }

  getAll() {
    // TODO: este pt useri nu pt membri
    return this.http.get( this.apiAddress + 'api/cpp', this.jwt()).map((response: Response) => response.json());
  }

  getById(id: number) {
    return this.http.get('api/users' + id, this.jwt()).map((response: Response) => response.json());
  }

  create(user: User) {
    return this.http.post('api/users', user, this.jwt()).map((response: Response) => response.json());
  }

  update(user: User) {
    return this.http.put('api/users', user, this.jwt()).map((response: Response) => response.json());
  }

  delete(id: number) {
    return this.http.delete('api/users' + id, this.jwt()).map((response: Response) => response.json());
  }

  private jwt() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if ( currentUser && currentUser.token ) {
      const headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
      return new RequestOptions({ headers: headers });
    }
  }
}
