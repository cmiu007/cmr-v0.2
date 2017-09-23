import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class AlertSnackbarService {
  snackDuration = 10000;

  constructor(
    private _snackBar: MdSnackBar
  ) { }


  showSnackBar(data) {
    this._snackBar.open(data, 'Inchide', { duration: this.snackDuration} );
  }
}
