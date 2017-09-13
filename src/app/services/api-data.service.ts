import { Injectable } from '@angular/core';

import { MdSnackBar, MdDialogRef } from '@angular/material';
import { Response } from '@angular/http';
import { MdDialog } from '@angular/material';
import { AuthDialogComponent } from '../shared/auth-dialog/auth-dialog.component';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiDataService {

  constructor(
    private _snackBar: MdSnackBar,
    private _mdDialog: MdDialog
  ) { }

  checkApiResponse( response ) {
    if (response.mesaj) {

    }
    console.log(response);
    return response;
  }

  callDialog(title: string, message: string): Observable<boolean> {
    let dialogRef: MdDialogRef<AuthDialogComponent>;

    dialogRef = this._mdDialog.open(AuthDialogComponent);
    // dialogRef.componentInstance.title = title;
    // dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }
}

