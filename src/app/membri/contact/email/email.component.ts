import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { Adresa, Contact, DateContact } from '../../../shared/interfaces/contact.interface';
import { MembriService } from '../../../services/membri.service';
import { Router } from '@angular/router';
import { FormSetService } from '../../../services/form-set.service';
import { AlertSnackbarService } from '../../../services/alert-snackbar.service';
import { ApiDataService } from '../../../services/api-data.service';
import { ContactComponent } from '../contact.component';
import { ApiData } from '../../../shared/interfaces/message.interface';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  @Input('contactData')
  public contactData; // de pus tip-ul

  loading = false;
  isHidden = true;
  contactForm: FormGroup;
  formStatus = 'new'; // 0 new | 1 edit

  constructor(
    private _formSet: FormSetService,
    private _snackBar: AlertSnackbarService,
    private _apiData: ApiDataService,

    private _membriService: MembriService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.setFormStatus(this.contactData[0]);
    this.setForm();
    // this.contactForm = this.toFormGroup(this.contactData);
  }

  setFormStatus(data: Contact): void {
    if (!data) {
      return;
    } else {
      this.formStatus = 'edit';
    }
  }

  private setForm(): void {
    this.contactForm = this._formSet.contact(this.contactData[0]);
    if (this.formStatus === 'new') {
      this.contactForm.get('id_mem').setValue(localStorage.getItem('currentMemId'));
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid === false) {
      this._snackBar.showSnackBar('Formular Invalid');
      return;
    }
    this.loading = true;
    const formData: Contact = this.contactForm.value;
    if (this.formStatus === 'new') {
      delete formData.id_cont;
      this._apiData.apiAdauga('contact', formData)
      .subscribe((response: ApiData) => {
        if (response.status === 0) {
          return;
        }
        ContactComponent._formDataChanged.next();
      });
      return;
    }
    // Api: trateaza gresit editarea, daca se pune id nu il ia in considerare!!!
    delete formData.id_cont;
    const contactId = this.contactForm.get('id_cont').value;
    console.log('hit');
    this._apiData.apiModifica('contact', contactId, formData)
    .subscribe((response: ApiData) => {
      if (response.status === 0) {
        return;
      }
      ContactComponent._formDataChanged.next();
    });
    return;
  }
}
