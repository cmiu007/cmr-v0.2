import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { FormSetService } from '../../services/form-set.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css']
})
export class AuthDialogComponent  {
  loginForm: FormGroup;
  loading = false;

  constructor(
    public dialogRef: MdDialogRef<AuthDialogComponent>,
    private _formSet: FormSetService

  ) {
    this.loginForm = this._formSet.login();
    console.log(this.loginForm);
   }


}
