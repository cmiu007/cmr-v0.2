import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { Adresa, Email, DateContact } from '../../../shared/interfaces/contact.interface';
import { MembriService } from '../../../services/membri.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  @Input('formContactData')
  public formContactData; // de pus tip-ul

  isHidden = true;
  emailForm: FormGroup;
  formStatus = 0; // 0 new | 1 edit

  constructor(
    private _fb: FormBuilder,
    private _membriService: MembriService,
    private _snackBar: MdSnackBar,
    private _router: Router
  ) { }

  ngOnInit() {
    // console.log(this.formContactData);
    this.setFormStatus(this.formContactData);
    this.emailForm = this.toFormGroup(this.formContactData);
  }

  setFormStatus(data: Email): void {
    if (!data) {
      console.log('hit');
    } else {
      this.formStatus = 1;
    }
  }

  toFormGroup(data: Email) {
    const formGroup = this._fb.group({
      'id_cont': [''],
      'id_mem': [''],
      'email': ['', [Validators.required, Validators.email]],
      'telefon': ['', Validators.required],
      'dummy': ['']
    });
    if (this.formStatus === 1) {
      formGroup.patchValue(data);
    } else {
      formGroup.get('id_mem').setValue(localStorage.getItem('currentMemId'));
    }
    // clean 0000-00-00 and 0
    // Object.keys(this.formContactData).forEach(
    //   key => {
    //     if (this.formContactData[key] === '0000-00-00' || this.formContactData[key] === 0) {
    //       this.formContactData[key] = '';
    //     }
    //   }
    // );
    return formGroup;
  }

  onClickEmail(): void {
    if ( this.formStatus === 1) {
    // stergem id_cont pt api
    delete this.emailForm.value.id_cont;
    this._membriService.modificaMembruDate('contact', this.emailForm.get('id_cont').value , this.emailForm.value )
    .subscribe(
      data => {
        if (data.result !== '00') {
          this._snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
          if (data.result === '12') {
            this._router.navigate(['/login']);
          }
        } else {
          this._snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
        }
      });
      return;
    }
    delete this.emailForm.value.id_cont;
    this._membriService.adaugaMembruContact('contact', null , this.emailForm.value )
    .subscribe(
      data => {
        if (data.result !== '00') {
          this._snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
          if (data.result === '12') {
            this._router.navigate(['/login']);
          }
        } else {
          this._snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
        }
      });
    // TODO: refresh data
    // 1. get new data
    // 2. patch data in form
  }
}
