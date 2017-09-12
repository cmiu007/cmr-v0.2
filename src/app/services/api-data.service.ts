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

  checkData(data: Response) {
    const a = data.json();
    if (a.result === '12') {
      console.log('hit 12');
      // this._snackBar.open(a.mesaj, 'inchide', { duration: 10000 });
      // this.callDialog('title', 'message');
      return ;
    } else {
      return a;
    }
  }

  callDialog(title: string, message: string): Observable<boolean> {
    let dialogRef: MdDialogRef<AuthDialogComponent>;

    dialogRef = this._mdDialog.open(AuthDialogComponent);
    // dialogRef.componentInstance.title = title;
    // dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }
}

