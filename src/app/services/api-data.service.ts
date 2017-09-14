import { Injectable } from '@angular/core';

import { MdSnackBar, MdDialogRef } from '@angular/material';
import { Response } from '@angular/http';
import { MdDialog } from '@angular/material';
import { AuthDialogComponent } from '../shared/auth-dialog/auth-dialog.component';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class ApiDataService {

  constructor(
    private _snackBar: MdSnackBar,
    private _mdDialog: MdDialog,
    private _router: Router
  ) { }

  checkApiResponse(response): void {
    if (response.result === '12') {
      this._snackBar.open(response.mesaj, 'inchide', { duration: 5000 });
      this._router.navigate(['/login']);
    }
    return;
  }

  callDialog(title: string, message: string): Observable<boolean> {
    let dialogRef: MdDialogRef<AuthDialogComponent>;

    dialogRef = this._mdDialog.open(AuthDialogComponent);
    // dialogRef.componentInstance.title = title;
    // dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }
}

