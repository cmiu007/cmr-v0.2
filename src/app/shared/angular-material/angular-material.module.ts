import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatInputModule,
  MatToolbarModule,
  MatListModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatMenuModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatIconModule,
  MatSelectModule,
  MatTableModule,
  MatRadioModule,
  MatSlideToggleModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatListModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatRadioModule,
    MatSlideToggleModule
  ],
  declarations: [],
  exports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatListModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatRadioModule,
    MatSlideToggleModule
  ]
})
export class AngularMaterialModule { }
