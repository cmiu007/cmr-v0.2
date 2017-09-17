import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormSetService } from '../../../services/form-set.service';
import { Tara, Judet } from '../../../shared/models/registre.model';
import { ContactComponent } from '../contact.component';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adrese-list',
  templateUrl: './adrese-list.component.html',
  styleUrls: ['./adrese-list.component.css']
})
export class AdreseListComponent implements OnInit {
  @Input('adreseData')
  public adreseData; // de pus tip-ul

  @Input('contactForm')
  public contactForm: FormGroup;

  registruTara: Tara[];

  registruJudet: Judet[];

  delValRegJud = ['ADM', 'CMR'];

  addActive = true;

  constructor(
    private _formSet: FormSetService,
    private _aRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.setRegistre();
    // this.formAdrese.addControl('adrese', new FormArray([]));
  }

  private setRegistre(): void {
    this.registruTara = this._aRoute.snapshot.data['regTara'];
    this.registruJudet = this._aRoute.snapshot.data['regJud'];
    this.delValRegJud.forEach(element => {
      this.registruJudet = this.registruJudet.filter(option => option.nume !== element);
    });
  }

  addAdresa(): void {
    const newAdresaData = this._formSet.adresa(null).value;
    this.adreseData.unshift(newAdresaData);
    this.addActive = !this.addActive;
  }
}
