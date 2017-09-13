import { MdDialogModule, MdButtonModule, MdInputModule } from '@angular/material';
import { NgModule } from '@angular/core';

import { ApiDataService } from '../../services/api-data.service';
import { AuthDialogComponent } from './auth-dialog.component';

@NgModule({
imports: [
  MdDialogModule,
  MdButtonModule,
  MdInputModule,
],
exports: [
  AuthDialogComponent
],
declarations: [
  AuthDialogComponent
],
providers: [
  ApiDataService
],
entryComponents: [
  AuthDialogComponent
]
})

export class AuthDialogModule { }

