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

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  // public static _formDataChanged: Subject<boolean> = new Subject;
  // de revazut la momentul add new address
  @Input('formAdrese')
  formAdrese: FormGroup;

  loading = true;
  formStatus: number;
  registruTara: Tara[];
  registruJudet: Judet[];
  delValRegJud = ['ADM', 'CMR'];
  formContactData: Email[];
  formAdreseData;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _memService: MembriService,
    private _snack: MdSnackBar,
    private _fb: FormBuilder,
    private _aRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    localStorage.setItem('currentPage', 'Date Contact');
    this.setRegistre();
    this.getFormData();
    this.formAdrese = this.toFormGroup();
    // de revazut la momentul add new address
    // ContactComponent._formDataChanged
    //  .subscribe(result => this.getFormData());
  }

  setRegistre(): void {
    this.registruTara = this._aRoute.snapshot.data['regTara'];
    this.registruJudet = this._aRoute.snapshot.data['regJud'];
    this.delValRegJud.forEach(element => {
      this.registruJudet = this.registruJudet.filter(option => option.nume !== element);
    });
  }

  getFormData() {
    this.loading = true;
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

  toFormGroup() {
    const formGroup = this._fb.group({
      adrese: this._fb.array([])
    });
    return formGroup;
  }
}
