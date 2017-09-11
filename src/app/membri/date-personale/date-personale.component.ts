import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { MembriService } from '../../services/membri.service';
import { NomenclatorService } from '../../services/nomenclator.service';
import { Judet, Tara, Fac, ActIdentTip, DocFacTip } from '../../shared/models/registre.model';
import { FormValidatorsService } from '../../services/form-validators.service';
import { ItemRegLista } from '../../shared/interfaces/listareg.interface';
import { ItemRegFac } from '../../shared/interfaces/fac.interface';

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

  registruJudete: ItemRegLista[];
  filtruJudete: Observable<Judet[]>;

  registruTari: ItemRegLista[];
  filtruTari: Observable<Tara[]>;

  registruFac: ItemRegLista[];
  filtruFac: Observable<Fac[]>;

  // TODO: de adus din api | extindere api
  registruActIdentTip: ActIdentTip[] = [
    { id: 1, nume: 'Carte de identitate' },
    { id: 2, nume: 'Buletin de identitate' },
    { id: 3, nume: 'Pasaport' },
    { id: 4, nume: 'Permis de sedere' }
  ];
  filtruActIdentTip: Observable<ActIdentTip[]>;

  // TODO: de adus din api | extindere api
  registruDocFacTip: DocFacTip[] = [
    { id: 1, nume: 'Diploma Licenta' },
    { id: 2, nume: 'Adeverinta' },
    { id: 3, nume: '(UE) Diploma' },
    { id: 4, nume: 'Confirmare MS' } // TODO: de clarificat la avizari denumirea pt medicii care au absolvit in alte tari
  ];
  filtruDocFacTip: Observable<DocFacTip[]>;

  constructor(
    private membriService: MembriService,
    private nomeclatorService: NomenclatorService,
    private snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private _formValidators: FormValidatorsService
  ) {
    this.formDatePersonale = formBuilder.group({
      'cuim': [{ value: '', disabled: true }],
      'cnp': [{ value: '', disabled: true }, [Validators.required, this._formValidators.checkCNP]],
      'jud_id': [{ value: '', disabled: true }, [Validators.required, this._formValidators.checkIfNumber]],
      'status': [{ value: '', disabled: true }],
      'data_juramant': [{ value: '', disabled: true }, [Validators.required, this._formValidators.checkDate]],
      'cod_parafa': [{ value: '', disabled: true }],
      'nume': [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      'initiala': [{ value: '', disabled: true }],
      'prenume': [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      'nume_ant': [{ value: '', disabled: true }],
      'cetatenie': [{ value: '', disabled: true }, [Validators.required, this._formValidators.checkIfNumber]],
      'act_ident_tip_id': [{ value: '', disabled: true }, [Validators.required, this._formValidators.checkIfNumber]], // TODO: validator
      'act_ident_serie': [{ value: '', disabled: true }, Validators.required],
      'act_ident_nr': [{ value: '', disabled: true }, Validators.required],
      'act_ident_exp_date': [{ value: '', disabled: true }, [Validators.required, this._formValidators.checkDate]],
      'fac_absolv': [{ value: '', disabled: true }, [Validators.required, this._formValidators.checkIfNumber]],
      'fac_promotie': [{ value: '', disabled: true }, [Validators.required, this._formValidators.checkAnPromotie]],
      'fac_dipl_serie': [{ value: '', disabled: true }, Validators.required],
      'fac_dipl_nr': [{ value: '', disabled: true }, Validators.required],
      'fac_dipl_data': [{ value: '', disabled: true }, [Validators.required, this._formValidators.checkDate]],
      'fac_doc_tip': [{ value: '', disabled: true }, Validators.required],
      'updated': [{ value: '', disabled: true }],
      'ro': [{ value: '', disabled: true }]
    });
  }

  ngOnInit() {
    localStorage.setItem('currentPage', 'Date Personale');
    this.setRegistre();
    this.fillFormData();
    // get nomeclatoare & set filters
  }

  setRegistre(): void {
    this.registruJudete = this.route.snapshot.data['regJud'];
    const delValRegJud = ['ADM', 'CMR'];
    delValRegJud.forEach(element => {
      this.registruJudete = this.registruJudete.filter(option => option.nume !== element);
    });
    this.filtruJudete = this.formDatePersonale.get('jud_id').valueChanges
      .startWith(null)
      .map(judet => judet && typeof judet === 'object' ? judet.nume : judet)
      .map(nume => nume ? this.filterJud(nume) : this.registruJudete.slice());

    this.registruTari = this.route.snapshot.data['regTara'];
    this.filtruTari = this.formDatePersonale.get('cetatenie').valueChanges
      .startWith(null)
      .map(tara => tara && typeof tara === 'object' ? tara.nume : tara)
      .map(nume => nume ? this.filterTari(nume) : this.registruTari.slice());

    this.registruFac = this.route.snapshot.data['regFac'];
    this.filtruFac = this.formDatePersonale.get('fac_absolv').valueChanges
      .startWith(null)
      .map(fac => fac && typeof fac === 'object' ? fac.nume : fac)
      .map(nume => nume ? this.filterFac(nume) : this.registruFac.slice());

    this.filtruActIdentTip = this.formDatePersonale.get('act_ident_tip_id').valueChanges
      .startWith(null)
      .map(idTip => idTip && typeof idTip === 'object' ? idTip.nume : idTip)
      .map(nume => nume ? this.filterActIdentTip(nume) : this.registruActIdentTip.slice());

    this.filtruDocFacTip = this.formDatePersonale.get('fac_doc_tip').valueChanges
      .startWith(null)
      .map(docFacTip => docFacTip && typeof docFacTip === 'object' ? docFacTip.nume : docFacTip)
      .map(nume => nume ? this.filterDocFacTip(nume) : this.registruDocFacTip.slice());
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
    this.formDatePersonale.get('fac_doc_tip').enable();
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
    this.formDatePersonale.get('cetatenie').setValue('1183');
    this.formDatePersonale.get('fac_absolv').enable();
    this.formDatePersonale.get('fac_promotie').enable();
    // TODO: completeaza automat judet pe baza jud_id al operatorului
    this.formDatePersonale.get('jud_id').enable();
    this.formDatePersonale.patchValue({ 'jud_id': localStorage.getItem('userGroup') });
  }

  enableAdmin() {
    this.enableRW();
    this.enableNewMember();
    this.formDatePersonale.get('jud_id').enable();
  }

  filterJud(nume: string): Judet[] {
    return this.registruJudete
      .filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  filterTari(nume: string): Tara[] {
    return this.registruTari
      .filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  filterFac(nume: string): Fac[] {
    return this.registruFac
      .filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  filterActIdentTip(nume: string): ActIdentTip[] {
    return this.registruActIdentTip
      .filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  filterDocFacTip(nume: string): ActIdentTip[] {
    return this.registruDocFacTip
      .filter(option => new RegExp(`${nume}`, 'gi').test(option.nume));
  }

  displayFnTara(option) {
    if (option) {
      return this.registruTari.find(item => item.id === +option).nume;
    }
  }

  displayFnJudet(option) {
    if (option) {
      return this.registruJudete.find(item => item.id === +option).nume;
    }
  }

  displayFnFac(option) {
    if (option) {
      return this.registruFac.find(item => item.id === +option).nume;
    }
  }

  displayFnActIdentTip(option) {
    if (option) {
      return this.registruActIdentTip.find(item => item.id === +option).nume;
    }
  }

  displayFnDocFacTip(option) {
    if (option) {
      return this.registruDocFacTip.find(item => item.id === +option).nume;
    }
  }
  // log submit
  editDateMember() {
    if (this.formStatus === 2) {
      const memData = this.formDatePersonale.value;
      this.membriService.adaugaMembruDate('date_personale', this.formDatePersonale.value)
        .subscribe(
        data => {
          if (data.result !== '00') {
            this.snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
            if (data.result === '12') {
              this.router.navigate(['/login']);
            }
          } else {
            this.snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
            localStorage.setItem('currentMemNume',
              (this.formDatePersonale.get('nume').value + ' ' + this.formDatePersonale.get('prenume').value));
            localStorage.setItem('currentMemId', data.id_med);
            this.router.navigate(['/membri', data.id_med, 'datepersonale']); // de adaugat id-ul
          }
        }
        );
      return;
    }
    this.formDatePersonale.get('jud_id').enable();
    this.membriService.modificaMembruDate('date_personale', +localStorage.getItem('currentMemId'), this.formDatePersonale.value)
      .subscribe(
      data => {
        if (data.result !== '00') {
          this.snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
        } else {
          this.snackBar.open(data.mesaj, 'inchide', { duration: 5000 });
          this.router.navigate(['/membri', localStorage.getItem('currentMemId'), 'datepersonale']); // de adaugat id-ul
        }
      }
      );
  }

  test() {
    console.log(this.registruFac);
  }
}
