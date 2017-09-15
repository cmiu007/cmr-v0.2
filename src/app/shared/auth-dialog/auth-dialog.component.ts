import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { FormSetService } from '../../services/form-set.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Subject } from 'rxjs/Subject';
import { AlertSnackbarService } from '../../services/alert-snackbar.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css']
})
export class AuthDialogComponent {
  loginForm: FormGroup;
  loading = false;
  submitResult: string;

  constructor(
    public dialogRef: MdDialogRef<AuthDialogComponent>,
    private _formSet: FormSetService,
    private _authService: AuthenticationService,
    private _snackBarService: AlertSnackbarService
  ) {
    this.loginForm = this._formSet.login();
  }

  onClick() {
    // nu are token sau nu este logat
    this._authService.reLogin(this.loginForm.value)
      .subscribe(
      data => {
        console.log(data);
        if ( data.result === '10' ) {
          this.submitResult = 'Autentificare esuata';
        }
        if ( data.result === '00') {
          console.log('hit');
          this._snackBarService.showSnackBar({message: 'Autentificare reusita', action: 'Inchide'});;
          this.dialogRef.close();
        }
      });
  }
}
