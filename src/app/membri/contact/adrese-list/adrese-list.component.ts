import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormSetService } from '../../../services/form-set.service';

@Component({
  selector: 'app-adrese-list',
  templateUrl: './adrese-list.component.html',
  styleUrls: ['./adrese-list.component.css']
})
export class AdreseListComponent implements OnInit {
  @Input('formAdreseData')
  public formAdreseData; // de pus tip-ul

  @Input('formAdrese')
  public formAdrese: FormGroup;

  addActive = true;

  constructor(
    private _formSet: FormSetService
  ) { }

  ngOnInit() {
    this.formAdrese.addControl('adrese', new FormArray([]));

  }

  addAdresa(): void {
    const newAdresaData = this._formSet.adresa(null).value;
    this.formAdreseData.unshift(newAdresaData);
    this.addActive = !this.addActive;
  }

}
