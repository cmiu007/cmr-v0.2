import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { MembriService } from '../../services/membri.service';
import { NomenclatorService } from '../../services/nomenclator.service';
import { Judet, Tara, Fac } from '../../shared/models/registre.model';

@Component({
  selector: 'app-date-personale',
  templateUrl: './date-personale.component.html',
  styleUrls: ['./date-personale.component.css']
})
export class DatePersonaleComponent implements OnInit {
  // formStatus:
  // 0 - read-only - vine din json
  // 1 - edit - vine din json
  // 2 - newMember - vine din cale
  // TODO: sa vina din json direct in functie de user e mai sigur
  // 3 - admin - vine din local storage cmj -
  // TODO: de implementat roluri pt dezvoltarea ulterioara
  formStatus = 0; // case read-only (default), edit, newMember, admin
  formDatePersonale: FormGroup;
  loading = true;

  listaJudete = [];
  filtruJudete: Observable<Judet[]>;

  listaTari = [];
  filtruTari: Observable<Tara[]>;

  listaFac = [];
  filtruFac: Observable<Fac[]>;

  // TODO: de adus din api | extindere api
  listaActIdentTip = [
    { id: 1, nume: 'Carte de identitate' },
    { id: 2, nume: 'Buletin de identitate' },
    { id: 3, nume: 'Pasaport' },
    { id: 4, nume: 'Permis de sedere' }
  ];

  // TODO: de adus din api | extindere api
  listaTipDocFac = [
    { id: 1, nume: 'Diploma' },
    { id: 2, nume: 'Adeverinta' },
    { id: 3, nume: '(UE) Diploma' },
    { id: 4, nume: 'Confirmare MS' } // TODO: de clarificat la avizari denumirea pt medicii care au absolvit in alte tari
  ]

