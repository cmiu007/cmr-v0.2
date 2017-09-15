import { NgModule } from '@angular/core';
import { MdDialogModule, MdButtonModule, MdInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApiDataService } from '../../services/api-data.service';
import { AuthDialogComponent } from './auth-dialog.component';

@NgModule({
imports: [
  MdDialogModule,
  MdButtonModule,
  MdInputModule,
  FormsModule,
  ReactiveFormsModule
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

