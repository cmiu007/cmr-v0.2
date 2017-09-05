import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(
    private _fb: FormBuilder,
    private _membriService: MembriService,
    private _snackBar: MdSnackBar,
    private _router: Router
  ) { }

  ngOnInit() {
    // console.log(this.formContactData);
    this.emailForm = this.toFormGroup(this.formContactData);
    console.log(this.emailForm);
  }

  toFormGroup(data: Email) {
    const formGroup = this._fb.group({
      'id_cont': [{ value: '' }],
      'id_mem': [{ value: '' }],
      'email': [{ value: '' }],
      'telefon': [{ value: '' }],
      'dummy': [{ value: '' }]
    });
    formGroup.patchValue(data);
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
    // totusi am nevoie de formStatus ca sa fie new sau edit
    this._membriService.modificaMembruDate('contact', this.emailForm.get('id_mem').value , this.emailForm.value)
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
      }
      );
  }
}
