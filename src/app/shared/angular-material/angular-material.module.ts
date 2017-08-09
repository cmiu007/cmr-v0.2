import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdButtonModule, MdCheckboxModule, MdCardModule, MdInputModule, MdToolbarModule, MdListModule, MdProgressBarModule, MdSnackBarModule, MaterialModule, MdMenuModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
    MdMenuModule
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
    MdMenuModule
  ]
})
export class AngularMaterialModule { }
