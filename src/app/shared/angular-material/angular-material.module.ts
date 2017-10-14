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
  MatTableModule
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
    MatTableModule
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
    MatTableModule
  ]
})
export class AngularMaterialModule { }
