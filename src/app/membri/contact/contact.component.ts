import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { DateContact, Adresa, Email } from '../../shared/interfaces/contact.interface';
import { MembriService } from '../../services/membri.service';
import { Response } from '@angular/http';
import { Tara, Judet } from '../../shared/models/registre.model';
import { ApiDataService } from '../../services/api-data.service';
import { FormSetService } from '../../services/form-set.service';
import { ApiData } from '../../shared/interfaces/message.interface';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  public static _formDataChanged: Subject<boolean> = new Subject;

  loading = true;
  contactForm: FormGroup;
  contactData: Email[];
  adreseData;

  constructor(
    private _apiData: ApiDataService,
    private _fb: FormBuilder,
    private _aRoute: ActivatedRoute,
    private _formSet: FormSetService,
  ) { }

  ngOnInit() {
    this.setHeader();
    this.setForm();
    console.log(this.contactForm);
    // de revazut la momentul add new address
    // ContactComponent._formDataChanged
    //  .subscribe(result => this.getFormData());
    ContactComponent._formDataChanged
      .subscribe(res => this.setForm());
  }

  private setHeader(): void {
    localStorage.setItem('currentPage', 'Date Contact');
  }

  private setForm(): void {
    this.loading = true;
    // 1. get nr tel si email
    this._apiData.apiLista('contact', this._aRoute.snapshot.params['id'])
    .subscribe((response: ApiData) => {
      if (response.status === 0) {
        return;
      }
      this.contactData = response.data;
      this.loading = false;
    });

    this._apiData.apiLista('adrese', this._aRoute.snapshot.params['id'])
    .subscribe((response: ApiData) => {
      if (response.status === 0) {
        return;
      }
      this.adreseData = response.data;
      this.loading = false;
    });


  }

  toFormGroup() {
    const formGroup = this._fb.group({
      adrese: this._fb.array([])
    });
    return formGroup;
  }
}
