import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class NomenclatorService {
  apiAddress = '';
  constructor(private http: Http) { this.apiAddress = environment.apiUrl; }

  getNomenclator(nomenclator: string) {
    return this.http.get( this.apiAddress + 'api/' + nomenclator)
      .map((response: Response) => {
        return response.json();
      });
  }
}
