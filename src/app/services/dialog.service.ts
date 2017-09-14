import { Injectable } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { AuthDialogComponent } from '../shared/auth-dialog/auth-dialog.component';

@Injectable()
export class DialogService {

  constructor(
    private _dialog: MdDialog
  ) { }

  public authDialog(): Observable<boolean> {
    let dialogRef: MdDialogRef<AuthDialogComponent>;
    dialogRef = this._dialog.open(AuthDialogComponent);
    return dialogRef.afterClosed();
  }
}
