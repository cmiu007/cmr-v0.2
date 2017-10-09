import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class NomenclatorService {

  constructor(private http: Http) { }

  getNomenclator(nomenclator: string) {
    return this.http.get('https://api.cmr.ro/api/' + nomenclator)
      .map((response: Response) => {
        return response.json();
      });
  }
}
