import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  // public static formData: Subject<any> = new Subject;
  // de revazut la momentul add new address

  loading = true;
  formStatus: number;
  regTara;
  regJudet;
  formContactData: Email[];
  formAdreseData;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _memService: MembriService,
    private _snack: MdSnackBar
  ) { }

  ngOnInit() {
    localStorage.setItem('currentPage', 'Date Contact');
    this.regTara = this._activatedRoute.snapshot.data['regTara'];
    this.regTara = this._activatedRoute.snapshot.data['regJud'];
    this.getFormData();
    // de revazut la momentul add new address
    // ContactComponent.formData.subscribe(result => this.getFormData());
  }

  getFormData() {
    // 1. get nr tel si email
    this._memService.listaMembruDate('contact', this._activatedRoute.snapshot.params['id'])
      .subscribe( data => {
        if (data.result === '12') {
          this._snack.open(data.mesaj, 'inchide', { duration: 5000 });
          this._router.navigate(['/login']);
        } else {
          this.formContactData = data[0];
          this.loading = false;
        }
      });
    // 2. get set adrese
    this._memService.listaMembruDate('adrese', this._activatedRoute.snapshot.params['id'])
    .subscribe( data => {
      if (data.result === '12') {
        this._snack.open(data.mesaj, 'inchide', { duration: 5000 });
        this._router.navigate(['/login']);
      } else {
        this.formAdreseData = data;
        this.loading = false;
      }
    });
  }
}
