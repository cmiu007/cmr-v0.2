import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { FormValidatorsService } from './form-validators.service';

import { Adresa, Contact } from '../shared/interfaces/contact.interface';
import { Avizare } from '../shared/interfaces/avizari.interface';
import { Asigurare } from '../shared/interfaces/asigurari.interface';
import { DatePersonale } from '../shared/interfaces/datepersonale.interface';
import { Cpp } from '../shared/interfaces/cpps.interface';
import { Certificat } from '../shared/interfaces/certificate.interface';
import { AlertSnackbarService } from './alert-snackbar.service';
import { Titlu } from '../shared/interfaces/titluri.interface';

@Injectable()
export class FormSetService {

  constructor(
    private _fb: FormBuilder,
    private _validator: FormValidatorsService,
    private _snackBar: AlertSnackbarService
  ) { }

  login(): FormGroup {
    return this._fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]]
    });
  }

  datePersonale(data: DatePersonale): FormGroup {
    const formGroupEmpty = this._fb.group({
      'cuim': [{ value: '', disabled: true }],
      'cnp': [{ value: '', disabled: true }, [Validators.required, this._validator.checkCNP]],
      'jud_id': [{ value: '', disabled: true }, [Validators.required, this._validator.checkIfNumber]],
      'status': [{ value: '', disabled: true }],
      'data_juramant': [{ value: '', disabled: true }, [Validators.required, this._validator.checkDate]],
      'cod_parafa': [{ value: '', disabled: true }],
      'nume': [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      'initiala': [{ value: '', disabled: true }],
      'prenume': [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      'nume_ant': [{ value: '', disabled: true }],
      'cetatenie': [{ value: '', disabled: true }, [Validators.required, this._validator.checkIfNumber]],
      'act_ident_tip_id': [{ value: '', disabled: true }, [Validators.required, this._validator.checkIfNumber]], // TODO: validator
      'act_ident_serie': [{ value: '', disabled: true }, Validators.required],
      'act_ident_nr': [{ value: '', disabled: true }, Validators.required],
      'act_ident_exp_date': [{ value: '', disabled: true },
      [Validators.required, this._validator.checkDate, this._validator.isInThePast]],
      'fac_absolv': [{ value: '', disabled: true }, [Validators.required, this._validator.checkIfNumber]],
      'fac_promotie': [{ value: '', disabled: true }, [Validators.required, this._validator.checkAnPromotie]],
      'fac_dipl_serie': [{ value: '', disabled: true }, Validators.required],
      'fac_dipl_nr': [{ value: '', disabled: true }, Validators.required],
      'fac_dipl_data': [{ value: '', disabled: true }, [Validators.required, this._validator.checkDate, this._validator.isInTheFuture]],
      'fac_doc_tip': [{ value: '', disabled: true }, Validators.required],
      'updated': [{ value: '', disabled: true }],
      'ro': [{ value: '', disabled: true }]
    });
    if (data) {
      data = this.cleanData(data);
      formGroupEmpty.patchValue(data);
    }
    return formGroupEmpty;
  }

  cpps(actiune: string, data: Cpp, form?: FormGroup): FormGroup {
    switch (actiune) {
      case 'initFormCpps':
        const formGroup = this._fb.group({
          cpps: this._fb.array([
          ])
        });
        return formGroup;

      case 'addCpp':
        const b: FormGroup = form;
        return b;
      default:
        break;
    }
  }

  cpp(data: Cpp): FormGroup {
    const formGroup = this._fb.group({
      'id_cpp': [{ value: '', disabled: true }],
      'id_mem': [{ value: '' }],
      'reg_cpp_tip_id': [{ value: '' }, [this._validator.checkIfNumber, Validators.required]],
      'reg_cpp_id': [{ value: '' }, [this._validator.checkIfNumber, Validators.required]],
      'grad_prof_cpp_id': [{ value: '' }, [this._validator.checkIfNumber]],
      'date_start': [{ value: '' }, [Validators.required, this._validator.checkDate]],
      'date_end': [{ value: '' }, [this._validator.checkDate]],
      'emitent': [{ value: '' }, [Validators.required]],
      'act_serie': [{ value: '' }],
      'act_numar': [{ value: '' }],
      'act_data': [{ value: '' }],
      'act_descriere': [{ value: '' }],
      'obs': [{ value: '' }],
      'updated': [{ value: '', disabled: true }],
      'ro': [{ value: '', disabled: true }],
    });
    if (data) {
      data = this.cleanData(data);
      formGroup.patchValue(data);
    }
    return formGroup;
  }

  contact(data: Contact) {
    const formGroup = this._fb.group({
      'id_cont': [''],
      'id_mem': [''],
      'email': ['', [Validators.required, Validators.email]],
      'telefon': ['', Validators.required],
      'dummy': ['']
    });
    if (data) {
      formGroup.patchValue(data);
    }
    return formGroup;
  }

  adrese(actiune: string, data: Cpp, form?: FormGroup): FormGroup {
    switch (actiune) {
      case 'initFormCpps':
        const formGroup = this._fb.group({
          cpps: this._fb.array([
          ])
        });
        return formGroup;

      case 'addAdresa':
        const b: FormGroup = form;
        return b;
      default:
        break;
    }
  }

  adresa(data: Adresa) {
    if (data) {
      const formGroup = this._fb.group({
        'id_adresa': [data.id_adresa],
        'id_mem': [data.id_mem, [Validators.required, this._validator.checkIfNumber]],
        'tip': [data.tip, [Validators.required]],
        'tara_id': [data.tara_id, [Validators.required, this._validator.checkIfNumber]],
        'jud_id': [data.jud_id, [Validators.required, this._validator.checkIfNumber]],
        'localit': [data.localit, [Validators.required]],
        'cod_post': [data.cod_post, [this._validator.checkIfNumber]],
        'strada': data.strada,
        'nr': data.nr,
        'bl': data.bl,
        'scara': data.scara,
        'ap': data.ap,
        'tel': data.tel,
        'detinator_adresa': data.detinator_adresa,
        'fax': data.fax,
        'email': [data.email],
        'web': data.web,
        'obs': data.obs
      });
      data = this.cleanData(data);
      formGroup.patchValue(data);
      return formGroup;
    }


    const formGroupEmpty = this._fb.group({
      'id_adresa': null,
      'id_mem': [localStorage.getItem('currentMemId'), [Validators.required, this._validator.checkIfNumber]],
      'tip': [null, [Validators.required]],
      'tara_id': [1183, [Validators.required, this._validator.checkIfNumber]],
      'jud_id': [localStorage.getItem('userGroup'), [Validators.required, this._validator.checkIfNumber]],
      'localit': ['', [Validators.required]],
      'cod_post': ['', [Validators.required, this._validator.checkIfNumber]],
      'strada': '',
      'nr': '',
      'bl': '',
      'scara': '',
      'ap': '',
      'tel': '',
      'detinator_adresa': '',
      'fax': '',
      'email': '',
      'web': '',
      'obs': ''
    });
    return formGroupEmpty;
  }

  avizare(data: Avizare) {
    const formGroupEmpty = this._fb.group({
      'id_dlp': [null, [this._validator.checkIfNumber]],
      'id_mem': [null, [Validators.required, this._validator.checkIfNumber]], // de schimbat in id_certificat
      'inchis': [null, [this._validator.checkIfNumber]], // de schimbat denumirea in activ
      'dlp_data_start': ['', [Validators.required, this._validator.checkDate]],
      'dlp_data_end': ['', [Validators.required, this._validator.checkDate]],
      'status': [null, [this._validator.checkIfNumber]],
      'id_certificat': [null, [this._validator.checkIfNumber]]
    });
    if (data) {
      data = this.cleanData(data);
      formGroupEmpty.patchValue(data);
    }
    return formGroupEmpty;
  }

  asigurare(data: Asigurare) {
    const formGroupEmpty = this._fb.group({
      'id_asig': [null, [this._validator.checkIfNumber]],
      'id_mem': [null, [Validators.required, this._validator.checkIfNumber]],
      'id_asigurator': [null, [Validators.required, this._validator.checkIfNumber]],
      'id_dlp': [null, [Validators.required, this._validator.checkIfNumber]],
      'polita_serie': ['', [Validators.required]],
      'polita_nr': ['', [Validators.required]],
      'data_start': ['', [Validators.required, this._validator.checkDate]],
      'data_end': ['', [Validators.required, this._validator.checkDate]]
    });
    if (data) {
      data = this.cleanData(data);
      formGroupEmpty.patchValue(data);
    }
    return formGroupEmpty;
    // aici initializare form nou
  }


  titluri(actiune: string, data?: Titlu, form?: FormGroup): FormGroup {
    const  formGroupEmpty = this._fb.group({
      'id_cdu': [null, [this._validator.checkIfNumber]],
      'id_mem': [null, [this._validator.checkIfNumber]],
      'reg_titlu_id': [null, [this._validator.checkIfNumber]],
      'reg_facultate_id': [null, [this._validator.checkIfNumber]],
      'data_start': ['', [Validators.required, this._validator.checkDate, this._validator.isInTheFuture]],
      'data_end': ['', [this._validator.checkDate, this._validator.isInTheFuture]]
    });
    if (data) {
      data = this.cleanData(data);
    }
    switch (actiune) {
      case 'initForm':
        const formGroup = this._fb.group({
          titluri: this._fb.array([
          ])
        });
        return formGroup;

      case 'add':
        formGroupEmpty.patchValue(data);
        return formGroupEmpty;

      case 'newTitlu':
        return formGroupEmpty;

      case 'titlu':
        formGroupEmpty.patchValue(data);
        return formGroupEmpty;

      default:
        this._snackBar.showSnackBar('setFormService titluri: Actiune Invalida');
        break;
    }
  }

  certificate(actiune: string, data?: Certificat, form?: FormGroup): FormGroup {
    const formGroupEmpty = this._fb.group({
      'id_certificat': [null, [this._validator.checkIfNumber]],
      'id_mem': [null, [Validators.required, this._validator.checkIfNumber]],
      'data_start': [null, [Validators.required, this._validator.checkDate, this._validator.isToday]],
      'data_invalidare': [null, [this._validator.checkDate, this._validator.isInTheFuture]],
      'reg_cert_id': [null, [this._validator.checkIfNumber]],
      'cod_qr': [null],
      'status': [null]
    });
    if (data) {
      data = this.cleanData(data);
    }
    switch (actiune) {
      case 'initForm':
        const formGroup = this._fb.group({
          certificate: this._fb.array([
          ])
        });
        return formGroup;

      case 'add':
        formGroupEmpty.patchValue(data);
        return formGroupEmpty;

      case 'newCertificat':
        return formGroupEmpty;

      case 'certificat':
        formGroupEmpty.patchValue(data);
        return formGroupEmpty;

      default:
        this._snackBar.showSnackBar('setFormService certificate: Actiune Invalida');
        break;
    }

  }

  private cleanData(data): any {
    Object.keys(data).forEach(
      key => {
        if (data[key] === '0000-00-00' || data[key] === 0) {
          data[key] = '';
        }
      }
    );
    return data;
  }

}
