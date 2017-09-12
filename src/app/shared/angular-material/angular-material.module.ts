import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdCardModule,
  MdInputModule,
  MdToolbarModule,
  MdListModule,
  MdProgressBarModule,
  MdSnackBarModule,
  MaterialModule,
  MdMenuModule,
  MdDialogModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdCardModule,
    MdInputModule,
    MdToolbarModule,
    MdListModule,
    MdProgressBarModule,
    MdSnackBarModule,
    MaterialModule,
    MdMenuModule,
    MdDialogModule,
  ],
  declarations: [],
  exports: [
    MdButtonModule,
    BrowserAnimationsModule,
    MdCheckboxModule,
    MdCardModule,
    MdInputModule,
    MdToolbarModule,
    MdListModule,
    MdProgressBarModule,
    MdSnackBarModule,
    MaterialModule,
    MdMenuModule,
    MdDialogModule
  ]
})
export class AngularMaterialModule { }
