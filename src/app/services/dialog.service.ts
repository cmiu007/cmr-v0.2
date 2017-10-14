import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { AuthDialogComponent } from '../shared/auth-dialog/auth-dialog.component';

@Injectable()
export class DialogService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public authDialog(): Observable<boolean> {
    let dialogRef: MatDialogRef<AuthDialogComponent>;
    dialogRef = this._dialog.open(AuthDialogComponent);
    return dialogRef.afterClosed();
  }
}