  constructor(
    private membriService: MembriService,
    private nomeclatorService: NomenclatorService,
    private snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.formDatePersonale = formBuilder.group({
      'cuim': [{ value: '', disabled: true }],
      'cnp': [{ value: '', disabled: true }, [Validators.required, this.checkCNP]],
      'jud_id': [{ value: '', disabled: true }, Validators.required],
      'status': [{ value: '', disabled: true }],
      'data_juramant': [{ value: '', disabled: true }, [Validators.required, this.checkDate]],
      'cod_parafa': [{ value: '', disabled: true }],
      'nume': [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      'initiala': [{ value: '', disabled: true }],
      'prenume': [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      'nume_ant': [{ value: '', disabled: true }],
      'cetatenie': [{ value: '', disabled: true }, Validators.required],
      'act_ident_tip_id': [{ value: '', disabled: true }, Validators.required], // TODO: validator
      'act_ident_serie': [{ value: '', disabled: true }, Validators.required],
      'act_ident_nr': [{ value: '', disabled: true }, Validators.required],
      'act_ident_exp_date': [{ value: '', disabled: true }, [Validators.required, this.checkDate]],
      'fac_absolv': [{ value: '', disabled: true }, Validators.required],
      'fac_promotie': [{ value: '', disabled: true }, [Validators.required, this.checkAnPromotie]],
      'fac_dipl_serie': [{ value: '', disabled: true }, Validators.required],
      'fac_dipl_nr': [{ value: '', disabled: true }, Validators.required],
      'fac_dipl_data': [{ value: '', disabled: true }, [Validators.required, this.checkDate]],
      'fac_dipl_adev': [{ value: '', disabled: true }, Validators.required],
      'updated': [{ value: '', disabled: true }],
      'ro': [{ value: '', disabled: true }]
    });
  }

  ngOnInit() {
    this.fillFormData();
    // get nomeclatoare & set filters
    this.nomeclatorService.getNomenclator('jud')
      .subscribe(
      data => {
        this.listaJudete = data
          // TODO: de modificat api, nu are rost sa intoarcem ADM si restul de mai jos daca sunt pt uz intern
          //  de scos Buc Sectoare din lista
          // acelasi lucru sa fie facut dinamic si pt CPP
          .filter(option => option.nume !== 'ADM')
          .filter(option => option.nume !== 'CMR')
        // .filter(option => option.nume !== new RegExp(`Alb`, 'gm'));;
      }
      );
    this.filtruJudete = this.formDatePersonale.get('jud_id').valueChanges
      .startWith(null)
      .map(judet => judet && typeof judet === 'object' ? judet.nume : judet)
      .map(nume => nume ? this.filterJud(nume) : this.listaJudete.slice());
    this.nomeclatorService.getNomenclator('tara')
      .subscribe(data => { this.listaTari = data; });
    this.filtruTari = this.formDatePersonale.get('cetatenie').valueChanges
      .startWith(null)
      .map(tara => tara && typeof tara === 'object' ? tara.nume : tara)
      .map(nume => nume ? this.filterTari(nume) : this.listaTari.slice());
    this.nomeclatorService.getNomenclator('facultate')
      .subscribe(data => { this.listaFac = data; });
    this.filtruFac = this.formDatePersonale.get('fac_absolv').valueChanges
      .startWith(null)
      .map(fac => fac && typeof fac === 'object' ? fac.nume : fac)
      .map(nume => nume ? this.filterFac(nume) : this.listaFac.slice());
  }

  fillFormData() {
    if (this.route.snapshot.params['id'] == null) {
      this.loading = false;
      this.formStatus = 2;
      this.enableNewMember();
    } else {
      this.membriService.getMembruDate('date_personale', this.route.snapshot.params['id'])
        .subscribe(
        data => {
          if (data.result === '12') {
            this.snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
            this.router.navigate(['/login']);
            // TODO: trebuie sa se intoarca tot aici
          } else {
            this.formDatePersonale.patchValue(data);
            this.setFormMode();
          }
          this.loading = false;
        });
    }
  }

  setFormMode() {
    // TODO: set formStatus de mutat in functie separata | service
    if (this.formDatePersonale.get('ro').value === 'true') {
      this.formStatus = 0;
    } else {
      this.formStatus = 1;
    }
    // check if admin set: jud_id = 160 (ADM)

    if ((JSON.parse(localStorage.getItem('currentUser'))).cmj === 160) {
      console.log('hit 129')
      this.formStatus = 3;
    }

    if (this.formStatus === 3) {
      this.enableAdmin();
    }
    if (this.formStatus === 1) {
      this.enableRW();
    }
    if (this.formStatus === 2) {
      this.enableNewMember();
    }
  }

  enableRW() {
    this.formDatePersonale.get('nume').enable();
    this.formDatePersonale.get('initiala').enable();
    this.formDatePersonale.get('prenume').enable();
    this.formDatePersonale.get('nume_ant').enable();
    this.formDatePersonale.get('act_ident_tip_id').enable();
    this.formDatePersonale.get('act_ident_serie').enable();
    this.formDatePersonale.get('act_ident_nr').enable();
    this.formDatePersonale.get('act_ident_exp_date').enable();
    // TODO: de facut if pt tipul actului de fac
    // daca act === diploma nu face enable
    this.formDatePersonale.get('fac_dipl_adev').enable();
    this.formDatePersonale.get('fac_dipl_serie').enable();
    this.formDatePersonale.get('fac_dipl_nr').enable();
    this.formDatePersonale.get('fac_dipl_data').enable();
    // TODO: daca cod_parafa !== null ramane disabled
    this.formDatePersonale.get('cod_parafa').enable();
  }

  enableNewMember() {
    this.enableRW();
    this.formDatePersonale.get('cnp').enable();
    this.formDatePersonale.get('data_juramant').enable();
    this.formDatePersonale.get('cetatenie').enable();
    this.formDatePersonale.get('fac_absolv').enable();
    this.formDatePersonale.get('fac_promotie').enable();
    // TODO: completeaza automat judet pe baza jud_id al operatorului
  }

  enableAdmin() {
    this.enableRW();
    this.enableNewMember();
    this.formDatePersonale.get('jud_id').enable();

  }

  filterJud(nume: string): Judet[] {
    return this.listaJudete
      .filter(option => new RegExp(`^${nume}`, 'gi').test(option.nume));
  }

  filterTari(nume: string): Tara[] {
    return this.listaTari
      .filter(option => new RegExp(`^${nume}`, 'gi').test(option.nume));
  }

  filterFac(nume: string): Fac[] {
    return this.listaFac
      .filter(option => new RegExp(`^${nume}`, 'gi').test(option.nume));
  }

  resetValue(formName) {
    this.formDatePersonale.controls[formName].patchValue('');
  }

  displayFnTara(option) {
    if (option) {
      return this.listaTari.find(item => item.id === +option).nume;
    }
  }

  displayFnJudet(option) {
    if (option) {
      return this.listaJudete.find(item => item.id === +option).nume;
    }
  }

  displayFnFac(option) {
    if (option) {
      return this.listaFac.find(item => item.id === +option).nume;
    }
  }

  // validari campuri

  checkCNP(control: FormGroup): { [s: string]: boolean } {
    // TODO: de verificat daca mai exista in baza de date!!
    let testValCNP = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
    let splitCNP = [];
    splitCNP = String(control.value).split('');
    let sum = 0;
    if (splitCNP.length !== 13) {
      return { 'cnpLengthIsInvalid': true };
    } else {
      for (let i = 0; i < testValCNP.length; i++) {
        sum = sum + splitCNP[i] * testValCNP[i];
      };
      if (sum % 11 != splitCNP[12]) {
        return { 'cnpCtrlSumInvalid': true }
      } else {
        return null;
      }
    }
  }

  checkAnPromotie(control: FormGroup): { [s: string]: boolean } {
    let today = new Date();
    if (control.value < 1950) {
      return { 'yearIsTooSmall': true };
    }
    if (control.value > today.getFullYear()) {
      return { 'yearIsInTheFuture': true };
    }
    return null
  }

  checkDate(control: FormGroup): { [s: string]: boolean } {
    var validateDateISO = /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/i;
    return validateDateISO.test(control.value) ? null : { 'invalidDateFormat': true };
    // TODO: check if date is in the past or in the future
    // let today = new Date();
    // let formDate = new Date(control.value);
    // if (today > formDate ) {
    //   console.log('Date is in the past');
    // } else {
    //   console.log('Date is in the future');
    // }
  }

  // log submit
   log() {
    console.log(this.formDatePersonale);
  }

  test() {
    console.log(this.listaFac);
  }
}
