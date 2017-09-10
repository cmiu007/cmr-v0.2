import { Component, OnInit, Input } from '@angular/core';
import { FormSetService } from '../../../../services/form-set.service';
import { FormArray } from '@angular/forms';
import { Asigurator } from '../../../../shared/models/registre.model';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-asigurari-list',
  templateUrl: './asigurari-list.component.html',
  styleUrls: ['./asigurari-list.component.css']
})
export class AsigurariListComponent implements OnInit {
  public static addActiveSubj: Subject<boolean> = new Subject;

  @Input('avizareForm')
  public avizareForm;

  @Input('formStatus')
  public formStatus;

  addActive = true;
  registruAsiguratori: Asigurator[];

  constructor(
    private _formSet: FormSetService,
    private _aRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.avizareForm.addControl('asigurare', new FormArray([]));
    this.setRegistre();
    AsigurariListComponent.addActiveSubj
      .subscribe( result => {
        this.addActive = !this.addActive;
      });
  }

  setRegistre(): void {
    this.registruAsiguratori = this._aRoute.snapshot.data['regAsiguratori'];
  }

  addAsigurare() {
    const newAsigurareForm = this._formSet.asigurare(null);
    const arrayControl: FormArray = this.avizareForm.get('asigurare');
    arrayControl.insert(0, newAsigurareForm);
    this.addActive = !this.addActive;
  }

}
