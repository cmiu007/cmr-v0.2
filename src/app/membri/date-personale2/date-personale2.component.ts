import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { MembriService } from '../../services/membri.service';
import { NomenclatorService } from '../../services/nomenclator.service';

@Component({
  selector: 'app-date-personale2',
  templateUrl: './date-personale2.component.html',
  styleUrls: ['./date-personale2.component.css']
})
export class DatePersonale2Component implements OnInit {
  formDatePersonale: FormGroup;
  loading = true;
  newMember = false;
  listaJudete: any;
  listaTari: any;
  listaFacultati: any;

  constructor(
    private membriService: MembriService,
    private nomeclatorService: NomenclatorService,
    private snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.formDatePersonale = formBuilder.group({
      'cuim': [''],
      'cnp': ['', Validators.required],
      'jud_id': ['', Validators.required],
      'status': [],
      'data_juramant': ['', Validators.required],
      'cod_parafa': [''],
      'nume': ['', Validators.required],
      'initiala': [''],
      'prenume': ['', Validators.required],
      'nume_ant': [''],
      'cetatenie': [''],
      'act_ident_tip_id': ['', Validators.required], // TODO: validator
      'act_ident_serie': ['', Validators.required],
      'act_ident_nr': ['', Validators.required],
      'act_ident_exp_date': ['', Validators.required],
      'fac_absolv': ['', Validators.required],
      'fac_promotie': ['', Validators.required], // TODO: validator
      'fac_dipl_serie': [''],
      'fac_dipl_nr': [''],
      'fac_dipl_data': [''],
      'fac_dipl_adev': [''],
      'updated': [''],
      'ro': ['']
    });
   }

  ngOnInit() {
    this.nomeclatorService.getNomenclator('jud')
      .subscribe(
        data => {
          this.listaJudete = data;
          console.log(this.listaJudete);
        }
      );
    if (this.route.snapshot.params['id'] == null ) {
      this.loading = false;
      this.newMember = true;
     } else {
    this.membriService.getMembruDate('date_personale', this.route.snapshot.params['id'])
      .subscribe(
        data => {
            if (data.result === '12') {
              this.snackBar.open( data.mesaj, 'inchide', { duration: 5000});
              // TODO: trebuie sa plece catre login cu calea de intoarcere :)
            } else {
              this.formDatePersonale.patchValue(data);
            }
            this.loading = false;
      });
    }
  }

  displayJud(judet): string {
    // TODO: remove console.log('displayJud: ' + judet + ' judet.id: ' + judet.id + ' judet.name: ' + judet.nume);
    return judet ? judet.nume : judet.id;
  }
  log() {
    // luam id valoare din jud_id
    const valoare = this.formDatePersonale.get('jud_id').value;
    console.log('valoare = ' + valoare);
    // facem patch la formular inainte de trimitere
    // this.formDatePersonale.patchValue({jud_id: valoare});
    // this.datePersForm.patchValue({id_mem: this.datePers.id_mem});
    console.log(this.formDatePersonale.value);
    // console.log(this.newMember);
    // console.log(this.listaJudete);
  }

}
