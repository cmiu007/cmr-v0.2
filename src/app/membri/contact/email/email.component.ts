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
  @Input('contactData')
  public contactData; // de pus tip-ul

  @Input('contactForm')
  public contactForm: FormGroup;

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
    // console.log(this.contactData);
    this.setFormStatus(this.contactData);
    this.emailForm = this.toFormGroup(this.contactData);
  }

  setFormStatus(data: Email): void {
    if (!data) {

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
    // Object.keys(this.contactData).forEach(
    //   key => {
    //     if (this.contactData[key] === '0000-00-00' || this.contactData[key] === 0) {
    //       this.contactData[key] = '';
    //     }
    //   }
    // );
    return formGroup;
  }

  onClickEmail(): void {
    const date = this.emailForm.value;
    const idItem = date.id_cont;
    // stergem id_cont pt api
    delete date.id_cont;
    if (this.formStatus === 1) {
      this._membriService.modificaMembruDate('contact', idItem, date)
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
    this._membriService.adaugaMembruContact('contact', null , date)
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
    return;
  }
}
