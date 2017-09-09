import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Adresa } from '../../../shared/interfaces/contact.interface';
import { Avizare } from '../../../shared/interfaces/avizari.interface';
import { Asigurator } from '../../../shared/models/registre.model';
import { FormSetService } from '../../../services/form-set.service';

@Component({
  selector: 'app-avizare',
  templateUrl: './avizare.component.html',
  styleUrls: ['./avizare.component.css']
})
export class AvizareComponent implements OnInit {
  @Input('formAvizareData')
  public formAvizareData: Avizare;

  @Input('registruAsiguratori')
  public registruAsiguratori: Asigurator[];

  formStatus = 0;
  isAdmin = false;
  isHidden = true;
  itemName: string;
  avizareForm: FormGroup;

  filteredAsigurator;

  constructor(
    private _formSet: FormSetService,
  ) { }

  ngOnInit() {
    this.avizareForm = this._formSet.avizare(this.formAvizareData);
    this.setFormStatus();
    this.setFormName();
  }

  setFormStatus(): void {
    if (this.avizareForm.get('id_dlp').value) {
      this.formStatus = 1;
    }
  }

  setFormName(): void {
    if (this.avizareForm.get('dlp_data_start').value) {
    this.itemName = 'Din ' + this.avizareForm.get('dlp_data_start').value + ' pana la ' + this.avizareForm.get('dlp_data_end').value;
    return;
  }
    this.itemName = 'Avizare Noua';
  }

  onClickAvizare(): void {
    console.log(this.avizareForm);
  }
}
