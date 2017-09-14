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
    console.log(response);
    if (response.json().result === '12') {
      this._snackBar.open(response.json().mesaj, 'inchide', { duration: 5000 });
      // TODO: de rezolvat
      // this.router.navigate(['/login'], {queryParams: { returnUrl: this.router.url }});
      this.router.navigate(['/login']);
    }
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

